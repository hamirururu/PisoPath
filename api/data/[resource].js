import { send, guardState, handleError } from "../_lib/http.js";
import { requireUser } from "../_lib/auth.js";
import { clearAuthCookies } from "../_lib/supabase.js";
import * as v from "../_lib/validate.js";

const SELECT = `id, category, expense_name, store_name, subcategory, amount,
  expense_date, expense_time, notes, created_at,
  transportation_details ( transportation_type, starting_point, destination )`;

const TRANSPORT = ["Jeepney", "Tricycle", "Bus", "UV Express", "MRT", "LRT", "Taxi", "Grab", "Angkas", "Motorcycle", "Other"];
const RESERVED = ["Transportation", "Food"];
const throwIf = (error) => { if (error) throw error; };
const newest = (q) => q.order("expense_date", { ascending: false }).order("expense_time", { ascending: false });

function parseExpense(kind, b) {
  const base = {
    amount: v.money(b.amount ?? b.fare),
    expense_date: v.date(b.date),
    expense_time: v.time(b.time),
    notes: v.optStr(b.notes, "Notes", 500),
  };
  if (kind === "transportation") {
    const type = v.oneOf(b.transportationType, TRANSPORT, "Transportation type");
    return {
      row: { ...base, category: "Transportation", expense_name: `${type} fare` },
      detail: {
        transportation_type: type,
        starting_point: v.str(b.startingPoint, "Starting point", 1, 120),
        destination: v.str(b.destination, "Destination", 1, 120),
      },
    };
  }
  if (kind === "food") {
    return {
      row: {
        ...base,
        category: "Food",
        expense_name: v.str(b.itemName, "Item", 1, 120),
        store_name: v.optStr(b.storeName, "Store", 120),
        subcategory: v.optStr(b.category, "Category", 60),
      },
    };
  }
  if (kind === "other") {
    const category = v.str(b.category, "Category", 1, 60);
    if (RESERVED.includes(category)) throw new v.ValidationError("Category is invalid.");
    return { row: { ...base, category, expense_name: v.str(b.expenseName, "Name", 1, 120) } };
  }
  throw new v.ValidationError("Invalid expense type.");
}

async function removeAvatars(supabase, userId) {
  const { data } = await supabase.storage.from("avatars").list(userId);
  if (data?.length) await supabase.storage.from("avatars").remove(data.map((f) => `${userId}/${f.name}`));
}

const handlers = {
  expenses: {
    GET: async ({ supabase, q }) => {
      let res;
      switch (q.mode) {
        case "amounts":
          res = await supabase.from("expenses").select("amount, category, expense_date");
          break;
        case "between":
          res = await newest(supabase.from("expenses").select(SELECT).gte("expense_date", v.date(q.from)).lte("expense_date", v.date(q.to)));
          break;
        case "recent":
          res = await newest(supabase.from("expenses").select(SELECT))
            .order("created_at", { ascending: false })
            .limit(v.int(q.limit ?? 6, 1, 50, "limit"));
          break;
        case "all":
          res = await newest(supabase.from("expenses").select(SELECT));
          break;
        case "transport":
          res = await newest(supabase.from("expenses").select(SELECT).eq("category", "Transportation"));
          break;
        case "one":
          res = await supabase.from("expenses").select(SELECT).eq("id", v.uuid(q.id)).single();
          break;
        default:
          throw new v.ValidationError("Invalid query.");
      }
      throwIf(res.error);
      return { data: res.data };
    },
    POST: async ({ supabase, body }) => {
      const { row, detail } = parseExpense(body.kind, body);
      const clientId = body.clientId ? v.uuid(body.clientId) : null;
      // user_id is NOT sent: the column default is auth.uid() from the validated session
      const ins = await supabase.from("expenses").insert({ ...row, client_id: clientId }).select("id").single();
      throwIf(ins.error);
      if (detail) {
        const d = await supabase.from("transportation_details").insert({ expense_id: ins.data.id, ...detail });
        if (d.error) {
          await supabase.from("expenses").delete().eq("id", ins.data.id);
          throw d.error;
        }
      }
      return { data: { id: ins.data.id } };
    },
    PATCH: async ({ supabase, q, body }) => {
      const id = v.uuid(q.id);
      const { row, detail } = parseExpense(body.kind, body);
      const upd = await supabase.from("expenses").update(row).eq("id", id).select("id");
      throwIf(upd.error);
      if (!upd.data.length) return { __status: 404, error: "Not found" };
      if (detail) throwIf((await supabase.from("transportation_details").update(detail).eq("expense_id", id)).error);
      return { ok: true };
    },
    DELETE: async ({ supabase, q }) => {
      const del = await supabase.from("expenses").delete().eq("id", v.uuid(q.id)).select("id");
      throwIf(del.error);
      if (!del.data.length) return { __status: 404, error: "Not found" };
      return { ok: true };
    },
  },

  categories: {
    GET: async ({ supabase }) => {
      const r = await supabase.from("custom_categories").select("id, name, icon").order("name");
      throwIf(r.error);
      return { data: r.data };
    },
    POST: async ({ supabase, body }) => {
      const r = await supabase.from("custom_categories")
        .insert({ name: v.str(body.name, "Name", 1, 60), icon: "tag" }).select("id, name, icon").single();
      throwIf(r.error);
      return { data: r.data };
    },
    DELETE: async ({ supabase, q }) => {
      throwIf((await supabase.from("custom_categories").delete().eq("id", v.uuid(q.id))).error);
      return { ok: true };
    },
  },

  routes: {
    GET: async ({ supabase, q }) => {
      if (q.kind === "favorites") {
        const r = await supabase.from("favorite_routes")
          .select("id, transportation_type, starting_point, destination, default_fare")
          .order("created_at", { ascending: false });
        throwIf(r.error);
        return { data: r.data };
      }
      const limit = v.int(q.limit ?? 5, 1, 20, "limit");
      const r = await supabase.from("transportation_details")
        .select("transportation_type, starting_point, destination").limit(200);
      throwIf(r.error);
      const counts = new Map();
      for (const x of r.data) {
        const k = `${x.transportation_type}|${x.starting_point}|${x.destination}`;
        counts.set(k, { ...(counts.get(k) ?? { ...x, count: 0 }), count: (counts.get(k)?.count ?? 0) + 1 });
      }
      return { data: [...counts.values()].sort((a, b) => b.count - a.count).slice(0, limit) };
    },
    POST: async ({ supabase, body }) => {
      const r = await supabase.from("favorite_routes").insert({
        transportation_type: v.oneOf(body.transportationType, TRANSPORT, "Type"),
        starting_point: v.str(body.startingPoint, "Starting point", 1, 120),
        destination: v.str(body.destination, "Destination", 1, 120),
        default_fare: body.defaultFare == null ? null : v.money(body.defaultFare),
      });
      if (r.error && r.error.code !== "23505") throw r.error; // already saved = fine
      return { ok: true };
    },
    DELETE: async ({ supabase, q }) => {
      throwIf((await supabase.from("favorite_routes").delete().eq("id", v.uuid(q.id))).error);
      return { ok: true };
    },
  },

  budgets: {
    GET: async ({ supabase, q }) => {
      const r = await supabase.from("budgets").select("id, category, amount, month, year")
        .eq("month", v.int(q.month, 1, 12, "month")).eq("year", v.int(q.year, 2000, 2100, "year"));
      throwIf(r.error);
      return { data: r.data };
    },
    POST: async ({ supabase, body }) => {
      const month = v.int(body.month, 1, 12, "month");
      const year = v.int(body.year, 2000, 2100, "year");
      const amount = v.money(body.amount);
      const category = body.category == null ? null : v.str(body.category, "Category", 1, 60);
      let find = supabase.from("budgets").select("id").eq("month", month).eq("year", year);
      find = category ? find.eq("category", category) : find.is("category", null);
      const existing = await find.maybeSingle();
      throwIf(existing.error);
      const w = existing.data
        ? await supabase.from("budgets").update({ amount }).eq("id", existing.data.id)
        : await supabase.from("budgets").insert({ category, amount, month, year });
      throwIf(w.error);
      return { ok: true };
    },
    DELETE: async ({ supabase, q }) => {
      throwIf((await supabase.from("budgets").delete().eq("id", v.uuid(q.id))).error);
      return { ok: true };
    },
  },

  profile: {
    PATCH: async ({ supabase, body }) => {
      const data = {};
      if (body.fullName !== undefined) data.full_name = v.str(body.fullName, "Name", 1, 80);
      if (body.dateFormat !== undefined) data.date_format = v.oneOf(body.dateFormat, ["long", "mdy", "dmy"], "Date format");
      if (!Object.keys(data).length) throw new v.ValidationError("Nothing to update.");
      throwIf((await supabase.auth.updateUser({ data })).error);
      return { ok: true };
    },
  },

  avatar: {
    POST: async ({ supabase, user, body }) => {
      const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[body.contentType];
      if (!ext || typeof body.data !== "string") throw new v.ValidationError("Please upload a JPG, PNG, or WEBP image.");
      const buf = Buffer.from(body.data, "base64");
      if (buf.length === 0 || buf.length > 2 * 1024 * 1024) throw new v.ValidationError("Image must be smaller than 2MB.");
      await removeAvatars(supabase, user.id); // drop old extension variants
      const path = `${user.id}/avatar.${ext}`;
      throwIf((await supabase.storage.from("avatars").upload(path, buf, { contentType: body.contentType, upsert: true })).error);
      const url = `${supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
      throwIf((await supabase.auth.updateUser({ data: { avatar_url: url } })).error);
      return { url };
    },
    DELETE: async ({ supabase, user }) => {
      await removeAvatars(supabase, user.id);
      throwIf((await supabase.auth.updateUser({ data: { avatar_url: null } })).error);
      return { ok: true };
    },
  },

  account: {
    DELETE: async ({ req, res, supabase, user }) => {
      await removeAvatars(supabase, user.id).catch(() => {});
      throwIf((await supabase.rpc("delete_my_account")).error); // security definer, scoped to auth.uid()
      clearAuthCookies(req, res);
      return { ok: true };
    },
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "GET" && !guardState(req, res)) return;
    const ctx = await requireUser(req, res);
    if (!ctx) return;
    const route = handlers[req.query.resource]?.[req.method];
    if (!route) return send(res, 404, { error: "Not found" });
    const out = await route({ req, res, ...ctx, body: req.body ?? {}, q: req.query });
    if (out?.__status) return send(res, out.__status, { error: out.error });
    return send(res, 200, out);
  } catch (e) {
    return handleError(res, e);
  }
}
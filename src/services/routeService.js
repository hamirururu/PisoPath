import { supabase } from "../lib/supabase";

export async function fetchFavoriteRoutes() {
  const { data, error } = await supabase
    .from("favorite_routes")
    .select("id, transportation_type, starting_point, destination, default_fare")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveFavoriteRoute({ transportationType, startingPoint, destination, defaultFare }) {
  const { error } = await supabase.from("favorite_routes").upsert(
    {
      transportation_type: transportationType,
      starting_point: startingPoint,
      destination,
      default_fare: defaultFare ?? null,
    },
    { onConflict: "user_id,transportation_type,starting_point,destination" }
  );
  if (error) throw error;
}

export async function deleteFavoriteRoute(id) {
  const { error } = await supabase.from("favorite_routes").delete().eq("id", id);
  if (error) throw error;
}

// Distinct recent routes, most-used first, from the user's own expense history
export async function fetchFrequentRoutes(limit = 5) {
  const { data, error } = await supabase
    .from("transportation_details")
    .select("transportation_type, starting_point, destination")
    .limit(200);
  if (error) throw error;

  const counts = new Map();
  for (const r of data) {
    const key = `${r.transportation_type}|${r.starting_point}|${r.destination}`;
    if (!counts.has(key)) counts.set(key, { ...r, count: 0 });
    counts.get(key).count += 1;
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}
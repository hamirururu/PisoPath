-- =====================================================
-- PisoPath schema
-- Run once in Supabase Dashboard > SQL Editor
-- =====================================================

-- Keeps updated_at current on every update
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------
-- expenses
-- -----------------------------------------------------
create table public.expenses (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid()
                 references auth.users (id) on delete cascade,
  client_id    uuid,  -- used in Stage 7 to prevent duplicates when syncing offline entries
  category     text not null
                 check (char_length(trim(category)) between 1 and 60),
  expense_name text not null
                 check (char_length(trim(expense_name)) between 1 and 120),
  store_name   text
                 check (store_name is null or char_length(store_name) <= 120),
  subcategory  text
                 check (subcategory is null or char_length(subcategory) <= 60),
  amount       numeric(12,2) not null check (amount > 0),
  expense_date date not null default ((now() at time zone 'Asia/Manila')::date),
  expense_time time not null default ((now() at time zone 'Asia/Manila')::time(0)),
  notes        text
                 check (notes is null or char_length(notes) <= 500),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, client_id)
);

create index expenses_user_date_idx
  on public.expenses (user_id, expense_date desc, expense_time desc);
create index expenses_user_category_idx
  on public.expenses (user_id, category);

create trigger expenses_set_updated_at
  before update on public.expenses
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------
-- transportation_details (1-to-1 with expenses)
-- -----------------------------------------------------
create table public.transportation_details (
  expense_id          uuid primary key
                        references public.expenses (id) on delete cascade,
  transportation_type text not null check (transportation_type in (
                        'Jeepney','Tricycle','Bus','UV Express','MRT','LRT',
                        'Taxi','Grab','Angkas','Motorcycle','Other')),
  starting_point      text not null
                        check (char_length(trim(starting_point)) between 1 and 120),
  destination         text not null
                        check (char_length(trim(destination)) between 1 and 120)
);

create index transportation_type_idx
  on public.transportation_details (transportation_type);

-- -----------------------------------------------------
-- custom_categories
-- -----------------------------------------------------
create table public.custom_categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid()
               references auth.users (id) on delete cascade,
  name       text not null check (char_length(trim(name)) between 1 and 60),
  icon       text not null default 'tag',
  created_at timestamptz not null default now()
);

create unique index custom_categories_user_name_idx
  on public.custom_categories (user_id, lower(name));

-- -----------------------------------------------------
-- favorite_routes
-- -----------------------------------------------------
create table public.favorite_routes (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null default auth.uid()
                        references auth.users (id) on delete cascade,
  transportation_type text not null check (transportation_type in (
                        'Jeepney','Tricycle','Bus','UV Express','MRT','LRT',
                        'Taxi','Grab','Angkas','Motorcycle','Other')),
  starting_point      text not null
                        check (char_length(trim(starting_point)) between 1 and 120),
  destination         text not null
                        check (char_length(trim(destination)) between 1 and 120),
  default_fare        numeric(12,2) check (default_fare is null or default_fare >= 0),
  created_at          timestamptz not null default now()
);

create unique index favorite_routes_unique_idx
  on public.favorite_routes (user_id, transportation_type, lower(starting_point), lower(destination));

-- -----------------------------------------------------
-- budgets (category NULL = total monthly budget)
-- -----------------------------------------------------
create table public.budgets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid()
               references auth.users (id) on delete cascade,
  category   text check (category is null or char_length(trim(category)) between 1 and 60),
  amount     numeric(12,2) not null check (amount > 0),
  month      integer not null check (month between 1 and 12),
  year       integer not null check (year between 2000 and 2100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index budgets_unique_idx
  on public.budgets (user_id, year, month, coalesce(category, ''));

create trigger budgets_set_updated_at
  before update on public.budgets
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------
alter table public.expenses               enable row level security;
alter table public.transportation_details enable row level security;
alter table public.custom_categories      enable row level security;
alter table public.favorite_routes        enable row level security;
alter table public.budgets                enable row level security;

create policy "Users manage own expenses"
  on public.expenses for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users manage own transportation details"
  on public.transportation_details for all to authenticated
  using (exists (
    select 1 from public.expenses e
    where e.id = expense_id and e.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.expenses e
    where e.id = expense_id and e.user_id = (select auth.uid())
  ));

create policy "Users manage own categories"
  on public.custom_categories for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users manage own favorite routes"
  on public.favorite_routes for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users manage own budgets"
  on public.budgets for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Only signed-in users get table access; anonymous visitors get none
grant select, insert, update, delete on
  public.expenses,
  public.transportation_details,
  public.custom_categories,
  public.favorite_routes,
  public.budgets
to authenticated;

-- -----------------------------------------------------
-- Account deletion (used by Settings in Stage 7)
-- Lets a signed-in user delete only their own account.
-- Cascades remove all of their data.
-- -----------------------------------------------------
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
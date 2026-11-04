create extension if not exists pgcrypto;

create type public.user_role as enum ('user','admin');
create type public.booking_status as enum ('pending_payment','paid','expired','cancelled','failed');
create type public.payment_status as enum ('pending','paid','failed','expired');
create type public.ticket_status as enum ('active','used','cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '', phone text,
  role public.user_role not null default 'user', created_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique, created_at timestamptz not null default now()
);
create table public.destinations (
  id uuid primary key default gen_random_uuid(), category_id uuid not null references public.categories(id),
  name text not null, slug text not null unique, description text not null default '', location text not null,
  opening_hours text not null default 'Buka setiap hari', status text not null default 'active' check (status in ('active','archived')),
  image_url text, facilities text[] not null default '{}', created_at timestamptz not null default now()
);
create table public.destination_images (
  id uuid primary key default gen_random_uuid(), destination_id uuid not null references public.destinations(id) on delete cascade,
  image_url text not null, alt_text text not null default '', sort_order int not null default 0
);
create table public.ticket_types (
  id uuid primary key default gen_random_uuid(), destination_id uuid not null references public.destinations(id) on delete cascade,
  name text not null, price bigint not null check(price >= 0), is_active boolean not null default true,
  unique(destination_id,name)
);
create table public.ticket_availability (
  id uuid primary key default gen_random_uuid(), ticket_type_id uuid not null references public.ticket_types(id) on delete cascade,
  visit_date date not null, capacity int not null check(capacity >= 0), reserved_quantity int not null default 0 check(reserved_quantity >= 0),
  sold_quantity int not null default 0 check(sold_quantity >= 0), unique(ticket_type_id,visit_date),
  check(reserved_quantity + sold_quantity <= capacity)
);
create table public.bookings (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id),
  booking_code text not null unique default ('WG-'||to_char(now(),'YYYY')||'-'||upper(substr(encode(gen_random_bytes(6),'hex'),1,8))),
  idempotency_key uuid not null,
  destination_id uuid not null references public.destinations(id), visit_date date not null,
  contact_email text not null, contact_phone text not null, total_amount bigint not null default 0 check(total_amount >= 0),
  status public.booking_status not null default 'pending_payment', expires_at timestamptz not null default now()+interval '30 minutes',
  created_at timestamptz not null default now(), unique(user_id,idempotency_key)
);
create table public.booking_items (
  id uuid primary key default gen_random_uuid(), booking_id uuid not null references public.bookings(id) on delete cascade,
  ticket_type_id uuid not null references public.ticket_types(id), quantity int not null check(quantity > 0),
  unit_price bigint not null check(unit_price >= 0), subtotal bigint not null check(subtotal >= 0)
);
create table public.booking_visitors (
  id uuid primary key default gen_random_uuid(), booking_item_id uuid not null references public.booking_items(id) on delete cascade,
  visitor_name text not null
);
create table public.payments (
  id uuid primary key default gen_random_uuid(), booking_id uuid not null unique references public.bookings(id),
  provider text not null check(provider in ('demo','midtrans')), provider_order_id text unique,
  amount bigint not null check(amount >= 0), status public.payment_status not null default 'pending', paid_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.tickets (
  id uuid primary key default gen_random_uuid(), booking_id uuid not null references public.bookings(id),
  booking_item_id uuid not null references public.booking_items(id), visitor_id uuid not null unique references public.booking_visitors(id),
  ticket_number text not null unique default ('WG-'||to_char(now(),'YYYY')||'-'||upper(substr(encode(gen_random_bytes(8),'hex'),1,10))),
  verification_token_hash text not null unique, status public.ticket_status not null default 'active', issued_at timestamptz not null default now(), checked_in_at timestamptz
);
create table public.ticket_checkins (
  id uuid primary key default gen_random_uuid(), ticket_id uuid not null references public.tickets(id), admin_id uuid not null references public.profiles(id), checked_in_at timestamptz not null default now()
);
create table public.payment_events (
  id uuid primary key default gen_random_uuid(), payment_id uuid references public.payments(id), event_type text not null,
  payload jsonb not null default '{}', received_at timestamptz not null default now()
);
create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(), admin_id uuid not null references public.profiles(id), action text not null,
  entity text not null, entity_id uuid, details jsonb not null default '{}', created_at timestamptz not null default now()
);
create index destinations_category_idx on public.destinations(category_id,status);
create index ticket_availability_date_idx on public.ticket_availability(visit_date);
create index bookings_user_created_idx on public.bookings(user_id,created_at desc);
create index bookings_code_idx on public.bookings(booking_code);
create index tickets_booking_idx on public.tickets(booking_id);
create index ticket_checkins_ticket_idx on public.ticket_checkins(ticket_id,checked_in_at desc);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role='admin')
$$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
 begin insert into public.profiles(id,full_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name','')); return new; end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.destinations enable row level security;
alter table public.destination_images enable row level security;
alter table public.ticket_types enable row level security;
alter table public.ticket_availability enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_items enable row level security;
alter table public.booking_visitors enable row level security;
alter table public.payments enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_checkins enable row level security;
alter table public.payment_events enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "public can read active destinations" on public.destinations for select using(status='active' or public.is_admin());
create policy "public can read categories" on public.categories for select using(true);
create policy "public can read destination images" on public.destination_images for select using(true);
create policy "public can read active ticket types" on public.ticket_types for select using(is_active or public.is_admin());
create policy "users read own profile" on public.profiles for select using(id=auth.uid() or public.is_admin());
create or replace function public.update_my_profile(p_full_name text,p_phone text)
returns void language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null then raise exception 'Login diperlukan.'; end if;
 update public.profiles set full_name=left(trim(coalesce(p_full_name,'')),120),phone=nullif(left(trim(coalesce(p_phone,'')),24),'') where id=auth.uid();
end $$;
revoke all on function public.update_my_profile(text,text) from public;
grant execute on function public.update_my_profile(text,text) to authenticated;
create policy "users read own bookings" on public.bookings for select using(user_id=auth.uid() or public.is_admin());
create policy "users read own booking items" on public.booking_items for select using(exists(select 1 from public.bookings b where b.id=booking_id and (b.user_id=auth.uid() or public.is_admin())));
create policy "users read own visitors" on public.booking_visitors for select using(exists(select 1 from public.booking_items i join public.bookings b on b.id=i.booking_id where i.id=booking_item_id and (b.user_id=auth.uid() or public.is_admin())));
create policy "users read own payments" on public.payments for select using(exists(select 1 from public.bookings b where b.id=booking_id and (b.user_id=auth.uid() or public.is_admin())));
create policy "users read own tickets" on public.tickets for select using(exists(select 1 from public.bookings b where b.id=booking_id and (b.user_id=auth.uid() or public.is_admin())));
create policy "admins manage catalog" on public.destinations for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage categories" on public.categories for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage images" on public.destination_images for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage ticket types" on public.ticket_types for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage availability" on public.ticket_availability for all using(public.is_admin()) with check(public.is_admin());
create policy "admins read checkins" on public.ticket_checkins for select using(public.is_admin());
create policy "admins read audit" on public.admin_audit_logs for select using(public.is_admin());

-- Booking creation calculates prices in PostgreSQL and locks inventory rows to avoid overselling.
create or replace function public.create_booking(p_destination_slug text,p_visit_date date,p_contact_email text,p_contact_phone text,p_items jsonb,p_request_key uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare uid uuid:=auth.uid(); dest public.destinations%rowtype; req jsonb; tt public.ticket_types%rowtype; inv public.ticket_availability%rowtype; qty int; cost bigint:=0; bid uuid; item_id uuid; visitor text; existing public.bookings%rowtype;
begin
 if uid is null then raise exception 'Login diperlukan.'; end if;
 select * into existing from public.bookings where user_id=uid and idempotency_key=p_request_key;
 if found then return jsonb_build_object('id',existing.id,'total_amount',existing.total_amount); end if;
 if p_visit_date < current_date then raise exception 'Tanggal kunjungan sudah lewat.'; end if;
 select * into dest from public.destinations where slug=p_destination_slug and status='active';
 if not found then raise exception 'Destinasi tidak tersedia.'; end if;
 if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)=0 then raise exception 'Pilih tiket terlebih dahulu.'; end if;
 for req in select * from jsonb_array_elements(p_items) loop
   select * into tt from public.ticket_types where id=(req->>'ticket_type_id')::uuid and destination_id=dest.id and is_active;
   if not found then raise exception 'Jenis tiket tidak tersedia.'; end if;
   qty:=(req->>'quantity')::int; if qty<1 or qty>10 then raise exception 'Jumlah tiket tidak valid.'; end if;
   select * into inv from public.ticket_availability where ticket_type_id=tt.id and visit_date=p_visit_date for update;
   if not found or inv.capacity-inv.reserved_quantity-inv.sold_quantity < qty then raise exception 'Kuota tiket tidak mencukupi.'; end if;
   cost:=cost+(tt.price*qty);
 end loop;
 insert into public.bookings(user_id,idempotency_key,destination_id,visit_date,contact_email,contact_phone,total_amount) values(uid,p_request_key,dest.id,p_visit_date,p_contact_email,p_contact_phone,cost) returning id into bid;
 for req in select * from jsonb_array_elements(p_items) loop
   select * into tt from public.ticket_types where id=(req->>'ticket_type_id')::uuid;
   qty:=(req->>'quantity')::int;
   update public.ticket_availability set reserved_quantity=reserved_quantity+qty where ticket_type_id=tt.id and visit_date=p_visit_date;
   insert into public.booking_items(booking_id,ticket_type_id,quantity,unit_price,subtotal) values(bid,tt.id,qty,tt.price,tt.price*qty) returning id into item_id;
   for visitor in select jsonb_array_elements_text(req->'visitors') loop insert into public.booking_visitors(booking_item_id,visitor_name) values(item_id,visitor); end loop;
 end loop;
 insert into public.payments(booking_id,provider,amount) values(bid,'demo',cost);
 return jsonb_build_object('id',bid,'total_amount',cost);
end $$;

-- The server must keep DEMO_PAYMENT_ENABLED=true and must verify the signed-in owner before invoking this RPC.
create or replace function public.confirm_demo_payment(p_booking_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare b public.bookings%rowtype; it record; v record; tt public.ticket_types%rowtype; tok text; new_ticket public.tickets%rowtype; issued jsonb:='[]'::jsonb;
begin
 select * into b from public.bookings where id=p_booking_id and user_id=auth.uid() for update;
 if not found then raise exception 'Pemesanan tidak ditemukan.'; end if;
 if b.status='paid' then return jsonb_build_object('status','paid','idempotent',true); end if;
 if b.status<>'pending_payment' or b.expires_at<now() then raise exception 'Pemesanan tidak dapat dibayar.'; end if;
 update public.payments set status='paid',paid_at=now() where booking_id=b.id and provider='demo' and status='pending';
 if not found then raise exception 'Pembayaran demonstrasi tidak tersedia.'; end if;
 insert into public.payment_events(payment_id,event_type,payload) select id,'demo.payment_succeeded',jsonb_build_object('booking_id',b.id) from public.payments where booking_id=b.id;
 update public.bookings set status='paid' where id=b.id;
 for it in select i.id,i.ticket_type_id,i.quantity from public.booking_items i where i.booking_id=b.id loop
   update public.ticket_availability set reserved_quantity=reserved_quantity-it.quantity,sold_quantity=sold_quantity+it.quantity where ticket_type_id=it.ticket_type_id and visit_date=b.visit_date;
   select * into tt from public.ticket_types where id=it.ticket_type_id;
   for v in select id,visitor_name from public.booking_visitors where booking_item_id=it.id loop
     tok:=encode(gen_random_bytes(32),'hex');
     insert into public.tickets(booking_id,booking_item_id,visitor_id,verification_token_hash) values(b.id,it.id,v.id,encode(digest(tok,'sha256'),'hex')) returning * into new_ticket;
     issued:=issued||jsonb_build_array(jsonb_build_object('id',new_ticket.id,'number',new_ticket.ticket_number,'token',tok,'visitor',v.visitor_name,'category',tt.name));
   end loop;
 end loop;
 return jsonb_build_object('status','paid','booking_code',b.booking_code,'tickets',issued);
end $$;

create or replace function public.fail_demo_payment(p_booking_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare b public.bookings%rowtype; it record;
begin
 select * into b from public.bookings where id=p_booking_id and user_id=auth.uid() for update;
 if not found then raise exception 'Pemesanan tidak ditemukan.'; end if;
 if b.status='paid' then raise exception 'Pembayaran berhasil tidak dapat diubah.'; end if;
 if b.status<>'pending_payment' then return jsonb_build_object('status',b.status); end if;
 update public.payments set status='failed' where booking_id=b.id and provider='demo' and status='pending';
 if not found then raise exception 'Pembayaran demonstrasi tidak tersedia.'; end if;
 for it in select i.ticket_type_id,i.quantity from public.booking_items i where i.booking_id=b.id loop
   update public.ticket_availability set reserved_quantity=greatest(0,reserved_quantity-it.quantity) where ticket_type_id=it.ticket_type_id and visit_date=b.visit_date;
 end loop;
 update public.bookings set status='failed' where id=b.id;
 insert into public.payment_events(payment_id,event_type,payload) select id,'demo.payment_failed',jsonb_build_object('booking_id',b.id) from public.payments where booking_id=b.id;
 return jsonb_build_object('status','failed');
end $$;

create or replace function public.validate_ticket(p_token_hash text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare t public.tickets%rowtype; b public.bookings%rowtype;
begin
 if not public.is_admin() then raise exception 'Akses admin diperlukan.'; end if;
 select * into t from public.tickets where verification_token_hash=p_token_hash for update;
 if not found then return jsonb_build_object('result','invalid'); end if;
 select * into b from public.bookings where id=t.booking_id;
 if t.status='used' then return jsonb_build_object('result','used','ticket_number',t.ticket_number); end if;
 if t.status='cancelled' or b.status<>'paid' then return jsonb_build_object('result','cancelled'); end if;
 if b.visit_date<>current_date then return jsonb_build_object('result','wrong_date','visit_date',b.visit_date); end if;
 update public.tickets set status='used',checked_in_at=now() where id=t.id and status='active';
 if not found then return jsonb_build_object('result','used'); end if;
 insert into public.ticket_checkins(ticket_id,admin_id) values(t.id,auth.uid());
 insert into public.admin_audit_logs(admin_id,action,entity,entity_id) values(auth.uid(),'ticket.checkin','ticket',t.id);
 return jsonb_build_object('result','valid','ticket_number',t.ticket_number,'booking_code',b.booking_code);
end $$;

revoke all on function public.confirm_demo_payment(uuid) from public;
revoke all on function public.fail_demo_payment(uuid) from public;
revoke all on function public.validate_ticket(text) from public;
revoke all on function public.create_booking(text,date,text,text,jsonb,uuid) from public;
grant execute on function public.create_booking(text,date,text,text,jsonb,uuid) to authenticated;
grant execute on function public.confirm_demo_payment(uuid) to authenticated;
grant execute on function public.fail_demo_payment(uuid) to authenticated;
grant execute on function public.validate_ticket(text) to authenticated;

create or replace function public.release_expired_bookings()
returns int language plpgsql security definer set search_path=public as $$
declare released int;
begin
 with expired as (update public.bookings set status='expired' where status='pending_payment' and expires_at<now() returning id,destination_id,visit_date),
 quantities as (select i.ticket_type_id,e.visit_date,sum(i.quantity)::int quantity from expired e join public.booking_items i on i.booking_id=e.id group by i.ticket_type_id,e.visit_date)
 update public.ticket_availability a set reserved_quantity=greatest(0,a.reserved_quantity-q.quantity) from quantities q where a.ticket_type_id=q.ticket_type_id and a.visit_date=q.visit_date;
 get diagnostics released=row_count;
 update public.payments p set status='expired' from public.bookings b where p.booking_id=b.id and b.status='expired' and p.status='pending';
 return released;
end $$;
revoke all on function public.release_expired_bookings() from public,anon,authenticated;
grant execute on function public.release_expired_bookings() to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('destination-images','destination-images',true,8388608,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy "public read destination image files" on storage.objects for select using(bucket_id='destination-images');
create policy "admin uploads destination image files" on storage.objects for insert with check(bucket_id='destination-images' and public.is_admin());
create policy "admin updates destination image files" on storage.objects for update using(bucket_id='destination-images' and public.is_admin()) with check(bucket_id='destination-images' and public.is_admin());
create policy "admin deletes destination image files" on storage.objects for delete using(bucket_id='destination-images' and public.is_admin());

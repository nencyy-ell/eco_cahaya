alter table public.bank_accounts
  alter column status set default 'active';

update public.bank_accounts
set status = 'active'
where role = 'resident'
  and status = 'pending';

create or replace function public.create_bank_account()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.bank_accounts (user_id, email, full_name, phone, role, status)
  values (
    new.id,
    lower(new.email),
    trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')),
    trim(coalesce(new.raw_user_meta_data ->> 'phone', '')),
    'resident',
    'active'
  );
  return new;
end;
$$;

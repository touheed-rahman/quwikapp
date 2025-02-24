
create or replace function follow_user(following_uid uuid)
returns void
language plpgsql
security definer
as $$
begin
  insert into follows (follower_id, following_id)
  values (auth.uid(), following_uid);
end;
$$;

create or replace function unfollow_user(following_uid uuid)
returns void
language plpgsql
security definer
as $$
begin
  delete from follows
  where follower_id = auth.uid()
  and following_id = following_uid;
end;
$$;

create or replace function check_if_following(follower_uid uuid, following_uid uuid)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1
    from follows
    where follower_id = follower_uid
    and following_id = following_uid
  );
end;
$$;

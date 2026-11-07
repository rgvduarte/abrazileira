-- The waiting list is public sign-up only; signed-in roles do not need it.
revoke execute on function public.join_waitlist(text, text, boolean) from authenticated;

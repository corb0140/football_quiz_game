import { useGetUserDataQuery } from "../lib/state/userApi";

export function UserData() {
  const { data: userData, isLoading, error } = useGetUserDataQuery();
  const user = userData?.user;

  return { user, isLoading, error };
}

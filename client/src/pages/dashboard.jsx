import Lottie from "lottie-react";
import Loading from "@/Loading.json";
import { useLogoutMutation } from "../lib/state/authApi";
import { useGetUserDataQuery } from "../lib/state/userApi";

function Dashboard() {
  const [logout] = useLogoutMutation();
  const { data: userData, isLoading, error } = useGetUserDataQuery();
  const user = userData?.user;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Lottie animationData={Loading} loop={true} className="w-20 h-20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }
  const handleLogout = async () => {
    try {
      await logout();

      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col gap-5 items-center justify-center">
      <h1 className="font-roboto-condensed text-3xl text-white">
        Welcome, {user?.username || "Guest"}
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;

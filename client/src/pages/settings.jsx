import { useLogoutMutation } from "../lib/state/authApi/";

function Settings() {
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout();

      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <div>
      <div className="h-screen flex flex-col gap-5 items-center justify-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Settings;

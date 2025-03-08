import { account } from "./appwrite";
import { useCurrentUserData } from "@/context/userContext";
const LogOutButton = () => {
  const { setSession } = useCurrentUserData();
  const handleGoogleLogin = async () => {
    try {
      await account.deleteSession("current");
      setSession(null);
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <button onClick={handleGoogleLogin} className="p-3 bg-blue-500 text-white">
      LogOut
    </button>
  );
};

export default LogOutButton;

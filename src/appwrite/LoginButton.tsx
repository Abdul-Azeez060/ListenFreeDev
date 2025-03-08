import { account } from "./appwrite";
import { OAuthProvider } from "appwrite";

const LoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      await account.createOAuth2Session(
        OAuthProvider.Google,
        "http://localhost:8080/",
        "http://localhost:8080/fail"
      );
    } catch (error) {
      console.error("Google login failed", error);
    }

  };

  return (
    <button onClick={handleGoogleLogin} className="p-3 bg-blue-500 text-white">
      Login with Google
    </button>
  );
};

export default LoginButton;

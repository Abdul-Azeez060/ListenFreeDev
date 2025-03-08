import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { account } from "@/appwrite/appwrite";

interface User {
  $id: string;
  email: string;
  name: string;
}

interface UserContextProps {
  user: User | null;
  setSession: (session: any) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState();

  useEffect(() => {
    getUser();
  }, [session]);

  const getUser = async () => {
    try {
      console.log("executing the getUser function");
      const session = await account.getSession("current");
      console.log(session, "this is session");

      if (session) {
        const userData = await account.get();
        setUser(userData);
        console.log(userData, "this is user");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setSession }}>
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUserData = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUserData must be used within a UserProvider");
  }
  return context;
};

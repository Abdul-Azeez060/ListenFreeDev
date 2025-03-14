import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { account } from "@/appwrite/appwrite";
import { getUserFavoriteSongs } from "@/appwrite/databaseActions";
import { fetchSongsByIds } from "@/lib/api";
import { toast } from "sonner";
import { Song } from "@/types/music";

interface User {
  $id: string;
  email: string;
  name: string;
}

interface UserContextProps {
  user: User | null;
  setSession: (session: any) => void;
  favoriteSongIds: string[];
  setFavoriteSongIds: (previousSongs: any) => void;
  favoriteSongs: Song[];
  setFavoriteSongs: (songs: Song[]) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState();
  const [favoriteSongIds, setFavoriteSongIds] = useState();
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUser();
  }, [session]);

  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem("favorites"));
    const expiryTime = parseInt(JSON.parse(localStorage.getItem("expiryTime")));

    if (!fav) {
      console.log(fav, "favorites not presnt");
      getUserFavorites();
    } else if (expiryTime < Date.now()) {
      console.log("expirted state refetching the songs");
      getUserFavorites();
    } else {
      console.log("fetching songs from localstorage");
      setFavoriteSongIds(fav);
    }
  }, [user]);

  useEffect(() => {
    loadFavoriteSongs();
  }, [user, favoriteSongIds]);

  async function loadFavoriteSongs() {
    try {
      if (user) {
        setIsLoading(true);
        const result = await fetchSongsByIds(favoriteSongIds);
        console.log(result);
        setFavoriteSongs(result);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast.error("Failed to load favorite songs");
    } finally {
      setIsLoading(false);
    }
  }

  const getUser = async () => {
    try {
      setIsLoading(true);
      console.log("executing the getUser function");
      const session = await account.getSession("current");
      console.log(session, "this is session");

      if (session) {
        const userData = await account.get();
        setUser(userData);
        console.log(userData, "this is user");
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };

  const getUserFavorites = async () => {
    if (user) {
      console.log("fetching songs from db");
      const res = await getUserFavoriteSongs(user.$id);
      localStorage.setItem("favorites", JSON.stringify(res.songs));
      //@ts-ignore
      setFavoriteSongIds(res.songs);
      localStorage.setItem(
        "expiryTime",
        (Date.now() + 3 * 60 * 60 * 1000).toString()
      );
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setSession,
        favoriteSongIds,
        setFavoriteSongIds,
        favoriteSongs,
        setFavoriteSongs,
        isLoading,
      }}>
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

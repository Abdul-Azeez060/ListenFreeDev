import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { account } from "@/appwrite/appwrite";
import {
  fetchUserPlaylstSongs,
  getUserFavoriteSongs,
  getUserPlaylistMetadata,
} from "@/appwrite/databaseActions";
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
  playlists: any[];
  setPlaylists: (playlist: any) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState();
  const [favoriteSongIds, setFavoriteSongIds] = useState();
  const [favoriteSongs, setFavoriteSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getUser();
  }, [session]);

  useEffect(() => {
    if (localStorage.getItem("favoriteSongs")) {
      localStorage.removeItem("favoriteSongs");
    }
    const fav = JSON.parse(localStorage.getItem("favorites") || "[]") || [];
    const expiryTime = parseInt(JSON.parse(localStorage.getItem("expiryTime")));

    if (!fav) {
      console.log(fav, "favorites not presnt");
      getUserFavorites();
      console.log(
        expiryTime,
        "this is expiry time",
        Date.now(),
        "this is current date"
      );
    } else if (expiryTime < Date.now()) {
      console.log("expirted state refetching the songs");
      getUserFavorites();
    } else {
      console.log("fetching songs from localstorage");
      setFavoriteSongIds(fav);
    }
    // getting user playlist metadata
    const playlistMetadata =
      JSON.parse(localStorage.getItem("PlaylistMetadata") || "[]") || [];
    const playlistMetadataExpiryTime = parseInt(
      JSON.parse(localStorage.getItem("PlaylistMetadataExpiryTime") || "0")
    );
    if (!playlistMetadata || playlistMetadata.length < 1) {
      // playlists not present fetch the playlists
      getPlaylistMetadata();
    } else if (playlistMetadataExpiryTime < Date.now()) {
      getPlaylistMetadata();
    } else {
      getPlaylistMetadata();
    }
    console.log(playlistMetadata, "this is going in the state");
    setPlaylists(playlistMetadata);
  }, [user]);

  useEffect(() => {
    const playlistSongs = [];
    const playlistSongsExpiry = 0;
    if (!playlistSongs || playlistSongs.length < 1) {
      getUserPlaylistSongs();
    }
  }, [playlists]);

  useEffect(() => {
    loadFavoriteSongs();
  }, [user, favoriteSongIds]);

  async function loadFavoriteSongs() {
    try {
      if (user) {
        setIsLoading(true);
        if (favoriteSongIds) {
          const result = await fetchSongsByIds(favoriteSongIds);
          // console.log(result);
          setFavoriteSongs(result);
        } else {
          setFavoriteSongs([]);
        }
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
      // console.log(session, "this is session");

      if (session) {
        const userData = await account.get();
        setUser(userData);
        // console.log(userData, "this is user");
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
      if (res.songs.length < 1) {
        return;
      }
      localStorage.setItem("favorites", JSON.stringify(res.songs));
      //@ts-ignore
      setFavoriteSongIds(res.songs);
      localStorage.setItem(
        "expiryTime",
        (Date.now() + 5 * 60 * 60 * 1000).toString()
      );
    }
  };

  const getPlaylistMetadata = async () => {
    if (user) {
      const res: any = await getUserPlaylistMetadata(user.$id);
      if (res.playlists.total < 1) {
        return;
      }

      console.log(res.playlists.documents, "htese are playlists ");
      setPlaylists(res.playlists.documents);
      localStorage.setItem(
        "PlaylistMetadata",
        JSON.stringify(res.playlists.documents)
      );
      localStorage.setItem(
        "PlaylistMetadataExpiryTime",
        (Date.now() + 24 * 60 * 60 * 1000).toString()
      );
    }
  };

  async function getUserPlaylistSongs() {
    const res = await fetchUserPlaylstSongs(playlists);

    if (res.success) {
      // Iterate through res.songs.documents to store songIds for each playlist
      res.songs?.forEach((song) => {
        song.documents.forEach((song) => {
          const { playlistId, songId } = song;

          // Create the key for localStorage (e.g., "playlist:67d7f95f001efb470706")
          const key = `playlist:${playlistId}`;

          // Retrieve the existing songs for this playlist or initialize an empty array
          const existingSongs = JSON.parse(localStorage.getItem(key)) || [];

          // Add the songId to the list (if not already in the list to avoid duplicates)
          if (!existingSongs.includes(songId)) {
            existingSongs.push(songId);
          }

          // Store the updated list of songIds back in localStorage
          localStorage.setItem(key, JSON.stringify(existingSongs));
        });
      });

      console.log("Songs have been stored in localStorage");
    } else {
      console.log(res.error);
    }
  }

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
        playlists,
        setPlaylists,
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

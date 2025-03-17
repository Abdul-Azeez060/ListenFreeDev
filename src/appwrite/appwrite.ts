import { Client, Databases } from "appwrite";

import { Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Your project ID

export const account = new Account(client);
export const database = new Databases(client);
export default client;

export const FAVORITE_COLLECTION = import.meta.env.VITE_FAVORITES_COLLECTION;
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const SONG_COLLECTION = import.meta.env.VITE_SONG_COLLECTION;
export const PLAYLIST_METADATA_COLLECTION = import.meta.env
  .VITE_PLAYLIST_METADATA_COLLECTION;
export const PLAYLIST_SONGS_COLLECTION = import.meta.env
  .VITE_PLAYLIST_SONGS_COLLECTION;

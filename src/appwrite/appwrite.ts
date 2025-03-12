import { Client, Databases } from "appwrite";

import { Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("67ca82ad003dcdb46378"); // Your project ID

export const account = new Account(client);
export const database = new Databases(client);
export default client;

export const FAVORITE_COLLECTION = import.meta.env.VITE_FAVORITES_COLLECTION;
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const SONG_COLLECTION = import.meta.env.VITE_SONG_COLLECTION;

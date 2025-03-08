import { Client } from "appwrite";

import { Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("67ca82ad003dcdb46378"); // Your project ID

export const account = new Account(client);

export default client;

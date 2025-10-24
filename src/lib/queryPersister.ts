import { get, set, del } from "idb-keyval";
import type { PersistedClient, Persister } from "@tanstack/react-query-persist-client";

// Create async persister using idb-keyval
export const queryPersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    await set("keisar-club-cache", client);
  },
  restoreClient: async () => {
    return await get<PersistedClient>("keisar-club-cache");
  },
  removeClient: async () => {
    await del("keisar-club-cache");
  },
};

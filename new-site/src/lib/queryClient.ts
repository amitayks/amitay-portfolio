import { QueryClient } from "@tanstack/react-query";
import { get, set, del } from "idb-keyval";
import type { PersistedClient } from "@tanstack/react-query-persist-client";

const CACHE_KEY = "portfolio-v2-cache";
const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: "always",
      gcTime: THIRTY_DAYS,
    },
  },
});

export const persister = {
  persistClient: async (client: PersistedClient) => {
    await set(CACHE_KEY, client);
  },
  restoreClient: async (): Promise<PersistedClient | undefined> => {
    return await get<PersistedClient>(CACHE_KEY);
  },
  removeClient: async () => {
    await del(CACHE_KEY);
  },
};

export const persistOptions = {
  persister,
  maxAge: THIRTY_DAYS,
};

import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook for managing query cache
 * Provides utilities to refresh or clear cached data
 */
export const useRefreshCache = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidate and refetch all queries
   * Useful for getting fresh data without clearing cache
   */
  const refreshAll = async () => {
    await queryClient.invalidateQueries();
    await queryClient.refetchQueries();
  };

  /**
   * Completely clear the query cache and reload the page
   * Useful for troubleshooting or forcing a fresh start
   */
  const clearCache = async () => {
    await queryClient.clear();
    window.location.reload();
  };

  /**
   * Invalidate specific query keys
   * @param queryKey - The query key to invalidate
   */
  const invalidateQuery = async (queryKey: unknown[]) => {
    await queryClient.invalidateQueries({ queryKey });
  };

  /**
   * Refetch specific query keys
   * @param queryKey - The query key to refetch
   */
  const refetchQuery = async (queryKey: unknown[]) => {
    await queryClient.refetchQueries({ queryKey });
  };

  return {
    refreshAll,
    clearCache,
    invalidateQuery,
    refetchQuery,
  };
};

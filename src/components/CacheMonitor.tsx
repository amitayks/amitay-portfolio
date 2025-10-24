import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Trash2, Database, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRefreshCache } from "../hooks/useRefreshCache";
import { useTheme } from "../hooks/useTheme";
import { Button } from "./ui/button";

/**
 * Cache Monitor Component
 * Displays cache statistics and provides manual cache management
 * Useful for development and troubleshooting
 */
const CacheMonitor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { refreshAll, clearCache } = useRefreshCache();
  const { colors } = useTheme();

  // Get cache statistics
  const queryCache = queryClient.getQueryCache();
  const queries = queryCache.getAll();
  const queriesCount = queries.length;
  const staleQueries = queries.filter((q) => q.isStale()).length;
  const activeQueries = queries.filter((q) => q.isActive()).length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAll();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm("Clear all cached data and reload? This cannot be undone.")) {
      await clearCache();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: colors.primary,
          color: colors.surface,
        }}
        className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-50 hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Cache Monitor"
      >
        <Database className="w-5 h-5" />
      </motion.button>

      {/* Cache Monitor Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
            className="fixed bottom-20 right-4 w-80 rounded-lg shadow-2xl border z-50 overflow-hidden"
          >
            {/* Header */}
            <div
              style={{ backgroundColor: colors.surfaceSecondary }}
              className="px-4 py-3 border-b flex items-center justify-between"
            >
              <h3 style={{ color: colors.text }} className="font-semibold">
                Cache Monitor
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{ color: colors.textSecondary }}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="p-2 rounded"
                >
                  <div style={{ color: colors.textSecondary }} className="text-xs">
                    Total
                  </div>
                  <div style={{ color: colors.text }} className="text-lg font-semibold">
                    {queriesCount}
                  </div>
                </div>
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="p-2 rounded"
                >
                  <div style={{ color: colors.textSecondary }} className="text-xs">
                    Active
                  </div>
                  <div style={{ color: colors.primary }} className="text-lg font-semibold">
                    {activeQueries}
                  </div>
                </div>
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="p-2 rounded"
                >
                  <div style={{ color: colors.textSecondary }} className="text-xs">
                    Stale
                  </div>
                  <div style={{ color: colors.accent }} className="text-lg font-semibold">
                    {staleQueries}
                  </div>
                </div>
              </div>

              {/* Query Breakdown */}
              <div style={{ backgroundColor: colors.surfaceSecondary }} className="p-3 rounded">
                <div style={{ color: colors.textSecondary }} className="text-xs mb-2">
                  Cache Breakdown
                </div>
                <div className="space-y-1 text-sm">
                  {Object.entries(
                    queries.reduce(
                      (acc, q) => {
                        const key = q.queryKey[0] as string;
                        acc[key] = (acc[key] || 0) + 1;
                        return acc;
                      },
                      {} as Record<string, number>
                    )
                  ).map(([key, count]) => (
                    <div
                      key={key}
                      className="flex justify-between"
                      style={{ color: colors.text }}
                    >
                      <span className="truncate">{key}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex-1 flex items-center justify-center gap-2"
                  variant="outline"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button
                  onClick={handleClear}
                  className="flex-1 flex items-center justify-center gap-2"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </Button>
              </div>

              {/* Info */}
              <div
                style={{
                  backgroundColor: colors.surfaceSecondary,
                  color: colors.textSecondary,
                }}
                className="text-xs p-2 rounded"
              >
                💡 Data cached for 7-14 days. Refresh fetches latest data. Clear removes all cache.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CacheMonitor;

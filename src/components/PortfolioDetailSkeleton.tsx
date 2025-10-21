import { useTheme } from "@/hooks/useTheme";

export const PortfolioDetailSkeleton = () => {
  const colors = useTheme();

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      {/* Breadcrumb */}
      <div
        style={{
          backgroundColor: colors.surfaceSecondary,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center justify-between">
            {/* Back to Portfolio link */}
            <div className="flex items-center">
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="w-5 h-5 rounded animate-pulse mr-2"
              />
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="h-5 w-32 rounded animate-pulse"
              />
            </div>
            {/* Project type badge */}
            <div
              style={{ backgroundColor: colors.surfaceSecondary }}
              className="h-8 w-24 rounded-full animate-pulse"
            />
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square w-full relative overflow-hidden rounded-lg">
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="w-full h-full animate-pulse"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="aspect-square rounded-md overflow-hidden">
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="w-full h-full animate-pulse"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Project Info Section */}
          <div className="space-y-8">
            {/* Title */}
            <div>
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="h-12 w-4/5 rounded animate-pulse mb-4"
              />
            </div>

            {/* Technologies */}
            <div className="flex">
              <div className="flex flex-wrap gap-3">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-8 w-20 rounded-lg animate-pulse"
                    />
                  ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="space-y-2">
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="h-6 w-full rounded animate-pulse"
                />
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="h-6 w-5/6 rounded animate-pulse"
                />
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="h-6 w-3/4 rounded animate-pulse"
                />
              </div>
            </div>

            {/* External Links */}
            <div className="flex gap-4">
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="h-12 w-32 rounded-xl animate-pulse"
              />
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="h-12 w-28 rounded-xl animate-pulse"
              />
            </div>

            {/* About The Project Section */}
            <div>
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="h-6 w-40 rounded animate-pulse mb-4"
              />
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div
                  style={{
                    borderColor: colors.border,
                    background: `linear-gradient(to right, ${colors.surface}, ${colors.surfaceSecondary})`,
                  }}
                  className="p-6 rounded-xl border-2"
                >
                  <div className="space-y-3">
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-5 w-full rounded animate-pulse"
                    />
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-5 w-4/5 rounded animate-pulse"
                    />
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-5 w-5/6 rounded animate-pulse"
                    />
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-5 w-3/4 rounded animate-pulse"
                    />
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-5 w-2/3 rounded animate-pulse"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Table */}
            <div>
              <div className="space-y-3">
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      style={{ borderBottom: `1px solid ${colors.border}` }}
                      className="flex justify-between py-2"
                    >
                      <div
                        style={{ backgroundColor: colors.surfaceSecondary }}
                        className="h-5 w-24 rounded animate-pulse"
                      />
                      <div
                        style={{ backgroundColor: colors.surfaceSecondary }}
                        className="h-5 w-32 rounded animate-pulse"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

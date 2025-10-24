import { useTheme } from "@/hooks/useTheme";

export const PortfolioDetailSkeleton = () => {
  const { colors } = useTheme();

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div style={{ backgroundColor: "transparent" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center justify-between">
            {/* Back button skeleton */}
            <div className="inline-flex items-center">
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="w-5 h-5 rounded animate-pulse mr-2"
              />
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="h-5 w-24 rounded animate-pulse"
              />
            </div>
            {/* Project type badge skeleton */}
            <div
              style={{ backgroundColor: colors.surfaceSecondary }}
              className="h-8 w-28 rounded-full animate-pulse"
            />
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section Skeleton */}
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

          {/* Project Info Section Skeleton */}
          <div className="space-y-8">
            {/* Title Skeleton */}
            <div>
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="h-12 w-3/4 rounded animate-pulse mb-4"
              />
            </div>

            {/* Technologies Badges Skeleton */}
            <div className="flex">
              <div className="flex flex-wrap gap-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-10 w-24 rounded-lg animate-pulse"
                    />
                  ))}
              </div>
            </div>

            {/* Description Skeleton */}
            <div>
              <div className="space-y-3">
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="h-7 w-full rounded animate-pulse"
                />
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="h-7 w-5/6 rounded animate-pulse"
                />
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="h-7 w-4/5 rounded animate-pulse"
                />
              </div>
            </div>

            {/* External Links Skeleton */}
            <div className="flex gap-4">
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="h-12 w-36 rounded-xl animate-pulse"
              />
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="h-12 w-32 rounded-xl animate-pulse"
              />
            </div>

            {/* About The Project Section Skeleton */}
            <div>
              {/* Section Title */}
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="h-6 w-48 rounded animate-pulse mb-4"
              />

              {/* ExpandTableText Card Skeleton */}
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div
                  style={{
                    borderColor: colors.border,
                    background: `linear-gradient(to top right, ${colors.surface}, ${colors.surfaceSecondary})`,
                  }}
                  className="p-6 border-2 rounded-lg"
                >
                  <div className="space-y-3">
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-5 w-full rounded animate-pulse"
                    />
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-5 w-11/12 rounded animate-pulse"
                    />
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-5 w-5/6 rounded animate-pulse"
                    />
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-5 w-4/5 rounded animate-pulse"
                    />
                  </div>

                  {/* Read More Button Skeleton */}
                  <div className="mt-4 flex justify-end">
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="h-8 w-28 rounded animate-pulse"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Table Skeleton */}
            <div>
              <div className="space-y-3">
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      style={{ borderBottom: `1px solid ${colors.border}` }}
                      className="flex justify-between py-3"
                    >
                      <div
                        style={{ backgroundColor: colors.surfaceSecondary }}
                        className="h-5 w-32 rounded animate-pulse"
                      />
                      <div
                        style={{ backgroundColor: colors.surfaceSecondary }}
                        className="h-5 w-40 rounded animate-pulse"
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

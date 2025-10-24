import { useTheme } from "@/hooks/useTheme";
import AdditionalInfoTable from "../components/AdditionalInfoTable";
import Breadcrumb from "../components/Breadcrumb";
import ErrorComponent from "../components/ErrorComponent";
import ExpandTableText from "../components/ExpandTableText";
import LinkPreviewCard from "../components/LinkPreviewCard";
import NoItemFound from "../components/NoItemFound";
import { PortfolioDetailSkeleton } from "../components/PortfolioDetailSkeleton";
import PortfolioImage from "../components/PortfolioImage";
import usePortfolioItem from "../hooks/usePortfolioItem";

const PortfolioDetail = () => {
  const {
    portfolioItem,
    image,
    imagePack,
    githubPreviewImages,
    liveSitePreviewImages,
    isLoadingPortfolio,
    isLoadingImage,
    isLoadingImagePack,
    error,
  } = usePortfolioItem();
  const { colors } = useTheme();

  if (isLoadingPortfolio) {
    return <PortfolioDetailSkeleton />;
  }

  if (!portfolioItem) {
    return <NoItemFound />;
  }
  if (error) {
    return (
      <ErrorComponent
        message={`Failed to load portfolio item '${portfolioItem?.SKU}'`}
        details={error?.message || "The portfolio item could not be retrieved. Please try again."}
        showRetry={true}
        onRetry={() => window.location.reload()}
        showNavigation={true}
        fullPage={true}
      />
    );
  }

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Breadcrumb projectType={portfolioItem?.projectType} status={portfolioItem.status} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <PortfolioImage
            imageAspect={portfolioItem.settings?.imageAspect}
            image={image}
            imagePack={imagePack}
            title={portfolioItem.title}
            isLoadingImage={isLoadingImage}
            isLoadingImagePack={isLoadingImagePack}
          />

          <div className="space-y-8" dir={portfolioItem.settings.dir}>
            <div>
              <h1 style={{ color: colors.primary }} className="text-4xl font-bold mb-4">
                {portfolioItem.title}
              </h1>
            </div>

            <div className="flex ">
              <div className="flex flex-wrap gap-3 ">
                {portfolioItem?.technologies?.map((tech) => (
                  <span
                    key={portfolioItem.SKU}
                    style={{
                      backgroundColor: colors.surfaceSecondary,
                      color: colors.textSecondary,
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium "
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p style={{ color: colors.textSecondary }} className="text-xl leading-relaxed">
                {portfolioItem.description}
              </p>
            </div>

            {(portfolioItem?.github || portfolioItem?.liveSite) && (
              <div className="grid grid-cols-2 gap-4">
                {portfolioItem.github && (
                  <LinkPreviewCard
                    title="GitHub"
                    subtitle={portfolioItem.github.subHeader}
                    previewImage={githubPreviewImages}
                    link={portfolioItem.github.link}
                    type="github"
                    index={0}
                  />
                )}
                {portfolioItem.liveSite && (
                  <LinkPreviewCard
                    title="Live Site"
                    subtitle={portfolioItem.liveSite.subHeader}
                    previewImage={liveSitePreviewImages}
                    link={portfolioItem.liveSite.link}
                    type="live"
                    index={1}
                  />
                )}
              </div>
            )}

            <div>
              <h3 style={{ color: colors.primary }} className="text-lg font-semibold mb-4">
                {portfolioItem.settings.dir === "rtl" ? "על הפרוייקט" : "About The Project"}
              </h3>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p style={{ color: colors.textSecondary }} className="leading-relaxed">
                  <ExpandTableText
                    readMoreText={portfolioItem.settings.dir === "rtl" ? "קרא עוד" : "Read More"}
                    maxLength={100}
                  >
                    {portfolioItem?.longDescription}
                  </ExpandTableText>
                </p>
              </div>
            </div>

            {portfolioItem?.additionalInfo?.length > 0 && (
              <AdditionalInfoTable additionalInfo={portfolioItem.additionalInfo} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;

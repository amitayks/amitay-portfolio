import { AnimatedText } from "@/components/AnimatedText";
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
import { usePortfolioTranslation } from "../hooks/usePortfolioTranslation";

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

  // Get translated content with fallback to server data
  const translated = portfolioItem ? usePortfolioTranslation(portfolioItem) : null;

  if (isLoadingPortfolio) {
    return <PortfolioDetailSkeleton />;
  }

  if (!portfolioItem || !translated) {
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
              <AnimatedText
                as="h1"
                style={{ color: colors.primary }}
                className="text-4xl font-bold mb-4"
                variant="slide"
              >
                {translated.title}
              </AnimatedText>
            </div>

            <AnimatedText as="div" variant="fade" className="flex">
              <div className="flex flex-wrap gap-3">
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
            </AnimatedText>

            <div>
              <AnimatedText
                as="p"
                style={{ color: colors.textSecondary }}
                className="text-xl leading-relaxed"
                variant="fade"
              >
                {translated.description}
              </AnimatedText>
            </div>

            {(portfolioItem?.github || portfolioItem?.liveSite) && (
              <div className="grid grid-cols-2 gap-4">
                {portfolioItem.github && translated.github && (
                  <LinkPreviewCard
                    title={translated.github.label}
                    subtitle={translated.github.subHeader}
                    previewImage={githubPreviewImages}
                    link={portfolioItem.github.link}
                    type="github"
                    index={0}
                  />
                )}
                {portfolioItem.liveSite && translated.liveSite && (
                  <LinkPreviewCard
                    title={translated.liveSite.label}
                    subtitle={translated.liveSite.subHeader}
                    previewImage={liveSitePreviewImages}
                    link={portfolioItem.liveSite.link}
                    type="live"
                    index={1}
                  />
                )}
              </div>
            )}

            <div>
              <AnimatedText
                as="h3"
                style={{ color: colors.primary }}
                className="text-lg font-semibold mb-4"
                variant="slide"
              >
                {translated.aboutProject}
              </AnimatedText>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <AnimatedText
                  as="p"
                  style={{ color: colors.textSecondary }}
                  className="leading-relaxed"
                  variant="fade"
                >
                  <ExpandTableText readMoreText={translated.readMore} maxLength={100}>
                    {translated.longDescription}
                  </ExpandTableText>
                </AnimatedText>
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

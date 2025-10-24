import { useQueries, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPortfolioImage } from "../services/apiImages";
import { getPortfolioById } from "../services/apiPortfolio";
import { PortfolioItem } from "../types/portfolio";

const usePortfolioItem = () => {
  const { SKU } = useParams<{ SKU: string }>();

  const {
    data: portfolioItem,
    error: portfolioError,
    isLoading: isLoadingPortfolio,
  } = useQuery<PortfolioItem, Error>({
    queryKey: ["portfolioItem", SKU],
    queryFn: () => getPortfolioById(SKU || ""),
    enabled: !!SKU,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: image, isLoading: isLoadingImage } = useQuery<string | null, Error>({
    queryKey: ["portfolioImage", portfolioItem?.image],
    queryFn: () =>
      portfolioItem?.image ? getPortfolioImage(portfolioItem.image) : Promise.resolve(null),
    enabled: !!portfolioItem?.image,
  });

  const imagePackQueries = useQueries({
    queries: (portfolioItem?.imagePack?.slice(0, 4) || []).map((image: string) => ({
      queryKey: ["portfolioImage", image],
      queryFn: () => getPortfolioImage(image),
    })),
  });

  const imagePack = imagePackQueries.map((query) => ({
    url: query.data || null,
    error: query.error || null,
    isLoading: query.isLoading,
  }));

  const isLoadingImagePack = imagePackQueries.some((query) => query.isLoading);

  // Check if GitHub dark and light images are different
  const githubHasDifferentImages =
    portfolioItem?.github?.previewImage?.dark &&
    portfolioItem?.github?.previewImage?.light &&
    portfolioItem.github.previewImage.dark !== portfolioItem.github.previewImage.light;

  // Check if LiveSite dark and light images are different
  const liveSiteHasDifferentImages =
    portfolioItem?.liveSite?.previewImage?.dark &&
    portfolioItem?.liveSite?.previewImage?.light &&
    portfolioItem.liveSite.previewImage.dark !== portfolioItem.liveSite.previewImage.light;

  // Fetch GitHub preview images (always fetch both for smooth theme transitions)
  const { data: githubPreviewDark, isLoading: isLoadingGithubDark } = useQuery<
    string | null,
    Error
  >({
    queryKey: ["portfolioImage", portfolioItem?.github?.previewImage?.dark],
    queryFn: () =>
      portfolioItem?.github?.previewImage?.dark
        ? getPortfolioImage(portfolioItem.github.previewImage.dark)
        : Promise.resolve(null),
    enabled:
      !!portfolioItem?.github?.previewImage?.dark &&
      portfolioItem.github.previewImage.dark.trim() !== "",
    retry: false,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  const { data: githubPreviewLight, isLoading: isLoadingGithubLight } = useQuery<
    string | null,
    Error
  >({
    queryKey: ["portfolioImage", portfolioItem?.github?.previewImage?.light],
    queryFn: () =>
      portfolioItem?.github?.previewImage?.light
        ? getPortfolioImage(portfolioItem.github.previewImage.light)
        : Promise.resolve(null),
    // Only fetch if different from dark, otherwise use dark image
    enabled: Boolean(
      portfolioItem?.github?.previewImage?.light &&
        portfolioItem.github.previewImage.light.trim() &&
        githubHasDifferentImages
    ),
    retry: false,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  // Fetch Live Site preview images (always fetch both for smooth theme transitions)
  const { data: liveSitePreviewDark, isLoading: isLoadingLiveDark } = useQuery<
    string | null,
    Error
  >({
    queryKey: ["portfolioImage", portfolioItem?.liveSite?.previewImage?.dark],
    queryFn: () =>
      portfolioItem?.liveSite?.previewImage?.dark
        ? getPortfolioImage(portfolioItem.liveSite.previewImage.dark)
        : Promise.resolve(null),
    enabled:
      !!portfolioItem?.liveSite?.previewImage?.dark &&
      portfolioItem.liveSite.previewImage.dark.trim() !== "",
    retry: false,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  const { data: liveSitePreviewLight, isLoading: isLoadingLiveLight } = useQuery<
    string | null,
    Error
  >({
    queryKey: ["portfolioImage", portfolioItem?.liveSite?.previewImage?.light],
    queryFn: () =>
      portfolioItem?.liveSite?.previewImage?.light
        ? getPortfolioImage(portfolioItem.liveSite.previewImage.light)
        : Promise.resolve(null),
    // Only fetch if different from dark, otherwise use dark image
    enabled: Boolean(
      portfolioItem?.liveSite?.previewImage?.light &&
        portfolioItem.liveSite.previewImage.light.trim() &&
        liveSiteHasDifferentImages
    ),
    retry: false,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  // Use same image for both if they're identical
  const githubPreviewImages:
    | {
        dark: string;
        light: string;
      }
    | undefined =
    githubPreviewDark || githubPreviewLight
      ? {
          dark: (githubPreviewDark || githubPreviewLight)!,
          light: (githubPreviewLight || githubPreviewDark)!,
        }
      : undefined;

  const liveSitePreviewImages:
    | {
        dark: string;
        light: string;
      }
    | undefined =
    liveSitePreviewDark || liveSitePreviewLight
      ? {
          dark: (liveSitePreviewDark || liveSitePreviewLight)!,
          light: (liveSitePreviewLight || liveSitePreviewDark)!,
        }
      : undefined;

  return {
    error: portfolioError,
    portfolioItem: portfolioItem || null,
    image: image || null,
    imagePack,
    githubPreviewImages,
    liveSitePreviewImages,
    isLoadingPortfolio,
    isLoadingImage,
    isLoadingImagePack,
    isLoadingGithubPreview: isLoadingGithubDark || isLoadingGithubLight,
    isLoadingLivePreview: isLoadingLiveDark || isLoadingLiveLight,
  };
};

export default usePortfolioItem;

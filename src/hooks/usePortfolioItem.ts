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

  // Fetch GitHub preview images (dark and light)
  const { data: githubPreviewDark, isLoading: isLoadingGithubDark } = useQuery<
    string | null,
    Error
  >({
    queryKey: ["portfolioImage", portfolioItem?.github?.previewImage?.dark],
    queryFn: () =>
      portfolioItem?.github?.previewImage?.dark
        ? getPortfolioImage(portfolioItem.github.previewImage.dark)
        : Promise.resolve(null),
    enabled: !!portfolioItem?.github?.previewImage?.dark && portfolioItem.github.previewImage.dark.trim() !== '',
    retry: false,
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
    enabled: !!portfolioItem?.github?.previewImage?.light && portfolioItem.github.previewImage.light.trim() !== '',
    retry: false,
  });

  // Fetch Live Site preview images (dark and light)
  const { data: liveSitePreviewDark, isLoading: isLoadingLiveDark } = useQuery<
    string | null,
    Error
  >({
    queryKey: ["portfolioImage", portfolioItem?.liveSite?.previewImage?.dark],
    queryFn: () =>
      portfolioItem?.liveSite?.previewImage?.dark
        ? getPortfolioImage(portfolioItem.liveSite.previewImage.dark)
        : Promise.resolve(null),
    enabled: !!portfolioItem?.liveSite?.previewImage?.dark && portfolioItem.liveSite.previewImage.dark.trim() !== '',
    retry: false,
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
    enabled: !!portfolioItem?.liveSite?.previewImage?.light && portfolioItem.liveSite.previewImage.light.trim() !== '',
    retry: false,
  });

  const githubPreviewImages =
    githubPreviewDark && githubPreviewLight
      ? { dark: githubPreviewDark, light: githubPreviewLight }
      : undefined;

  const liveSitePreviewImages =
    liveSitePreviewDark && liveSitePreviewLight
      ? { dark: liveSitePreviewDark, light: liveSitePreviewLight }
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

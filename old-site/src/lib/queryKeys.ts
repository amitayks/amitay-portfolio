/**
 * Query Key Factory
 * Centralized definition of all TanStack Query keys
 * Ensures type safety and consistency across the application
 */

export const queryKeys = {
  /**
   * Portfolio items query key
   * @param filter - Optional filter value (project type or null for all)
   * @returns Query key array for portfolio items
   */
  portfolioItems: (filter?: string | null) =>
    filter ? (["portfolioItems", filter] as const) : (["portfolioItems", null] as const),

  /**
   * Single portfolio item query key
   * @param sku - Portfolio item SKU
   * @returns Query key array for a specific portfolio item
   */
  portfolioItem: (sku: string) => ["portfolioItem", sku] as const,

  /**
   * Portfolio image query key
   * @param imageName - Image file name
   * @returns Query key array for portfolio image URL
   */
  portfolioImage: (imageName: string) => ["portfolioImage", imageName] as const,

  /**
   * Site image query key (for site-wide images like logos, icons, etc.)
   * @param imageName - Image file name
   * @returns Query key array for site image URL
   */
  siteImage: (imageName: string) => ["image", imageName] as const,
};

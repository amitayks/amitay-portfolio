import { useCallback } from "react";

/**
 * Custom hook for Umami Analytics tracking
 * Provides type-safe methods for tracking custom events
 */

// Extend the Window interface to include umami
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

export type AnalyticsEvent =
  | "form_submit"
  | "form_error"
  | "form_field_focus"
  | "portfolio_view"
  | "external_link_click"
  | "apply_page_visit"
  | "contact_page_visit";

export interface EventData {
  formType?: "contact" | "apply";
  formField?: string;
  portfolioSku?: string;
  portfolioTitle?: string;
  errorType?: string;
  linkUrl?: string;
  linkLabel?: string;
  [key: string]: unknown;
}

export const useAnalytics = () => {
  /**
   * Track a custom event with optional data
   */
  const trackEvent = useCallback((eventName: AnalyticsEvent, eventData?: EventData) => {
    // Check if umami is loaded
    if (typeof window !== "undefined" && window.umami) {
      try {
        window.umami.track(eventName, eventData);
      } catch (error) {
        console.warn("Analytics tracking failed:", error);
      }
    }
  }, []);

  /**
   * Track form submission
   */
  const trackFormSubmit = useCallback(
    (formType: "contact" | "apply", success: boolean) => {
      trackEvent("form_submit", {
        formType,
        success,
        timestamp: new Date().toISOString(),
      });
    },
    [trackEvent]
  );

  /**
   * Track form errors
   */
  const trackFormError = useCallback(
    (formType: "contact" | "apply", errorType: string) => {
      trackEvent("form_error", {
        formType,
        errorType,
      });
    },
    [trackEvent]
  );

  /**
   * Track portfolio item views
   */
  const trackPortfolioView = useCallback(
    (sku: string, title: string) => {
      trackEvent("portfolio_view", {
        portfolioSku: sku,
        portfolioTitle: title,
      });
    },
    [trackEvent]
  );

  /**
   * Track external link clicks
   */
  const trackExternalLink = useCallback(
    (url: string, label?: string) => {
      trackEvent("external_link_click", {
        linkUrl: url,
        linkLabel: label,
      });
    },
    [trackEvent]
  );

  /**
   * Track page-specific visits (for special pages like Apply)
   */
  const trackPageVisit = useCallback(
    (pageName: string) => {
      // This is automatically tracked by Umami, but we can add custom event for specific tracking
      trackEvent(
        pageName === "apply" ? "apply_page_visit" : "contact_page_visit",
        {
          timestamp: new Date().toISOString(),
        }
      );
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackFormSubmit,
    trackFormError,
    trackPortfolioView,
    trackExternalLink,
    trackPageVisit,
  };
};

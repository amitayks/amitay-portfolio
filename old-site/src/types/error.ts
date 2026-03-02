export interface ErrorComponentProps {
  message?: string;
  details?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  showNavigation?: boolean;
  actionText?: string;
  onAction?: () => void;
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

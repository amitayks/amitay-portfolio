import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, state } = useLocation();
  // NavigationType can be "POP" (back/forward), "PUSH" (new navigation), or "REPLACE"
  const navigationType = useNavigationType();
  const prevPathname = useRef<string>();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // Save scroll position before navigating away
    const saveScrollPosition = () => {
      if (prevPathname.current) {
        sessionStorage.setItem(`scrollPos-${prevPathname.current}`, window.scrollY.toString());
      }
    };

    // Save scroll position whenever pathname is about to change
    if (prevPathname.current && prevPathname.current !== pathname) {
      saveScrollPosition();
    }

    // Check if we should preserve scroll (from React Router state)
    const shouldPreserveScroll = state?.preserveScroll;

    // Try to restore scroll position for this path
    const savedScrollY = sessionStorage.getItem(`scrollPos-${pathname}`);

    if (shouldPreserveScroll && savedScrollY) {
      // Restore saved position
      window.scrollTo(0, parseInt(savedScrollY, 10));
    } else if (savedScrollY && navigationType === "POP") {
      // User pressed back/forward button - restore position
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollY, 10));
      }, 0);
    } else {
      // New navigation - scroll to top
      window.scrollTo(0, 0);
    }

    // Update previous pathname
    prevPathname.current = pathname;
  }, [pathname, state, navigationType]);

  // Save scroll position before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (prevPathname.current) {
        sessionStorage.setItem(`scrollPos-${prevPathname.current}`, window.scrollY.toString());
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
};

export default ScrollToTop;

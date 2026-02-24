import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import Favicon from "./components/Favicon";
import ScrollToTop from "./components/ScrollToTop";
import { queryPersister } from "./lib/queryPersister";
import About from "./pages/About";
import Apply from "./pages/Apply";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// import VisaraPage from "./pages/Visara";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // Always refetch in background (stale-while-revalidate)
      gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days garbage collection
      retry: 2,
      refetchOnWindowFocus: false, // Refresh when switching back to tab
      refetchOnReconnect: "always", // DO refetch when internet reconnects
    },
  },
});

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      }}
    >
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <ScrollToTop />
        <Favicon />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:SKU" element={<PortfolioDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/visara" element={<VisaraPage />} /> */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/apply" element={<Apply />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </PersistQueryClientProvider>
  );
}

export default App;

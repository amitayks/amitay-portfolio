import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, persistOptions } from "@/lib/queryClient";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { IntroProvider } from "@/contexts/IntroContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireRole } from "@/components/RequireRole";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { OnboardPage } from "@/pages/OnboardPage";
import { MePage } from "@/pages/MePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { TermsPage } from "@/pages/Legal/TermsPage";
import { PrivacyPage } from "@/pages/Legal/PrivacyPage";
import { AdminLayout } from "@/pages/Admin/AdminLayout";
import { AdminProfilesPage } from "@/pages/Admin/AdminProfilesPage";
import { AdminInvitesPage } from "@/pages/Admin/AdminInvitesPage";
import { AdminProjectsPage } from "@/pages/Admin/AdminProjectsPage";
import { AdminProjectEditorPage } from "@/pages/Admin/AdminProjectEditorPage";

export default function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <BrowserRouter>
        <LanguageProvider>
          <IntroProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/onboard" element={<OnboardPage />} />
                <Route
                  path="/me"
                  element={
                    <RequireAuth>
                      <MePage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RequireRole role="admin">
                      <AdminLayout />
                    </RequireRole>
                  }
                >
                  <Route index element={<AdminProfilesPage />} />
                  <Route path="invites" element={<AdminInvitesPage />} />
                  <Route path="projects" element={<AdminProjectsPage />} />
                  <Route path="projects/:id" element={<AdminProjectEditorPage />} />
                </Route>
                <Route path="/legal/terms" element={<TermsPage />} />
                <Route path="/legal/privacy" element={<PrivacyPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AuthProvider>
          </IntroProvider>
        </LanguageProvider>
      </BrowserRouter>
    </PersistQueryClientProvider>
  );
}

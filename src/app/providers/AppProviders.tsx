import { type ReactNode } from "react";

import { ThemeProvider } from "./ThemeContext";
import { DirectionProvider } from "./DirectionProvider";
import { SettingsProvider } from "./SettingsProvider";
import QueryProvider from "./QueryProvider";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/shared/context/LanguageContext";
import { AuthProvider } from "@/app/providers/AuthProvider";
import ConfirmProvider from "@/shared/components/confirmModal/ConfirmModal";
import { NotificationProvider } from "@/app/providers/NotificationProvider";
import { AuthBootstrap } from "@/app/bootstrap/AuthBootstrap";

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <DirectionProvider>
        <LanguageProvider>
          <SettingsProvider>
            <QueryProvider>
              <HelmetProvider>
                <AuthProvider>
                  <AuthBootstrap>
                    <NotificationProvider>
                      <ConfirmProvider>
                        {children}
                      </ConfirmProvider>
                    </NotificationProvider>
                  </AuthBootstrap>
                </AuthProvider>
              </HelmetProvider>
            </QueryProvider>
          </SettingsProvider>
        </LanguageProvider>
      </DirectionProvider>
    </ThemeProvider>
  );
}
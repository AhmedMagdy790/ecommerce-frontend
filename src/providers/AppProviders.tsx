import { ReactNode } from "react";

import { ThemeProvider } from "../context/ThemeContext";
import { DirectionProvider } from "../context/DirectionProvider";
import { AuthProvider } from "../context/AuthProvider";
import { SettingsProvider } from "../context/SettingsProvider";
import QueryProvider from "./QueryProvider";
// import { CartProvider } from "../context/CartProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
        <DirectionProvider>
          <AuthProvider>
            <SettingsProvider>
              <QueryProvider>
                {children}

              </QueryProvider>
              {/* <CartProvider> */}
              {/* </CartProvider> */}

            </SettingsProvider>
          </AuthProvider>
        </DirectionProvider>
    </ThemeProvider>
  );
}
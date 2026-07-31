import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "@/app/shell/Navbar/LanguageSwitcher";

export default function AuthLayout() {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    return (
        <div 
            className="relative min-h-screen bg-[var(--color-background)] font-[var(--font-sans)] text-[var(--color-text-primary)] antialiased overflow-x-hidden"
            dir={isArabic ? "rtl" : "ltr"}
        >
            <div className="flex min-h-screen flex-col lg:flex-row">
                
                {/* Mobile Header Logo */}
                <header className="lg:hidden flex items-center justify-between p-[var(--spacing-6)] border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                    <Link to="/" className="inline-block">
                        <img src="/assets/logo.svg" alt="Logo" className="h-8 w-auto" />
                    </Link>
                </header>

                {/* Auth Form Area */}
                <main className="flex-1 flex items-center justify-center p-[var(--spacing-6)] sm:p-[var(--spacing-10)] lg:w-1/2 bg-[var(--color-background)]">
                    <div className="w-full max-w-[var(--container-sm)] mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Brand / Hero Area */}
                <section className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[var(--color-primary)] text-[var(--color-text-inverse)] relative overflow-hidden p-[var(--spacing-12)]">
                    {/* Decorative Blur Background Elements */}
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-[var(--z-normal)] flex flex-col items-center max-w-[var(--container-sm)] text-center">
                        <Link to="/" className="transition-transform duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:scale-105">
                            <img
                                src="/assets/logo.svg"
                                alt="Store Logo"
                                className="w-[220px] h-auto drop-br-md filter brightness-0 invert"
                            />
                        </Link>
                        <p className="mt-[var(--spacing-6)] text-[var(--text-lg)] font-[var(--font-medium)] opacity-90 leading-relaxed">
                            {isArabic
                                ? "تسوق أفضل المنتجات بسهولة وثقة معنا"
                                : "Shop the best products easily and securely with us"
                            }
                        </p>
                    </div>
                </section>
            </div>

            {/* Floating Actions */}
            <div className="fixed bottom-[var(--spacing-6)] end-[var(--spacing-6)] z-[var(--z-fixed)] shadow-[var(--shadow-lg)] rounded-[var(--radius-full)] bg-[var(--color-surface)] border border-[var(--color-border)] backdrop-blur-md">
                <LanguageSwitcher />
            </div>
        </div>
    );
}
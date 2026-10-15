// src/shared/components/PageHeader.tsx
import React from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    );
}
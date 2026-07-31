import React, { useEffect, useRef, useCallback } from "react";
import {
    PlusIcon,
    CreditCardIcon,
    ShieldCheckIcon,
    Settings2Icon,
    ActivityIcon,
    FlaskConicalIcon,
} from "lucide-react";

import DataTable from "@/shared/components/DataTable/DataTable";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { Button } from "@/shared/components/Button";

import { usePaymentGatewayStore } from "../store/usePaymentGatewayStore";

import { useNavigate } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";
import type { IPaymentGateway } from "../types/types";

export default function PaymentPage() {
    const { lang } = useLang();
    const navigate = useNavigate();
    const isFetching = useRef(false);

    const {
        gateways,
        isLoading,
        pagination,
        fetchAdminGateways,
        toggleGatewayStatus,
        toggleGatewayTestMode,
        deleteGateway,
    } = usePaymentGatewayStore();

    const loadData = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        try {
            await fetchAdminGateways();
        } finally {
            isFetching.current = false;
        }
    }, [fetchAdminGateways]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Actions
    const handleToggleStatus = async (id: number) => {
        await toggleGatewayStatus(id);
        loadData();
    };

    const handleToggleTestMode = async (id: number) => {
        const result = await confirm({
            title: lang === "ar" ? "تغيير وضع التشغيل" : "Change Operation Mode",
            description: lang === "ar" 
                ? "هل أنت متأكد من تبديل وضع البوابة؟ هذا قد يؤثر على عمليات الدفع الحالية." 
                : "Are you sure? This might affect ongoing transactions.",
            confirmText: lang === "ar" ? "نعم" : "Yes",
            cancelText: lang === "ar" ? "لا" : "No",
        });
        if (result) {
            await toggleGatewayTestMode(id);
            loadData();
        }
    };

    const handleDelete = async (id: number) => {
        const result = await confirm({
            title: lang === "ar" ? "حذف البوابة" : "Delete Gateway",
            description: lang === "ar" ? "سيتم حذف إعدادات الربط نهائياً، هل أنت متأكد؟" : "API settings will be permanently deleted, are you sure?",
            confirmText: lang === "ar" ? "نعم" : "Yes",
            cancelText: lang === "ar" ? "لا" : "No",
        });
        if (result) {
            await deleteGateway(id);
            loadData();
        }
    };

    // Columns
    const gatewayColumns = [
        {
            header: lang === "ar" ? "البوابة" : "Gateway",
            accessor: (item: IPaymentGateway) => (
                <div className="flex items-center gap-3">
                    {item.logo ? (
                        <img src={item.logo} alt={item.name} className="size-8 object-contain rounded bg-[var(--color-surface-secondary)] p-1 border border-[var(--color-border)]" />
                    ) : (
                        <CreditCardIcon className="size-8 text-[var(--color-text-muted)]" />
                    )}
                    <div>
                        <p className="font-bold text-sm text-[var(--color-text-primary)]">{item.name}</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">{item.slug}</p>
                    </div>
                </div>
            ),
        },
        {
            header: lang === "ar" ? "الوضع" : "Mode",
            accessor: (item: IPaymentGateway) => (
                <button
                    type="button"
                    onClick={() => handleToggleTestMode(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition cursor-pointer border ${
                        item.is_test_mode
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                    }`}
                >
                    {item.is_test_mode ? (
                        <><FlaskConicalIcon className="size-3" /> {lang === "ar" ? "وضع الاختبار" : "Test Mode"}</>
                    ) : (
                        <><ShieldCheckIcon className="size-3" /> {lang === "ar" ? "وضع التشغيل" : "Live"}</>
                    )}
                </button>
            ),
        },
        {
            header: lang === "ar" ? "الحالة" : "Status",
            accessor: (item: IPaymentGateway) => (
                <button
                    type="button"
                    onClick={() => handleToggleStatus(item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                        item.is_active
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-[var(--red-500)]/10 text-[var(--red-500)] border-[var(--red-500)]/20"
                    }`}
                >
                    {item.is_active ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "معطل" : "Disabled")}
                </button>
            ),
        },
        {
            header: lang === "ar" ? "الرسوم الإضافية" : "Fees",
            accessor: (item: IPaymentGateway) => (
                <span className="text-sm font-mono text-[var(--color-text-primary)]">{item.extra_fees} EGP</span>
            ),
        },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8" style={{ fontFamily: "var(--font-outfit)" }}>
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                    <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20">
                        <Settings2Icon className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    {lang === "ar" ? "إعدادات الدفع" : "Payment Settings"}
                </h1>

                <Button
                    variant="primary"
                    onClick={() => navigate('/admin/payment-gateways/create')}
                    leftIcon={<PlusIcon className="w-4 h-4" />}
                >
                    {lang === "ar" ? "إضافة بوابة" : "Add Gateway"}
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 rounded-[var(--radius-2xl)] bg-[var(--card-bg)] shadow-sm border border-[var(--color-border)]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[var(--color-primary)]/10 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20">
                            <ActivityIcon className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                        <div>
                            {/* البوابات النشطة */}
                            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                                {gateways.filter(g => g.is_active).length}
                            </p>

                            {/* تحت الاختبار */}
                            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                                {gateways.filter(g => g.is_test_mode).length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="p-5 rounded-[var(--radius-2xl)] bg-[var(--card-bg)] shadow-sm border border-[var(--color-border)]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-[var(--radius-xl)] border border-amber-500/20">
                            <FlaskConicalIcon className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--color-text-secondary)]">{lang === "ar" ? "تحت الاختبار" : "In Test Mode"}</p>
                            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{((gateways as IPaymentGateway[]) || []).filter(g => g.is_test_mode).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={gateways || []}
                meta={pagination}
                isLoading={isLoading}
                columns={gatewayColumns}
                lang={lang}
                onDelete={(item) => handleDelete(item.id)}
                onEdit={(item) => navigate(`/admin/payment-gateways/edit/${item.id}`)}
                renderMobileCard={(item) => (
                    <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border)] w-full">
                        <div>
                            <p className="font-bold text-sm text-[var(--color-text-primary)]">{item.name}</p>
                            <p className="text-xs text-[var(--color-text-secondary)]">{item.slug}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            item.is_active
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-[var(--red-500)]/10 text-[var(--red-500)] border-[var(--red-500)]/20"
                        }`}>
                            {item.is_active ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "معطل" : "Disabled")}
                        </span>
                    </div>
                )}
            />
        </div>
    );
}
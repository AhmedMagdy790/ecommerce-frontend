import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    PlusIcon,
    UsersIcon,
    PhoneIcon,
    MapPinIcon,
    UserCheckIcon,
} from "lucide-react";

import { useLang } from "@/shared/context/LanguageContext";
import DataTable from "@/shared/components/DataTable/DataTable";
import { type FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { Button } from "@/shared/components/Button";

import { useCustomerStore } from "../store/useCustomerStore";
import CustomerModal from "../modal/CustomerModal";
import { useCityStore } from "@/features/dashboard/city/store/useCityStore";
import type { IUser } from "@/shared/types/userType";

export default function CustomerPage() {
    const { lang } = useLang();

    const [selectedCustomer, setSelectedCustomer] = useState<IUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isFetching = useRef(false);

    const {
        paginationType,
        meta,
        fetchCustomers,
        customers,
        isLoading,
        deleteCustomer,
    } = useCustomerStore();

    const { cities, fetchCities } = useCityStore();

    const loadData = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        try {
            await fetchCustomers();
            if (fetchCities) await fetchCities();
        } finally {
            isFetching.current = false;
        }
    }, [fetchCustomers, fetchCities]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleFilterServer = useCallback((filters: any) => {
        fetchCustomers(filters);
    }, [fetchCustomers]);

    // Filters
    const customerFilters: FilterField[] = [
        {
            key: "search",
            label: lang === "ar" ? "بحث (اسم أو هاتف)" : "Search (Name or Phone)",
            type: "text",
            placeholder: "010...",
        },
        {
            key: "city_id",
            label: lang === "ar" ? "المحافظة" : "City",
            type: "select",
            options: [
                { label: lang === "ar" ? "الكل" : "All", value: "" },
                ...(cities || []).map(city => ({ label: typeof city.name === 'string' ? city.name : city.name?.[lang] || city.name?.en || "", value: city.id.toString() }))
            ],
        },
    ];

    // Actions
    const handleEdit = (customer: IUser) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number | string) => {
        const result = await confirm({
            title: lang === "ar" ? "حذف عميل" : "Delete Customer",
            description: lang === "ar" ? "هل أنت متأكد من حذف هذا العميل؟" : "Are you sure?",
            confirmText: lang === "ar" ? "نعم" : "Yes",
            cancelText: lang === "ar" ? "لا" : "No",
        });

        if (!result) return;
        const success = await deleteCustomer(id);
        if (success) {
            loadData();
        }
    };

    // Columns
    const customerColumns = [
        {
            header: lang === "ar" ? "الاسم" : "Name",
            accessor: (item: IUser) => (
                <div className="flex flex-col">
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">{item.name}</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">{item.email}</span>
                </div>
            ),
        },
        {
            header: lang === "ar" ? "الهاتف" : "Phone",
            accessor: (item: IUser) => (
                <div className="flex items-center gap-2">
                    <PhoneIcon className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                    <span className="text-sm text-[var(--color-text-primary)]">{item.phone}</span>
                </div>
            ),
        },
        {
            header: lang === "ar" ? "المحافظة" : "City",
            accessor: (item: IUser) => {
                const defaultAddress = item.addresses?.find((addr) => addr.is_default);
                const cityName = typeof defaultAddress?.city?.name === 'string' 
                    ? defaultAddress.city.name 
                    : defaultAddress?.city?.name?.[lang] || defaultAddress?.city?.name?.en;
                return cityName || "-";
            },
        },
        {
            header: lang === "ar" ? "تاريخ الانضمام" : "Joined",
            accessor: (item: IUser) => (
                <span className="text-sm text-[var(--color-text-secondary)]">{item.joined_at || "-"}</span>
            ),
        },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8" style={{ fontFamily: "var(--font-outfit)" }}>
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                    <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20">
                        <UsersIcon className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    {lang === "ar" ? "إدارة العملاء" : "Customer Management"}
                </h1>

                <Button
                    variant="primary"
                    onClick={() => {
                        setSelectedCustomer(null);
                        setIsModalOpen(true);
                    }}
                    leftIcon={<PlusIcon className="w-4 h-4" />}
                >
                    {lang === "ar" ? "إضافة عميل" : "Add Customer"}
                </Button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-[var(--radius-2xl)] bg-[var(--card-bg)] shadow-sm border border-[var(--color-border)]">
                    <div className="flex gap-4 items-center">
                        <div className="p-3 bg-[var(--color-primary)]/10 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20">
                            <UserCheckIcon className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                {lang === "ar" ? "إجمالي العملاء" : "Total Customers"}
                            </p>
                            <p className="font-bold text-2xl text-[var(--color-text-primary)]">{(customers || []).length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-5 rounded-[var(--radius-2xl)] bg-[var(--card-bg)] shadow-sm border border-[var(--color-border)]">
                    <div className="flex gap-4 items-center">
                        <div className="p-3 bg-orange-500/10 rounded-[var(--radius-xl)] border border-orange-500/20">
                            <MapPinIcon className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                {lang === "ar" ? "محافظات مغطاة" : "Cities Covered"}
                            </p>
                            <p className="font-bold text-2xl text-[var(--color-text-primary)]">{(cities || []).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={customers || []}
                isLoading={isLoading}
                paginationType={paginationType}
                meta={meta}
                onFilterChange={handleFilterServer}
                filterSideServer={handleFilterServer}
                columns={customerColumns}
                filterFields={customerFilters}
                lang={lang}
                onDelete={(item) => handleDelete(item.id)}
                onEdit={(item) => handleEdit(item)}
                renderMobileCard={(item) => {
                    const defaultAddress = item.addresses?.find((addr) => addr.is_default);
                    const cityName = typeof defaultAddress?.city?.name === 'string' 
                        ? defaultAddress.city.name 
                        : defaultAddress?.city?.name?.[lang] || defaultAddress?.city?.name?.en;

                    return (
                        <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border)] w-full">
                            <div>
                                <p className="font-bold text-sm text-[var(--color-text-primary)]">{item.name}</p>
                                <p className="text-xs text-[var(--color-text-secondary)]">{item.phone}</p>
                            </div>
                            <span className="text-xs font-semibold text-[var(--color-primary)]">
                                {cityName || "N/A"}
                            </span>
                        </div>
                    );
                }}
            />

            {/* Modal */}
            <CustomerModal
                isOpen={isModalOpen}
                closeModal={() => {
                    setIsModalOpen(false);
                    loadData();
                }}
                customer={selectedCustomer}
            />
        </div>
    );
}
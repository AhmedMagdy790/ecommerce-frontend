import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    PlusIcon,
    PackageIcon,
    TagIcon,
    ArchiveIcon,
} from "lucide-react";

import { useLang } from "@/shared/context/LanguageContext";
import DataTable from "@/shared/components/DataTable/DataTable";
import { type FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { confirm } from "@/shared/components/confirmModal/confirm";

import { type IOrder, type IOrderState } from "../types/types";
import { useOrderStore } from "../store/useOrderStore";
import OrderFormWizard from "../components/OrderForm/OrderFormWizard";
import echo from "@/lib/echo";
import { useAuthStore } from "@/store/authStore";

const orderStatusOptions = [
  { label: "All", value: null },
  ...['pending', 'processing', 'shipped', 'completed', 'cancelled', 'returned'].map((item) => ({
    label: item.charAt(0).toUpperCase() + item.slice(1),
    value: item,
  })),
];

export default function OrdersPage() {
    const { lang } = useLang();

    const [showTrashed, setShowTrashed] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = useAuthStore((state) => state.user); 

    const isFetching = useRef(false);

    const {
        orders,
        adminOrders,
        trashedOrders,
        isLoading,
        error,
        fetchAdminOrders,
        fetchTrashed,
        addOrder,
        updateOrder,
        updateOrderStatus,
        restoreOrder,
        deleteOrder
    } = useOrderStore();

    useEffect(() => { fetchAdminOrders(); }, [fetchAdminOrders]);

    const loadData = useCallback(async () => {
        if (isFetching.current) return;

        isFetching.current = true;

        try {
            if (showTrashed) {
                await fetchTrashed();
            } else {
                await fetchAdminOrders();
            }
        } finally {
            isFetching.current = false;
        }
    }, [showTrashed, fetchTrashed, fetchAdminOrders]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // WebSocket Listeners for User & Admin Channels
    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;

        const ordersChannel = echo.private(`orders.${userId}`);
        
        ordersChannel.listen('.OrderCancelledEvent', (data: any) => {
            console.log('❌ [Event Special] Order cancelled:', data.order);
        });

        ordersChannel.listenToAll((eventName: string, data: any) => {
            console.log(`ℹ️ [Channel Monitor] Event received: ${eventName}`, data);
        });

        const chatChannel = echo.private('Chat')
            .listen('ChatMessage', (data: any) => {
                console.log('💬 [Event Special] New chat message:', data);
            });

        return () => {
            echo.leave(`orders.${userId}`);
            echo.leave('Chat');
        };
    }, [user?.id]); 

    useEffect(() => {
        const token = useAuthStore.getState().accessToken;
        if (!token) return;

        const adminChannel = echo.private('admin.orders');
        
        adminChannel.listen('.OrderCancelledEvent', (data: any) => {
            console.log('❌ [Admin Panel] New order cancelled in system:', data.order);
        });

        return () => {
            echo.leave('admin.orders');
        };
    }, []); 
    
    // Filters
    const OrderFilters: FilterField[] = [
        {
            key: "order_number",
            label: "Order Number",
            type: "text",
            placeholder: "Search...",
        },
        {
            key: "city",
            label: "City",
            type: "text",
            placeholder: "Giza...",
        },
        {
            key: "status",
            label: "Status",
            type: "select",
            options: orderStatusOptions
        },
        {
            key: "phone",
            label: "Phone",
            type: "number",
            placeholder: "010*******"
        },
    ];

    // Actions
    const handleEdit = (order: IOrder) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await confirm({
            title: "Delete Order",
            description: "Are you sure?",
            confirmText: "Confirm",
            cancelText: "Cancel",
        });

        if (!result) return;

        await deleteOrder(id);
    };

    const handleRestore = async (id: number) => {
        await restoreOrder(id);
    };

    const handleStatus = (id: number, status: IOrderState) => {
        if (showTrashed) return;
        updateOrder(id, status);
    };

    const OrdersColumns = [
        {
            header: "Order Number",
            accessor: "order_number",
        },
        {
            header: "Customer",
            accessor: (row: any) => row.user?.name || "Guest Customer", 
        },
        {
            header: "Total Amount",
            accessor: (row: any) => row.amounts?.total_amount,
            render: (value: any, row: any) => (
                <span className="font-bold text-[var(--color-success)] whitespace-nowrap">
                    {value} {row.amounts?.currency}
                </span>
            ),
        },
        {
            header: "Status",
            accessor: "status",
            render: (status: string, row: any) => (
                <span className="badge badge-info">{status}</span>
            ),
        }, 
        {
            header: "Date",
            accessor: "created_at",
            render: (value: string) => new Date(value).toLocaleDateString('en-US')
        },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                    <PackageIcon className="w-6 h-6 text-[var(--color-primary)]" />
                    {lang === "ar" ? "إدارة الطلبات" : "Manage Orders"}
                </h1>

                <button
                    onClick={() => {
                        setSelectedOrder(null);
                        setIsModalOpen(true);
                    }}
                    className="
                        inline-flex 
                        items-center 
                        justify-center 
                        gap-2 
                        rounded-[var(--radius-md)] 
                        bg-[var(--color-primary)] 
                        px-4 
                        py-2.5 
                        text-sm 
                        font-medium 
                        text-white 
                        hover:bg-[var(--color-primary-hover)] 
                        transition-all 
                        duration-[var(--duration-fast)]
                        shadow-[var(--shadow-xs)]
                        active:scale-95
                    "
                >
                    <PlusIcon className="w-4 h-4" />
                    {lang === "ar" ? "إضافة طلب" : "Add Order"}
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-2 gap-4 text-[var(--color-text-secondary)]">
                {/* Total Products */}
                <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--card-bg)] border border-[var(--color-border)] shadow-[var(--shadow-xs)]">
                    <div className="flex gap-4 items-center">
                        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--blue-50)] text-[var(--color-primary)]">
                            <TagIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                                {lang === "ar" ? "إجمالي المنتجات" : "Total Products"}
                            </p>
                            <p className="font-bold text-xl text-[var(--color-text-primary)] mt-0.5">
                                {adminOrders.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trashed Products */}
                <div
                    onClick={() => setShowTrashed(!showTrashed)}
                    className={`
                        p-5 
                        rounded-[var(--radius-xl)] 
                        shadow-[var(--shadow-xs)] 
                        cursor-pointer 
                        transition-all 
                        duration-[var(--duration-fast)]
                        bg-[var(--card-bg)]
                        border 
                        ${showTrashed ? "border-[var(--color-error)] bg-[var(--red-500)]/5" : "border-[var(--color-border)]"}
                    `}
                >
                    <div className="flex gap-4 items-center">
                        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--red-500)]/10 text-[var(--color-error)]">
                            <ArchiveIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                                {lang === "ar" ? "المنتجات المحذوفة" : "Trashed Products"}
                            </p>
                            <p className="font-bold text-xl text-[var(--color-text-primary)] mt-0.5">
                                {trashedOrders.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={showTrashed ? trashedOrders : adminOrders}
                showTrashed={showTrashed}
                columns={OrdersColumns}
                filterFields={OrderFilters}
                lang={lang}
                onDelete={(item) => handleDelete(item.id)}
                onEdit={(item) => handleEdit(item)}
                onRestore={(item) => handleRestore(item.id)}
                renderMobileCard={(item) => (
                    <div>
                        <p className="font-bold text-[var(--color-text-primary)]">{item.name}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">{item.brand}</p>
                    </div>
                )}
            />

            <OrderFormWizard 
                isOpen={isModalOpen}
                selectOrder={selectedOrder}
                closeModal={() => setIsModalOpen(false)}
            />
        </div>
    );
}
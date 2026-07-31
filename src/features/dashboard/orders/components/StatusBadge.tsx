export const StatusBadge = ({ status }: { status: string }) => {
    const config: any = {
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        processing: "bg-blue-100 text-blue-700 border-blue-200",
        shipped: "bg-purple-100 text-purple-700 border-purple-200",
        completed: "bg-green-100 text-green-700 border-green-200",
        cancelled: "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs border ${config[status] || "bg-gray-100"}`}>
            {status.toUpperCase()}
        </span>
    );
};
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle, Trash2, Package, type LucideIcon } from "lucide-react";

type StatusType = "active" | "inactive" | "trashed" | "total" | string;

interface GlobalStatusProps {
  status: StatusType;
  label?: string;
}

const GlobalStatusBadge = memo(function GlobalStatusBadge({ status, label }: GlobalStatusProps) {
  const { t } = useTranslation("common");

  const statusConfig: Record<string, { icon: LucideIcon; color: string; translationKey: string }> = {
    active: {
      icon: CheckCircle2,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      translationKey: "status.active",
    },
    inactive: {
      icon: XCircle,
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      translationKey: "status.inactive",
    },
    trashed: {
      icon: Trash2,
      color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      translationKey: "status.trashed",
    },
    total: {
      icon: Package,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      translationKey: "status.total",
    },
  };

  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;
  const displayText = label || t(config.translationKey, status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{displayText}</span>
    </span>
  );
});

export default GlobalStatusBadge;
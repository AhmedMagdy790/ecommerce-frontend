import { LockIcon, PackageIcon, UserIcon } from "lucide-react";

export const PROFILE_TABS = [
  {
    id: "info",
    icon: UserIcon,
    label: "tabs.info.label",
    description: "tabs.info.description",
  },
  {
    id: "security",
    icon: LockIcon,
    label: "tabs.security.label",
    description: "tabs.security.description",
  },
  {
    id: "orders",
    icon: PackageIcon,
    label: "tabs.orders.label",
    description: "tabs.orders.description",
  },
] as const;

export type TabKey = typeof PROFILE_TABS[number]["id"];
import React from "react";
import {
  BoxCubeIcon,
  CalenderIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "@/assets/icons";
import { CreditCardIcon, PackageIcon, ShieldAlertIcon, TruckIcon, UsersIcon } from "lucide-react";

export type SubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
};

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
};

export const navItems: NavItem[] = [
  {
    icon: React.createElement(GridIcon),
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    icon: React.createElement(UserCircleIcon),
    name: "Profile Settings",
    subItems: [
      { name: "Personal Info", path: "/admin/profile" },
      { name: "Security", path: "/admin/profile/security" },
    ],
  },
  {
    icon: React.createElement(ListIcon),
    name: "E-commerce Lab",
    subItems: [
      { name: "Orders", path: "/admin/orders" },
      { name: "Products", path: "/admin/products" },
      { name: "Categories", path: "/admin/categories" },
      { name: "Product Variants", path: "/admin/products/variants" },
    ],
  },
  {
    icon: React.createElement(PageIcon),
    name: "CMS",
    subItems: [
      { name: "Pages", path: "/admin/cms/pages" },
      { name: "Sections", path: "/admin/cms/sections" },
      { name: "Navigation", path: "/admin/cms/navigation" }
    ],
  },
  {
    icon: React.createElement(TruckIcon),
    name: "Shipping",
    subItems: [
      { name: "Couriers", path: "/admin/shipping" },
      { name: "Rates", path: "/admin/shipping/rates" },
      { name: "Cities", path: "/admin/shipping/cities" },
    ],
  },
  {
    icon: React.createElement(CreditCardIcon, { className: "size-5" }),
    name: "Payment Gateways",
    subItems: [
      { name: "All Gateways", path: "/admin/payment-gateways" },
      { name: "Countries", path: "/admin/countries" }, // إضافة رابط الدول هنا
    ],
  },
  {
  icon: React.createElement(UsersIcon, { className: "size-5" }),
    name: "Managers",
    subItems: [
      { name: "All Managers", path: "/admin/managers" },
      { name: "Add Manager", path: "/admin/managers/create" },
    ],
  },
  {
    icon: React.createElement(UsersIcon, { className: "size-5" }),
    name: "Customers",
    subItems: [
      { name: "All Customers", path: "/admin/users" },
      { name: "Customer Groups", path: "/admin/users/groups" },
    ],
  },
  {
    icon: React.createElement(ShieldAlertIcon, { className: "size-5" }),
    name: "Access Control",
    subItems: [
      { name: "Roles & Permissions", path: "/admin/roles" },
      { name: "Admin Users", path: "/admin/admins" },
    ],
  },
  {
    icon: React.createElement(PackageIcon),
    name: "Inventory",
    subItems: [
      { name: "Stock Overview", path: "/admin/inventory" },
    ],
  },
  {
    icon: React.createElement(PageIcon),
    name: "Locations",
    subItems: [
      { name: "Countries", path: "/admin/locations/countries" },
      { name: "Cities", path: "/admin/locations/cities" },
    ],
  },
  {
    icon: React.createElement(CalenderIcon),
    name: "Calendar",
    path: "/calendar",
  },
  {
    name: "Tables",
    icon: React.createElement(TableIcon),
    subItems: [{ name: "Basic Tables", path: "/basic-tables" }],
  },
];

export const othersItems: NavItem[] = [
  {
    icon: React.createElement(PieChartIcon),
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: React.createElement(BoxCubeIcon),
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: React.createElement(PlugInIcon),
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];
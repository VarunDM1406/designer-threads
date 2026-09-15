import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  ShoppingCart,
  Users,
  Ticket,
  Image,
  Settings,
} from "lucide-react";

export const adminNavigation = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Collections",
    href: "/admin/collections",
    icon: Layers,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: Ticket,
  },
  {
    title: "Banners",
    href: "/admin/banners",
    icon: Image,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];
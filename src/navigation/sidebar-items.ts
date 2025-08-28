import {
  Users,
  ChartBarStacked,
  Clapperboard,
  type LucideIcon,
  Warehouse,
  ClipboardList,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Movies",
        url: "/dashboard/movies",
        icon: Clapperboard,
      },
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: ClipboardList,
      },
      {
        title: "Category",
        url: "/dashboard/categories",
        icon: ChartBarStacked,
      },
      {
        title: "Subcategory",
        url: "/dashboard/subcategories",
        icon: ChartBarStacked,
      },
      {
        title: "Stock Management",
        url: "/dashboard/stock",
        icon: Warehouse,
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Category",
        url: "/dashboard/categories",
        icon: ChartBarStacked,
      },
      {
        title: "Subcategory",
        url: "/dashboard/subcategories",
        icon: ChartBarStacked,
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
        comingSoon: true,
      }
    ],
  },
];

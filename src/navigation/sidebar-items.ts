import {
  Users,
  ChartBarStacked,
  Clapperboard,
  type LucideIcon,
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
        title: "Category",
        url: "/dashboard/categories",
        icon: ChartBarStacked,
      },
      {
        title: "Subcategory",
        url: "/dashboard/subcategories",
        icon: ChartBarStacked,
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

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar";
import {
  Home,
  Building2,
  ListTree,
  Package,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { useNavigate } from "@remix-run/react";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Master Klien", icon: Building2, href: "/mst-klien" },
  { label: "Master Category", icon: ListTree, href: "/mst-category" },
  { label: "Master Barang", icon: Package, href: "/mst-barang" },
  { label: "Order", icon: ShoppingCart, href: "/order" },
];

export function PostauthSidebar() {
  const navigate = useNavigate()

  return (
    <Sidebar className="flex flex-col h-full">
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className="flex items-center gap-2 w-full"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="border-t p-4">
        <button
          onClick={() => {
            navigate("/login")
          }}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </Sidebar>
  );
}

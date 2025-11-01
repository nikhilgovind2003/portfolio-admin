import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderKanban,
  Lightbulb,
  Code,
  UserCircle,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'CMS Data', url: '/dashboard/cms', icon: FileText },
  { title: 'Profile', url: '/dashboard/profile', icon: UserCircle },
  { title: 'Projects', url: '/dashboard/projects', icon: FolderKanban },
  { title: 'Skills', url: '/dashboard/skills', icon: Lightbulb },
  { title: 'Technologies', url: '/dashboard/technologies', icon: Code },
  { title: 'Users', url: '/dashboard/users', icon: Users },
];

export const DashboardSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-xl text-sidebar-primary ${isCollapsed ? 'hidden' : 'block'}`}>
            Admin
          </h2>
          {isCollapsed && (
            <span className="font-bold text-xl text-sidebar-primary">A</span>
          )}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

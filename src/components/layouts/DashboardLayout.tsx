
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ThemeToggle';
import { LogOut, User } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: Array<{
    title: string;
    icon: React.ElementType;
    href: string;
    active?: boolean;
  }>;
  headerTitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  sidebarItems,
  headerTitle = 'Dashboard' 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar variant="inset">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-lg font-bold text-primary-foreground">L</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gradient">LegalCRM</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={item.active}
                        tooltip={item.title}
                      >
                        <a 
                          href={item.href} 
                          className="flex items-center gap-3"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="px-2">
              <div className="flex items-center gap-2 rounded-md p-2 hover:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.name || 'User'} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="truncate text-xs text-muted-foreground capitalize">
                    {user?.role || 'User'} {user?.subscriptionType ? `• ${user.subscriptionType}` : ''}
                  </p>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                <ThemeToggle />
                <Button variant="ghost" size="icon" asChild>
                  <a href="/settings">
                    <User className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{headerTitle}</h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;


import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

const Settings: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    firm: 'Legal Partners LLC',
    phone: '(555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
  });

  // Navigation items for the sidebar
  const sidebarItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    { 
      title: 'Clients', 
      icon: Users, 
      href: '/dashboard/clients',
      active: location.pathname === '/dashboard/clients',
    },
    { 
      title: 'Intake Forms', 
      icon: FileText, 
      href: '/dashboard/intake-forms',
      active: location.pathname === '/dashboard/intake-forms',
    },
    { 
      title: 'Documents', 
      icon: FileText, 
      href: '/dashboard/documents',
      active: location.pathname === '/dashboard/documents',
    },
    { 
      title: 'Contracts', 
      icon: FileText, 
      href: '/dashboard/contracts',
      active: location.pathname === '/dashboard/contracts',
    },
    { 
      title: 'Billing', 
      icon: CreditCard, 
      href: '/dashboard/billing',
      active: location.pathname === '/dashboard/billing',
    },
    { 
      title: 'Settings', 
      icon: SettingsIcon, 
      href: '/dashboard/settings',
      active: location.pathname === '/dashboard/settings',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update here
    console.log('Profile updated:', formData);
    alert('Profile updated successfully');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change here
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    console.log('Password changed');
    alert('Password changed successfully');
  };

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Account Settings"
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firm">Law Firm / Organization</Label>
                      <Input 
                        id="firm" 
                        name="firm" 
                        value={formData.firm} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  <Button type="submit" className="mt-4">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Password Tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      name="currentPassword" 
                      type="password" 
                      value={formData.currentPassword} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      name="newPassword" 
                      type="password" 
                      value={formData.newPassword} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      value={formData.confirmPassword} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <Button type="submit" className="mt-4">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage your notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={formData.emailNotifications} 
                    onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch 
                    checked={formData.smsNotifications} 
                    onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                  />
                </div>
                <Button className="mt-4">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch 
                    checked={formData.twoFactorAuth} 
                    onCheckedChange={(checked) => handleSwitchChange('twoFactorAuth', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Session Management</h3>
                  <p className="text-sm text-muted-foreground">Review and manage your active sessions</p>
                  <div className="mt-2 p-3 border rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Current Session</p>
                        <p className="text-xs text-muted-foreground">Chrome on Windows • {new Date().toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-2">
                    Log Out All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

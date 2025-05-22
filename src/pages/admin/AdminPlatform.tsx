
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const AdminPlatform: React.FC = () => {
  const location = useLocation();
  
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'Legal CRM',
    supportEmail: 'support@legalcrm.com',
    maxUploadSize: '25',
    maintenanceMode: false,
    debugMode: false,
    defaultUserRole: 'user',
  });
  
  const [paypalSettings, setPaypalSettings] = useState({
    clientId: 'AQcxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    secret: '••••••••••••••••••••••••••••••••',
    environment: 'sandbox',
    webhookId: 'WH-xxxxxxxxxxxxxxx',
    basicPlanId: 'P-BASIC123456',
    proPlanId: 'P-PRO123456',
    enterprisePlanId: 'P-ENT123456',
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'notifications@legalcrm.com',
    smtpPassword: '••••••••••••••••',
    senderName: 'Legal CRM',
    senderEmail: 'notifications@legalcrm.com',
    enableEmailNotifications: true,
  });

  // Navigation items for the sidebar
  const sidebarItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard',
    },
    { 
      title: 'All Users', 
      icon: Users, 
      href: '/admin/users',
      active: location.pathname === '/admin/users',
    },
    { 
      title: 'Subscriptions', 
      icon: CreditCard, 
      href: '/admin/subscriptions',
      active: location.pathname === '/admin/subscriptions',
    },
    { 
      title: 'Documents', 
      icon: FileText, 
      href: '/admin/documents',
      active: location.pathname === '/admin/documents',
    },
    { 
      title: 'System Logs', 
      icon: FileText, 
      href: '/admin/logs',
      active: location.pathname === '/admin/logs',
    },
    { 
      title: 'Platform Settings', 
      icon: Settings, 
      href: '/admin/platform',
      active: location.pathname === '/admin/platform',
    },
  ];

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handlePayPalSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaypalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (setting: string, section: string, checked: boolean) => {
    if (section === 'general') {
      setGeneralSettings(prev => ({ ...prev, [setting]: checked }));
    } else if (section === 'email') {
      setEmailSettings(prev => ({ ...prev, [setting]: checked }));
    }
  };

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle general settings update
    console.log('General settings updated:', generalSettings);
    alert('General settings updated successfully');
  };

  const handlePayPalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle PayPal settings update
    console.log('PayPal settings updated:', paypalSettings);
    alert('PayPal settings updated successfully');
  };
  
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email settings update
    console.log('Email settings updated:', emailSettings);
    alert('Email settings updated successfully');
  };

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      headerTitle="Platform Settings"
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Platform Settings</h2>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payment">Payment Integration</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure global platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGeneralSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="platformName">Platform Name</Label>
                      <Input 
                        id="platformName" 
                        name="platformName" 
                        value={generalSettings.platformName} 
                        onChange={handleGeneralSettingsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input 
                        id="supportEmail" 
                        name="supportEmail" 
                        type="email" 
                        value={generalSettings.supportEmail} 
                        onChange={handleGeneralSettingsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                      <Input 
                        id="maxUploadSize" 
                        name="maxUploadSize" 
                        type="number" 
                        value={generalSettings.maxUploadSize} 
                        onChange={handleGeneralSettingsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultUserRole">Default User Role</Label>
                      <select
                        id="defaultUserRole"
                        name="defaultUserRole"
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={generalSettings.defaultUserRole}
                        onChange={handleGeneralSettingsChange}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-muted-foreground">Only admins can access the platform when enabled</p>
                      </div>
                      <Switch 
                        checked={generalSettings.maintenanceMode} 
                        onCheckedChange={(checked) => handleSwitchChange('maintenanceMode', 'general', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Debug Mode</p>
                        <p className="text-sm text-muted-foreground">Enable verbose logging and error messages</p>
                      </div>
                      <Switch 
                        checked={generalSettings.debugMode} 
                        onCheckedChange={(checked) => handleSwitchChange('debugMode', 'general', checked)}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="mt-4">
                    Save General Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment Integration Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>PayPal Integration</CardTitle>
                <CardDescription>Configure payment gateway settings</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayPalSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="clientId">PayPal Client ID</Label>
                      <Input 
                        id="clientId" 
                        name="clientId" 
                        value={paypalSettings.clientId} 
                        onChange={handlePayPalSettingsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secret">PayPal Secret</Label>
                      <Input 
                        id="secret" 
                        name="secret" 
                        type="password" 
                        value={paypalSettings.secret} 
                        onChange={handlePayPalSettingsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="environment">Environment</Label>
                      <select
                        id="environment"
                        name="environment"
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={paypalSettings.environment}
                        onChange={handlePayPalSettingsChange}
                      >
                        <option value="sandbox">Sandbox (Testing)</option>
                        <option value="production">Production</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhookId">Webhook ID</Label>
                      <Input 
                        id="webhookId" 
                        name="webhookId" 
                        value={paypalSettings.webhookId} 
                        onChange={handlePayPalSettingsChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-2">Subscription Plan IDs</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="basicPlanId">Basic Plan ID</Label>
                        <Input 
                          id="basicPlanId" 
                          name="basicPlanId" 
                          value={paypalSettings.basicPlanId} 
                          onChange={handlePayPalSettingsChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proPlanId">Professional Plan ID</Label>
                        <Input 
                          id="proPlanId" 
                          name="proPlanId" 
                          value={paypalSettings.proPlanId} 
                          onChange={handlePayPalSettingsChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="enterprisePlanId">Enterprise Plan ID</Label>
                        <Input 
                          id="enterprisePlanId" 
                          name="enterprisePlanId" 
                          value={paypalSettings.enterprisePlanId} 
                          onChange={handlePayPalSettingsChange} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="mt-4">
                    Save PayPal Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Email Settings Tab */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email server settings</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input 
                        id="smtpHost" 
                        name="smtpHost" 
                        value={emailSettings.smtpHost} 
                        onChange={handleEmailSettingsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input 
                        id="smtpPort" 
                        name="smtpPort" 
                        value={emailSettings.smtpPort} 
                        onChange={handleEmailSettingsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input 
                        id="smtpUsername" 
                        name="smtpUsername" 
                        value={emailSettings.smtpUsername} 
                        onChange={handleEmailSettingsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input 
                        id="smtpPassword" 
                        name="smtpPassword" 
                        type="password" 
                        value={emailSettings.smtpPassword} 
                        onChange={handleEmailSettingsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Sender Name</Label>
                      <Input 
                        id="senderName" 
                        name="senderName" 
                        value={emailSettings.senderName} 
                        onChange={handleEmailSettingsChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail">Sender Email</Label>
                      <Input 
                        id="senderEmail" 
                        name="senderEmail" 
                        type="email" 
                        value={emailSettings.senderEmail} 
                        onChange={handleEmailSettingsChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                      </div>
                      <Switch 
                        checked={emailSettings.enableEmailNotifications} 
                        onCheckedChange={(checked) => handleSwitchChange('enableEmailNotifications', 'email', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <Button type="submit">
                      Save Email Settings
                    </Button>
                    <Button variant="outline" type="button">
                      Test Connection
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Backup & Recovery Tab */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
                <CardDescription>Manage system backups and data restoration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Database Backup</h3>
                    <p className="text-sm text-muted-foreground mb-4">Create a backup of the entire database</p>
                    <Button>
                      Create New Backup
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Recent Backups</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left">Filename</th>
                            <th className="px-4 py-3 text-left">Date Created</th>
                            <th className="px-4 py-3 text-left">Size</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-muted/50">
                            <td className="px-4 py-3 font-medium">backup_2023_05_12.sql</td>
                            <td className="px-4 py-3">2023-05-12 00:00:00</td>
                            <td className="px-4 py-3">45.3 MB</td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button className="text-sm text-primary hover:underline">Download</button>
                                <button className="text-sm text-primary hover:underline">Restore</button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-muted/50">
                            <td className="px-4 py-3 font-medium">backup_2023_05_05.sql</td>
                            <td className="px-4 py-3">2023-05-05 00:00:00</td>
                            <td className="px-4 py-3">43.1 MB</td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button className="text-sm text-primary hover:underline">Download</button>
                                <button className="text-sm text-primary hover:underline">Restore</button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-muted/50">
                            <td className="px-4 py-3 font-medium">backup_2023_04_28.sql</td>
                            <td className="px-4 py-3">2023-04-28 00:00:00</td>
                            <td className="px-4 py-3">42.8 MB</td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button className="text-sm text-primary hover:underline">Download</button>
                                <button className="text-sm text-primary hover:underline">Restore</button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Scheduled Backups</h3>
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <p className="font-medium">Daily Automatic Backup</p>
                        <p className="text-sm text-muted-foreground">Runs at 02:00 AM UTC</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                        <Switch checked={true} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminPlatform;

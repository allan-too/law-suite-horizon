
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center space-y-4">
        <div className="rounded-full bg-destructive/10 p-3">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-lg text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <div className="w-full max-w-sm space-y-2">
          <p className="text-sm text-muted-foreground">
            {user
              ? `Your account (${user.email}) has the role of ${user.role}.`
              : "You need to be signed in with the appropriate permissions."}
          </p>
          <div className="flex justify-center space-x-2">
            <Button asChild>
              <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

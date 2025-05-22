
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [paymentDetails, setPaymentDetails] = useState({
    planName: '',
    planAmount: '',
    subscriptionId: ''
  });

  // In a real app, we would process the payment callback from PayPal here
  useEffect(() => {
    // Mock processing payment
    const timer = setTimeout(() => {
      // Check URL params for success or cancelation
      const params = new URLSearchParams(location.search);
      const success = params.get('success');
      const canceled = params.get('canceled');
      const planId = params.get('planId');
      
      let planName = 'Basic';
      let planAmount = '$49/month';
      
      if (planId) {
        if (planId === 'pro') {
          planName = 'Professional';
          planAmount = '$99/month';
        } else if (planId === 'enterprise') {
          planName = 'Enterprise';
          planAmount = '$199/month';
        }
      }
      
      setPaymentDetails({
        planName,
        planAmount,
        subscriptionId: 'SUB-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      });
      
      if (canceled) {
        setStatus('error');
      } else {
        setStatus('success');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [location.search]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Subscription Checkout</CardTitle>
          <CardDescription>Finalizing your subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'processing' && (
            <div className="p-6 flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="text-center">Processing your subscription payment...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-700 dark:text-green-400">Payment Successful</h3>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Your subscription has been activated successfully.
                  </p>
                </div>
              </div>
              
              <div className="border p-4 rounded-md space-y-3">
                <p className="font-medium">Subscription Details</p>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">{paymentDetails.planName}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{paymentDetails.planAmount}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Subscription ID:</span>
                  <span className="font-medium">{paymentDetails.subscriptionId}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Billed to:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-700 dark:text-red-400">Payment Failed</h3>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    There was an issue processing your payment. Please try again.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 pt-4">
                <button 
                  onClick={() => navigate('/pricing')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;

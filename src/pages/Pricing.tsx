
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import SubscriptionCard, { SubscriptionPlan } from '@/components/SubscriptionCard';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const Pricing = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "basic_plan",
      name: "Basic",
      price: 49,
      description: "Perfect for small practices",
      features: [
        "10 Clients",
        "5 Intake Forms",
        "Basic E-Signatures",
        "10 AI Document Analysis Credits",
        "Basic Analytics",
      ]
    },
    {
      id: "professional_plan",
      name: "Professional",
      price: 99,
      description: "Ideal for growing firms",
      recommended: true,
      features: [
        "50 Clients",
        "Unlimited Intake Forms",
        "Advanced E-Signatures with Audit Trail",
        "30 AI Document Analysis Credits",
        "Advanced Analytics",
      ]
    },
    {
      id: "enterprise_plan",
      name: "Enterprise",
      price: 199,
      description: "For established practices",
      buttonText: "Contact Sales",
      features: [
        "Unlimited Clients",
        "White-labeled Client Portal",
        "Advanced E-Signatures with Custom Branding",
        "100 AI Document Analysis Credits",
        "Advanced Analytics & Reporting",
      ]
    }
  ];
  
  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      toast("Please login to subscribe", {
        description: "You need to be logged in to subscribe to a plan",
        action: {
          label: "Login",
          onClick: () => navigate('/login')
        }
      });
      return;
    }
    
    setProcessingPlan(planId);
    
    try {
      if (planId === 'enterprise_plan') {
        // For enterprise plan, redirect to contact form
        toast.success("Thank you for your interest in our Enterprise plan!");
        // Here you would redirect to a contact form or open a modal
        setProcessingPlan(null);
        return;
      }
      
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Subscription successful!", {
        description: `Thank you for subscribing to our ${subscriptionPlans.find(p => p.id === planId)?.name} plan.`,
      });
      
      // Here you would send a request to your backend to create the subscription
      console.log(`User ${user?.id} subscribed to plan ${planId}`);
      
      // Redirect to dashboard or confirmation page
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Subscription failed:', error);
      toast.error("Subscription failed", {
        description: "There was an error processing your subscription"
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for your practice
          </p>
          
          {/* Feature comparison table for larger screens */}
          <div className="mt-8 hidden lg:block">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary text-sm font-medium">
              <span className="mr-2">
                <Check className="h-4 w-4" />
              </span>
              All plans include 14-day free trial
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Subscription cards */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {subscriptionPlans.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                onSubscribe={handleSubscribe}
                isLoading={processingPlan === plan.id}
              />
            ))}
          </div>
          
          {/* Additional info */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-medium mb-4">All Plans Include</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8">
              {commonFeatures.map((feature, index) => (
                <div key={index} className="flex flex-col items-center p-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20">
            <h3 className="text-2xl font-medium text-center mb-8">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border rounded-lg p-6">
                  <h4 className="font-medium mb-2">{faq.question}</h4>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const commonFeatures = [
  {
    title: "Secure Data Storage",
    description: "All your data is encrypted and securely stored",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    )
  },
  {
    title: "Premium Support",
    description: "Access to our support team during business hours",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h16a2 2 0 0 1 1.2.4"/><path d="m2 10 10 7 10-7"/><path d="M12 3v7"/><path d="m5 8 7-5 7 5"/></svg>
    )
  },
  {
    title: "Regular Updates",
    description: "New features and improvements every month",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
    )
  },
  {
    title: "Mobile Access",
    description: "Access your work from anywhere, on any device",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
    )
  }
];

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes to your billing will be prorated."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards and PayPal. For Enterprise plans, we can also accommodate invoicing."
  },
  {
    question: "Is there a setup fee?",
    answer: "No, there are no setup fees for any of our plans. You only pay the monthly subscription fee."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
  },
  {
    question: "Do you offer custom plans?",
    answer: "Yes, contact our sales team to discuss custom requirements for your firm's specific needs."
  },
  {
    question: "What kind of support do you provide?",
    answer: "All plans include email support during business hours. The Professional and Enterprise plans also include priority support and training."
  }
];

export default Pricing;

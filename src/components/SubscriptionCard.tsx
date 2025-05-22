
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
  buttonText?: string;
}

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  onSubscribe: (planId: string) => Promise<void>;
  isLoading?: boolean;
}

const SubscriptionCard = ({ plan, onSubscribe, isLoading = false }: SubscriptionCardProps) => {
  const { id, name, price, description, features, recommended, buttonText = "Get Started" } = plan;

  return (
    <Card className={`flex flex-col transition-all duration-300 hover:shadow-lg ${
      recommended ? 'border-primary shadow-md scale-105 z-10' : ''
    }`}>
      <CardHeader className="relative">
        {recommended && (
          <Badge className="absolute top-4 right-4" variant="default">
            Recommended
          </Badge>
        )}
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <p className="text-3xl font-bold">${price}</p>
          <p className="text-muted-foreground text-sm">per month</p>
        </div>
        <ul className="space-y-2 my-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={name === "Enterprise" ? "outline" : "default"}
          onClick={() => onSubscribe(id)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;

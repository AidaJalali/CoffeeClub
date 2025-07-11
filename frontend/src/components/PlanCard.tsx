
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface PlanCardProps {
    title: string;
    description: string;
    price: string;
    features: string[];
    isPopular?: boolean;
    onSelect: () => void;
    className?: string;
}

const PlanCard = ({
                      title,
                      description,
                      price,
                      features,
                      isPopular = false,
                      onSelect,
                      className = ""
                  }: PlanCardProps) => {
    return (
        <Card className={`relative hover:shadow-xl transition-all duration-300 border-2 ${
            isPopular
                ? 'border-primary coffee-gradient text-white scale-105'
                : 'border-coffee-light/30 glass-effect hover:border-primary/50'
        } ${className}`}>
            {isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary border-primary">
                    Most Popular
                </Badge>
            )}

            <CardHeader className="text-center pb-4">
                <CardTitle className={`text-2xl font-display ${
                    isPopular ? 'text-white' : 'text-coffee-espresso'
                }`}>
                    {title}
                </CardTitle>
                <CardDescription className={isPopular ? 'text-white/90' : 'text-coffee-brown'}>
                    {description}
                </CardDescription>
                <div className="pt-4">
          <span className={`text-4xl font-bold ${
              isPopular ? 'text-white' : 'text-coffee-espresso'
          }`}>
            {price}
          </span>
                    <span className={`text-sm ${
                        isPopular ? 'text-white/80' : 'text-coffee-brown'
                    }`}>
            /month
          </span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <Check className={`w-5 h-5 ${
                                isPopular ? 'text-white' : 'text-primary'
                            }`} />
                            <span className={`text-sm ${
                                isPopular ? 'text-white/90' : 'text-coffee-brown'
                            }`}>
                {feature}
              </span>
                        </li>
                    ))}
                </ul>

                <Button
                    onClick={onSelect}
                    className={`w-full transition-all duration-300 ${
                        isPopular
                            ? 'bg-white text-primary hover:bg-gray-100'
                            : 'coffee-gradient hover:opacity-90 text-white'
                    }`}
                >
                    Choose {title}
                </Button>
            </CardContent>
        </Card>
    );
};

export default PlanCard;
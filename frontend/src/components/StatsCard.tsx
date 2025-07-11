import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    className?: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, className = "" }: StatsCardProps) => {
    return (
        <Card className={`glass-effect border-0 hover:shadow-lg transition-all duration-300 ${className}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                        <p className="text-3xl font-bold text-coffee-espresso font-display">{value}</p>
                        {trend && (
                            <p className="text-xs text-coffee-brown mt-1">{trend}</p>
                        )}
                    </div>
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatsCard;
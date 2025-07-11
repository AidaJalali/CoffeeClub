
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

interface ScheduleCardProps {
    title: string;
    time: string;
    date: string;
    location: string;
    attendees: number;
    description: string;
    onJoin: () => void;
    className?: string;
}

const ScheduleCard = ({
                          title,
                          time,
                          date,
                          location,
                          attendees,
                          description,
                          onJoin,
                          className = ""
                      }: ScheduleCardProps) => {
    return (
        <Card className={`group hover:shadow-xl transition-all duration-300 border-0 glass-effect hover:scale-105 ${className}`}>
            <CardHeader className="pb-3">
                <CardTitle className="font-display text-xl text-coffee-espresso group-hover:text-primary transition-colors">
                    {title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-coffee-brown">
                        <Calendar className="w-4 h-4" />
                        <span>{date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-coffee-brown">
                        <Clock className="w-4 h-4" />
                        <span>{time}</span>
                    </div>

                    <div className="flex items-center gap-2 text-coffee-brown">
                        <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-coffee-brown">
                        <Users className="w-4 h-4" />
                        <span>{attendees} attending</span>
                    </div>
                </div>

                <Button
                    onClick={onJoin}
                    className="w-full coffee-gradient hover:opacity-90 transition-opacity text-white font-medium"
                >
                    Join Coffee Session
                </Button>
            </CardContent>
        </Card>
    );
};

export default ScheduleCard;
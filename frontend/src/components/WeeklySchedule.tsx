import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, MapPin, Coffee } from 'lucide-react';

interface ScheduleItem {
    id: string;
    day: string;
    time: string;
    title: string;
    location: string;
    attendees: number;
    coffeeType: string;
}

interface WeeklyScheduleProps {
    schedule: ScheduleItem[];
    onJoinSession: (sessionId: string) => void;
}

const WeeklySchedule = ({ schedule, onJoinSession }: WeeklyScheduleProps) => {
    const groupedSchedule = schedule.reduce((acc, item) => {
        if (!acc[item.day]) {
            acc[item.day] = [];
        }
        acc[item.day].push(item);
        return acc;
    }, {} as Record<string, ScheduleItem[]>);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-coffee-espresso mb-2">
                    Weekly Coffee Schedule
                </h2>
                <p className="text-coffee-brown">
                    Automatically generated sessions based on your subscription plan
                </p>
            </div>

            <div className="grid gap-4">
                {daysOfWeek.map(day => {
                    const daySchedule = groupedSchedule[day] || [];

                    return (
                        <Card key={day} className="glass-effect border-0">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-coffee-espresso">
                                    <Calendar className="w-5 h-5" />
                                    {day}
                                    <span className="text-sm font-normal text-coffee-brown ml-auto">
                    {daySchedule.length} session{daySchedule.length !== 1 ? 's' : ''}
                  </span>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                {daySchedule.length === 0 ? (
                                    <p className="text-coffee-brown/60 italic text-center py-4">
                                        No sessions scheduled for this day
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {daySchedule.map(session => (
                                            <div
                                                key={session.id}
                                                className="p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <h4 className="font-semibold text-coffee-espresso">
                                                        {session.title}
                                                    </h4>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => onJoinSession(session.id)}
                                                        className="coffee-gradient hover:opacity-90 text-white"
                                                    >
                                                        Join
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm text-coffee-brown">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{session.time}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{session.location}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        <span>{session.attendees} attending</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Coffee className="w-4 h-4" />
                                                        <span>{session.coffeeType}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklySchedule;
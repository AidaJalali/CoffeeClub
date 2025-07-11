
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, Calendar, TrendingUp, LogOut, Clock, User } from 'lucide-react';
import CoffeeIcon from '@/components/CoffeeIcon';
import CoffeeBackground from '@/components/CoffeeBackground';
import ScheduleCard from '@/components/ScheduleCard';
import StatsCard from '@/components/StatsCard';
import PlanCard from '@/components/PlanCard';
import WeeklySchedule from '@/components/WeeklySchedule';
import AuthPage from '@/components/AuthPage';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
    email: string;
    name: string;
    plan?: 'free' | 'daily' | 'weekly';
}

interface TodaysPlan {
    date: string;
    coffeeMakerIds: string[];
}

const Index = () => {
    const [user, setUser] = useState<User | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [todaysPlan, setTodaysPlan] = useState<TodaysPlan | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Fetch today's coffee plan
    useEffect(() => {
        const fetchTodaysPlan = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/plans/today');
                if (response.status === 204 || response.headers.get("content-length") === "0") {
                    // Handle empty response for "no plan today"
                    return;
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTodaysPlan(data);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to fetch plan');
                console.error("Could not fetch the plan:", e);
            }
        };

        if (user?.plan) {
            fetchTodaysPlan();
        }
    }, [user?.plan]);

    // Create morning and evening sessions from today's plan
    const todaysSessions = todaysPlan?.coffeeMakerIds ? [
        {
            title: "Morning Coffee Session",
            time: "9:00 AM",
            date: "Today",
            location: "Main Café",
            attendees: todaysPlan.coffeeMakerIds.length,
            description: `Coffee makers: ${todaysPlan.coffeeMakerIds.join(', ')}`
        },
        {
            title: "Evening Coffee Session",
            time: "6:00 PM",
            date: "Today",
            location: "Main Café",
            attendees: todaysPlan.coffeeMakerIds.length,
            description: `Coffee makers: ${todaysPlan.coffeeMakerIds.join(', ')}`
        }
    ] : [];

    // Mock weekly schedule data
    const weeklySchedule = [
        {
            id: '1',
            day: 'Monday',
            time: '9:00 AM',
            title: 'Morning Espresso Blend',
            location: 'Main Café',
            attendees: 8,
            coffeeType: 'Ethiopian Single Origin'
        },
        {
            id: '2',
            day: 'Monday',
            time: '6:00 PM',
            title: 'Evening Brew Session',
            location: 'Main Café',
            attendees: 12,
            coffeeType: 'Colombian Medium Roast'
        },
        {
            id: '3',
            day: 'Wednesday',
            time: '9:00 AM',
            title: 'Morning Coffee Workshop',
            location: 'Main Café',
            attendees: 15,
            coffeeType: 'Dark Roast Blend'
        },
        {
            id: '4',
            day: 'Wednesday',
            time: '6:00 PM',
            title: 'Evening Coffee Social',
            location: 'Main Café',
            attendees: 6,
            coffeeType: 'House Blend'
        },
        {
            id: '5',
            day: 'Friday',
            time: '9:00 AM',
            title: 'Morning Coffee Tasting',
            location: 'Main Café',
            attendees: 20,
            coffeeType: 'Specialty Reserve'
        },
        {
            id: '6',
            day: 'Friday',
            time: '6:00 PM',
            title: 'Evening Coffee Meetup',
            location: 'Main Café',
            attendees: 14,
            coffeeType: 'Light Roast Blend'
        }
    ];

    const subscriptionPlans = [
        {
            title: "Free Plan",
            description: "Perfect for casual coffee lovers",
            price: "$0",
            features: [
                "Access to 2 sessions per month",
                "Basic coffee varieties",
                "Community chat access",
                "Weekly newsletter"
            ]
        },
        {
            title: "Daily Plan",
            description: "For the dedicated coffee enthusiast",
            price: "$19",
            features: [
                "Access to both daily sessions (morning & evening)",
                "Premium coffee selections",
                "Priority booking",
                "Exclusive tastings",
                "Personal coffee journal",
                "Expert brewing tips"
            ],
            isPopular: true
        },
        {
            title: "Weekly Plan",
            description: "Balanced approach for regular coffee lovers",
            price: "$9",
            features: [
                "Up to 8 sessions per month",
                "Good variety of coffee types",
                "Group discounts",
                "Monthly coffee samples",
                "Brewing workshops"
            ]
        }
    ];

    const handleAuth = (userData: User) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        setSelectedPlan(null);
        setTodaysPlan(null);
        setError(null);
        toast({
            title: "Logged out",
            description: "You've been successfully logged out.",
        });
    };

    const handleJoinSession = (sessionId: string) => {
        if (!user?.plan) {
            toast({
                title: "Subscription Required",
                description: "Please select a subscription plan to join sessions.",
                variant: "destructive"
            });
            return;
        }

        toast({
            title: "Session Joined!",
            description: "You've successfully joined the coffee session. See you there! ☕",
        });
    };

    const handlePlanSelection = (planType: string) => {
        setSelectedPlan(planType);
        setUser(prev => prev ? { ...prev, plan: planType as 'free' | 'daily' | 'weekly' } : null);
        toast({
            title: "Plan Selected!",
            description: `You've successfully subscribed to the ${planType} plan.`,
        });
    };

    // Show auth page if user is not logged in
    if (!user) {
        return <AuthPage onAuth={handleAuth} />;
    }

    // Show plan selection if user hasn't selected a plan
    if (!user.plan) {
        return (
            <div className="min-h-screen relative">
                <CoffeeBackground />

                <div className="relative z-10 pt-8 pb-16">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-6">
                                <CoffeeIcon size={100} className="float-animation" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-display font-bold text-coffee-espresso mb-4">
                                Choose Your Coffee Journey
                            </h1>

                            <p className="text-xl text-coffee-brown mb-8 max-w-2xl mx-auto">
                                Select the perfect subscription plan to match your coffee passion and join our community of coffee enthusiasts.
                            </p>

                            <div className="flex justify-end mb-8">
                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {subscriptionPlans.map((plan, index) => (
                                <PlanCard
                                    key={plan.title}
                                    {...plan}
                                    onSelect={() => handlePlanSelection(plan.title.toLowerCase().replace(' plan', ''))}
                                    className={`fade-in-up stagger-${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main dashboard for logged-in users with selected plan
    return (
        <div className="min-h-screen relative">
            <CoffeeBackground />

            {/* Header Section */}
            <header className="relative z-10 pt-8 pb-8">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <CoffeeIcon size={60} />
                            <div>
                                <h1 className="text-2xl font-display font-bold text-coffee-espresso">
                                    Welcome back, {user.name}!
                                </h1>
                                <p className="text-coffee-brown capitalize">
                                    {user.plan} Plan Member
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>

                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-coffee-espresso mb-4">
                            Your Coffee Club Dashboard
                        </h2>

                        <p className="text-lg text-coffee-brown mb-6">
                            Discover automatically scheduled coffee sessions, connect with fellow enthusiasts, and perfect your brewing skills.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            <Badge variant="secondary" className="px-4 py-2 text-sm bg-coffee-light/20 text-coffee-espresso border-0">
                                <Coffee className="w-4 h-4 mr-2" />
                                Automated Sessions
                            </Badge>
                            <Badge variant="secondary" className="px-4 py-2 text-sm bg-coffee-light/20 text-coffee-espresso border-0">
                                <Users className="w-4 h-4 mr-2" />
                                Community Access
                            </Badge>
                            <Badge variant="secondary" className="px-4 py-2 text-sm bg-coffee-light/20 text-coffee-espresso border-0">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Expert Guidance
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            {/* Error Display */}
            {error && (
                <section className="relative z-10 py-4">
                    <div className="container mx-auto px-6">
                        <Card className="glass-effect border-red-200 bg-red-50/80">
                            <CardContent className="p-4">
                                <p className="text-red-600 text-center">Error: {error}</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* Today's Coffee Plan */}
            <section className="relative z-10 py-8">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-display font-bold text-coffee-espresso mb-2">
                            Today's Coffee Plan
                        </h2>
                        <p className="text-coffee-brown">
                            Automatically generated sessions for {todaysPlan?.date || 'today'}
                        </p>
                    </div>

                    {todaysPlan?.coffeeMakerIds ? (
                        <div className="max-w-4xl mx-auto">
                            <Card className="glass-effect border-0 mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-coffee-espresso">
                                        <User className="w-5 h-5" />
                                        Today's Coffee Makers ({todaysPlan.date})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {todaysPlan.coffeeMakerIds.map(makerId => (
                                            <div
                                                key={makerId}
                                                className="p-3 rounded-lg bg-white/50 text-center"
                                            >
                                                <Coffee className="w-6 h-6 mx-auto mb-2 text-coffee-espresso" />
                                                <p className="text-sm font-medium text-coffee-espresso">
                                                    User ID: {makerId}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {todaysSessions.map((session, index) => (
                                    <ScheduleCard
                                        key={session.title}
                                        {...session}
                                        onJoin={() => handleJoinSession(session.title)}
                                        className={`fade-in-up stagger-${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        !error && (
                            <Card className="glass-effect border-0 max-w-2xl mx-auto">
                                <CardContent className="p-8 text-center">
                                    <Coffee className="w-16 h-16 mx-auto mb-4 text-coffee-brown/50" />
                                    <p className="text-coffee-brown text-lg">
                                        No plan found for today. Please generate a weekly plan first.
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 py-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                        <StatsCard
                            title="Active Members"
                            value="248"
                            icon={Users}
                            trend="+12% this week"
                            className="fade-in-up stagger-1"
                        />
                        <StatsCard
                            title="Coffee Sessions"
                            value="156"
                            icon={Coffee}
                            trend="+8 this week"
                            className="fade-in-up stagger-2"
                        />
                        <StatsCard
                            title="Cups Shared"
                            value="1,247"
                            icon={TrendingUp}
                            trend="+23% this month"
                            className="fade-in-up stagger-3"
                        />
                    </div>
                </div>
            </section>

            {/* Weekly Schedule */}
            <section className="relative z-10 py-8">
                <div className="container mx-auto px-6">
                    <WeeklySchedule
                        schedule={weeklySchedule}
                        onJoinSession={handleJoinSession}
                    />
                </div>
            </section>
        </div>
    );
};

export default Index;
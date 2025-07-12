
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, Calendar, TrendingUp, LogOut, Clock, User, Settings, Crown, Wallet } from 'lucide-react';
import CoffeeIcon from '@/components/CoffeeIcon';
import CoffeeBackground from '@/components/CoffeeBackground';
import AuthPage from '@/components/AuthPage';
import AdminPage from '@/components/AdminPage';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';
import type { FrontendUser, Session, User as ApiUser } from '@/types/api';

const Index = () => {
    const [user, setUser] = useState<FrontendUser | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeUsers, setActiveUsers] = useState<ApiUser[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showPlanSelection, setShowPlanSelection] = useState(false);
    const [showAdminPage, setShowAdminPage] = useState(false);
    const { toast } = useToast();

    // Fetch active sessions
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await api.getActiveSessions();
                setSessions(response.data);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to fetch sessions');
                console.error("Could not fetch sessions:", e);
            }
        };

        if (user) {
            fetchSessions();
        }
    }, [user]);

    // Fetch active users
    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                const response = await api.getActiveUsers();
                setActiveUsers(response.data);
            } catch (e) {
                console.error("Could not fetch active users:", e);
            }
        };

        if (user) {
            fetchActiveUsers();
        }
    }, [user]);

    // Helper function to get user name by ID
    const getUserNameById = (userId: string) => {
        const user = activeUsers.find(u => u.id === userId);
        return user ? user.name : `User ${userId.slice(0, 8)}...`;
    };

    const handleAuth = (userData: FrontendUser) => {
        setUser(userData);
        // Show plan selection after registration
        if (!userData.plan) {
            setShowPlanSelection(true);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setSessions([]);
        setActiveUsers([]);
        setError(null);
        setShowSettings(false);
        setShowPlanSelection(false);
        toast({
            title: "Logged out",
            description: "You've been successfully logged out.",
        });
    };

    const handleJoinSession = async (sessionId: string) => {
        if (!user) return;
        
        try {
            const response = await api.joinSession(sessionId, user.id || '');
            setSessions(prev => prev.map(s => s.id === sessionId ? response.data : s));
            toast({
                title: "Session Joined!",
                description: "You've successfully joined the coffee session. See you there! ☕",
            });
        } catch (e: any) {
            toast({
                title: "Join Failed",
                description: e.response?.data?.message || "Failed to join session",
                variant: "destructive"
            });
        }
    };

    const handleLeaveSession = async (sessionId: string) => {
        if (!user) return;
        
        try {
            const response = await api.leaveSession(sessionId, user.id || '');
            setSessions(prev => prev.map(s => s.id === sessionId ? response.data : s));
            toast({
                title: "Session Left",
                description: "You've left the coffee session.",
            });
        } catch (e: any) {
            toast({
                title: "Leave Failed",
                description: e.response?.data?.message || "Failed to leave session",
                variant: "destructive"
            });
        }
    };

    const handleCompleteSession = async (sessionId: string) => {
        try {
            const response = await api.completeSession(sessionId);
            setSessions(prev => prev.map(s => s.id === sessionId ? response.data : s));
            toast({
                title: "Session Completed!",
                description: "The coffee session has been completed. Don't forget to clean the Moka Pot!",
            });
        } catch (e: any) {
            toast({
                title: "Completion Failed",
                description: e.response?.data?.message || "Failed to complete session",
                variant: "destructive"
            });
        }
    };

    const handlePlanSelection = (planType: string) => {
        setUser(prev => prev ? { ...prev, plan: planType as 'free' | 'daily' | 'weekly' } : null);
        setShowPlanSelection(false);
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
    if (showPlanSelection) {
        const subscriptionPlans = [
            {
                title: "Free Plan",
                description: "Perfect for casual coffee lovers",
                price: "0",
                features: [
                    "Access to 2 sessions per month",
                    "Basic coffee varieties",
                    "Community chat access",
                    "Weekly newsletter"
                ]
            },
            {
                title: "Weekly Plan",
                description: "Balanced approach for regular coffee lovers",
                price: "90,000",
                features: [
                    "Up to 8 sessions per month",
                    "Good variety of coffee types",
                    "Group discounts",
                    "Monthly coffee samples",
                    "Brewing workshops"
                ]
            },
            {
                title: "Daily Plan",
                description: "For the dedicated coffee enthusiast",
                price: "190,000",
                features: [
                    "Access to both daily sessions (morning & evening)",
                    "Premium coffee selections",
                    "Priority booking",
                    "Exclusive tastings",
                    "Personal coffee journal",
                    "Expert brewing tips"
                ],
                isPopular: true
            }
        ];

        return (
            <div className="min-h-screen relative">
                <CoffeeBackground />

                <div className="relative z-10 pt-8 pb-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-6">
                                <CoffeeIcon size={100} className="float-animation" />
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-coffee-espresso mb-4">
                                Choose Your Coffee Journey
                            </h1>

                            <p className="text-lg sm:text-xl text-coffee-brown mb-8 max-w-3xl mx-auto">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                            {subscriptionPlans.map((plan, index) => (
                                <Card
                                    key={plan.title}
                                    className={`relative hover:shadow-xl transition-all duration-300 border-2 ${
                                        plan.isPopular
                                            ? 'border-primary coffee-gradient text-white scale-105'
                                            : 'border-coffee-light/30 glass-effect hover:border-primary/50'
                                    } fade-in-up stagger-${index + 1}`}
                                >
                                    {plan.isPopular && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary border-primary">
                                            Most Popular
                                        </Badge>
                                    )}

                                    <CardHeader className="text-center pb-4">
                                        <CardTitle className={`text-2xl font-display ${
                                            plan.isPopular ? 'text-white' : 'text-coffee-espresso'
                                        }`}>
                                            {plan.title}
                                        </CardTitle>
                                        <p className={`text-sm ${
                                            plan.isPopular ? 'text-white/90' : 'text-coffee-brown'
                                        }`}>
                                            {plan.description}
                                        </p>
                                        <div className="pt-4">
                                            <span className={`text-4xl font-bold ${
                                                plan.isPopular ? 'text-white' : 'text-coffee-espresso'
                                            }`}>
                                                {plan.price}
                                            </span>
                                            <span className={`text-sm ${
                                                plan.isPopular ? 'text-white/80' : 'text-coffee-brown'
                                            }`}>
                                                Toman
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        plan.isPopular ? 'bg-white' : 'bg-primary'
                                                    }`} />
                                                    <span className={`text-sm ${
                                                        plan.isPopular ? 'text-white/90' : 'text-coffee-brown'
                                                    }`}>
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            onClick={() => handlePlanSelection(plan.title.toLowerCase().replace(' plan', ''))}
                                            className={`w-full transition-all duration-300 ${
                                                plan.isPopular
                                                    ? 'bg-white text-primary hover:bg-gray-100'
                                                    : 'coffee-gradient hover:opacity-90 text-white'
                                            }`}
                                        >
                                            Choose {plan.title}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show settings page if requested
    if (showSettings) {
        return (
            <div className="min-h-screen relative">
                <CoffeeBackground />
                <div className="relative z-10 pt-8 pb-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-display font-bold text-coffee-espresso mb-4">
                                User Settings
                            </h1>
                            <Button
                                variant="outline"
                                onClick={() => setShowSettings(false)}
                                className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
                            >
                                ← Back to Dashboard
                            </Button>
                        </div>
                        
                        <Card className="glass-effect border-0 max-w-2xl mx-auto">
                            <CardHeader>
                                <CardTitle className="text-coffee-espresso">Account Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-coffee-espresso">Email</p>
                                        <p className="text-coffee-brown">{user.email}</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Change Email
                                    </Button>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-coffee-espresso">Wallet Balance</p>
                                        <p className="text-coffee-brown">{user.walletBalance || 0} Toman</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Wallet className="w-4 h-4 mr-2" />
                                        Charge Wallet
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Show admin page if requested
    if (showAdminPage) {
        return <AdminPage user={user} onBack={() => setShowAdminPage(false)} />;
    }

    // Main dashboard
    return (
        <div className="min-h-screen relative">
            <CoffeeBackground />

            {/* Header Section */}
            <header className="relative z-10 pt-8 pb-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <CoffeeIcon size={60} />
                            <div>
                                <h1 className="text-xl sm:text-2xl font-display font-bold text-coffee-espresso">
                                    Welcome back, {user.name}!
                                </h1>
                                <p className="text-coffee-brown">
                                    {user.isAdmin ? 'Admin' : 'Coffee Enthusiast'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                            {user.isAdmin && (
                                <Badge variant="secondary" className="px-3 py-1 bg-yellow-100 text-yellow-800 border-0">
                                    <Crown className="w-4 h-4 mr-1" />
                                    Admin
                                </Badge>
                            )}
                            
                            {user.isAdmin && (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAdminPage(true)}
                                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                                >
                                    <Crown className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Admin Panel</span>
                                </Button>
                            )}
                            
                            <Button
                                variant="outline"
                                onClick={() => setShowSettings(true)}
                                className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Settings</span>
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>

                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-coffee-espresso mb-4">
                            Coffee Club Sessions
                        </h2>

                        <p className="text-base sm:text-lg text-coffee-brown mb-6">
                            Join coffee sessions and experience the art of Moka Pot brewing with fellow enthusiasts.
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
                            <Badge variant="secondary" className="px-3 sm:px-4 py-2 text-sm bg-coffee-light/20 text-coffee-espresso border-0">
                                <Coffee className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Moka Pot Sessions</span>
                                <span className="sm:hidden">Sessions</span>
                            </Badge>
                            <Badge variant="secondary" className="px-3 sm:px-4 py-2 text-sm bg-coffee-light/20 text-coffee-espresso border-0">
                                <Users className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Community Brewing</span>
                                <span className="sm:hidden">Community</span>
                            </Badge>
                            <Badge variant="secondary" className="px-3 sm:px-4 py-2 text-sm bg-coffee-light/20 text-coffee-espresso border-0">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Fair Rotation</span>
                                <span className="sm:hidden">Fair</span>
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tapsel Logo */}
            <div className="relative z-10 text-center mb-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="inline-block bg-white/80 rounded-lg px-4 sm:px-6 py-3">
                        <p className="text-coffee-espresso font-semibold text-base sm:text-lg">
                            ☕ Tapsel Coffee Club
                        </p>
                        <p className="text-coffee-brown text-xs sm:text-sm">
                            Floor 3, Tapsel Building, Tehran
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <section className="relative z-10 py-4">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <Card className="glass-effect border-red-200 bg-red-50/80">
                            <CardContent className="p-4">
                                <p className="text-red-600 text-center">Error: {error}</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* Active Sessions */}
            <section className="relative z-10 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-coffee-espresso mb-2">
                            Active Sessions
                        </h2>
                        <p className="text-coffee-brown">
                            Join a session to start brewing coffee with the community
                        </p>
                    </div>

                    {sessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
                            {sessions.map((session) => {
                                const isParticipant = user.id && session.participants.includes(user.id);
                                const isCoffeeMaker = user.id && session.coffeeMakers.includes(user.id);
                                
                                return (
                                    <Card key={session.id} className="glass-effect border-0 hover:shadow-xl transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-coffee-espresso text-lg">
                                                <Coffee className="w-5 h-5" />
                                                {session.title}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-coffee-brown">
                                                <Clock className="w-4 h-4" />
                                                {new Date(session.dateTime).toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-coffee-brown">
                                                <User className="w-4 h-4" />
                                                {session.participants.length}/{session.maxParticipants} participants
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="bg-white/50 p-3 rounded-lg">
                                                <p className="text-sm font-medium text-coffee-espresso mb-2">Coffee Makers:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {session.coffeeMakers.map(makerId => (
                                                        <Badge key={makerId} variant="secondary" className="text-xs">
                                                            {getUserNameById(makerId)}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {session.mokaPotCleaner && (
                                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                                    <p className="text-sm font-medium text-yellow-800 mb-1">
                                                        🧽 Moka Pot Cleaner:
                                                    </p>
                                                    <p className="text-sm text-yellow-700">
                                                        {getUserNameById(session.mokaPotCleaner)}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            <div className="flex gap-2">
                                                {!isParticipant ? (
                                                    <Button
                                                        onClick={() => handleJoinSession(session.id)}
                                                        className="flex-1 coffee-gradient hover:opacity-90 text-white"
                                                        disabled={session.participants.length >= session.maxParticipants}
                                                    >
                                                        Join Session
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleLeaveSession(session.id)}
                                                        variant="outline"
                                                        className="flex-1 border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
                                                    >
                                                        Leave Session
                                                    </Button>
                                                )}
                                                
                                                {user.isAdmin && (
                                                    <Button
                                                        onClick={() => handleCompleteSession(session.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                                    >
                                                        Complete
                                                    </Button>
                                                )}
                                            </div>
                                            
                                            {isCoffeeMaker && (
                                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                    <p className="text-sm font-medium text-blue-800">
                                                        ☕ You are assigned as a coffee maker for this session!
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="glass-effect border-0 max-w-2xl mx-auto">
                            <CardContent className="p-8 text-center">
                                <Coffee className="w-16 h-16 mx-auto mb-4 text-coffee-brown/50" />
                                <p className="text-coffee-brown text-lg mb-4">
                                    No active sessions available. Check back later!
                                </p>
                                {user.isAdmin && (
                                    <Button
                                        onClick={() => setShowAdminPage(true)}
                                        className="coffee-gradient hover:opacity-90 text-white"
                                    >
                                        <Coffee className="w-4 h-4 mr-2" />
                                        Create New Session
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12">
                        <Card className="glass-effect border-0">
                            <CardContent className="p-4 sm:p-6 text-center">
                                <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-coffee-espresso" />
                                <p className="text-xl sm:text-2xl font-bold text-coffee-espresso">{activeUsers.length}</p>
                                <p className="text-coffee-brown text-sm sm:text-base">Active Members</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="glass-effect border-0">
                            <CardContent className="p-4 sm:p-6 text-center">
                                <Coffee className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-coffee-espresso" />
                                <p className="text-xl sm:text-2xl font-bold text-coffee-espresso">{sessions.length}</p>
                                <p className="text-coffee-brown text-sm sm:text-base">Active Sessions</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="glass-effect border-0">
                            <CardContent className="p-4 sm:p-6 text-center">
                                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-coffee-espresso" />
                                <p className="text-xl sm:text-2xl font-bold text-coffee-espresso">
                                    {sessions.reduce((total, session) => total + session.participants.length, 0)}
                                </p>
                                <p className="text-coffee-brown text-sm sm:text-base">Total Participants</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Index;
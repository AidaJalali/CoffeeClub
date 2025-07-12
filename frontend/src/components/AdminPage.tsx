import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Coffee, Users, Calendar, Clock, MapPin, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import CoffeeIcon from '@/components/CoffeeIcon';
import CoffeeBackground from '@/components/CoffeeBackground';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import type { FrontendUser, Session, CreateSessionRequest } from '@/types/api';

interface AdminPageProps {
    user: FrontendUser;
    onBack: () => void;
}

const AdminPage = ({ user, onBack }: AdminPageProps) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        dateTime: '',
        location: 'Floor 3, Tapsel Building, Tehran'
    });
    const { toast } = useToast();

    // Fetch all sessions
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await api.getAllSessions();
                setSessions(response.data);
            } catch (e) {
                console.error("Could not fetch sessions:", e);
                toast({
                    title: "Error",
                    description: "Failed to fetch sessions",
                    variant: "destructive"
                });
            }
        };

        fetchSessions();
    }, [toast]);

    const handleCreateSession = async () => {
        if (!formData.title || !formData.dateTime) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            const sessionData: CreateSessionRequest = {
                title: formData.title,
                dateTime: new Date(formData.dateTime).toISOString(),
                location: formData.location
            };

            const response = await api.createSession(sessionData);
            setSessions(prev => [response.data, ...prev]);
            setShowCreateModal(false);
            setFormData({ title: '', dateTime: '', location: 'Floor 3, Tapsel Building, Tehran' });
            
            toast({
                title: "Session Created!",
                description: "New coffee session has been created successfully.",
            });
        } catch (e: any) {
            toast({
                title: "Creation Failed",
                description: e.response?.data?.message || "Failed to create session",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteSession = async (sessionId: string) => {
        try {
            const response = await api.completeSession(sessionId);
            setSessions(prev => prev.map(s => s.id === sessionId ? response.data : s));
            toast({
                title: "Session Completed!",
                description: "The coffee session has been completed.",
            });
        } catch (e: any) {
            toast({
                title: "Completion Failed",
                description: e.response?.data?.message || "Failed to complete session",
                variant: "destructive"
            });
        }
    };

    const getNextWeekDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const quickCreateSessions = async () => {
        setIsLoading(true);
        const weekDates = getNextWeekDates();
        const createdSessions = [];

        try {
            for (let i = 0; i < weekDates.length; i++) {
                const date = weekDates[i];
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                
                // Morning session (9:00 AM)
                const morningDate = new Date(date);
                morningDate.setHours(9, 0, 0, 0);
                
                const morningSession: CreateSessionRequest = {
                    title: `Morning Coffee Session - ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
                    dateTime: morningDate.toISOString(),
                    location: 'Floor 3, Tapsel Building, Tehran'
                };

                try {
                    const response = await api.createSession(morningSession);
                    createdSessions.push(response.data);
                } catch (e) {
                    console.error(`Failed to create morning session for ${date.toDateString()}:`, e);
                }

                // Evening session (5:00 PM) - only on weekdays
                if (!isWeekend) {
                    const eveningDate = new Date(date);
                    eveningDate.setHours(17, 0, 0, 0);
                    
                    const eveningSession: CreateSessionRequest = {
                        title: `Evening Coffee Session - ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
                        dateTime: eveningDate.toISOString(),
                        location: 'Floor 3, Tapsel Building, Tehran'
                    };

                    try {
                        const response = await api.createSession(eveningSession);
                        createdSessions.push(response.data);
                    } catch (e) {
                        console.error(`Failed to create evening session for ${date.toDateString()}:`, e);
                    }
                }
            }

            setSessions(prev => [...createdSessions, ...prev]);
            toast({
                title: "Weekly Sessions Created!",
                description: `Successfully created ${createdSessions.length} sessions for the week.`,
            });
        } catch (e) {
            toast({
                title: "Creation Failed",
                description: "Failed to create weekly sessions",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative">
            <CoffeeBackground />

            <div className="relative z-10 pt-8 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={onBack}
                                className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                            <CoffeeIcon size={50} />
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-display font-bold text-coffee-espresso">
                                    Admin Dashboard
                                </h1>
                                <p className="text-coffee-brown">
                                    Manage coffee sessions and community
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                                <DialogTrigger asChild>
                                    <Button className="coffee-gradient hover:opacity-90 text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Session
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Create New Coffee Session</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="title">Session Title</Label>
                                            <Input
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="e.g., Morning Coffee Session"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="datetime">Date & Time</Label>
                                            <Input
                                                id="datetime"
                                                type="datetime-local"
                                                value={formData.dateTime}
                                                onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={formData.location}
                                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                                placeholder="Floor 3, Tapsel Building, Tehran"
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-4">
                                            <Button
                                                onClick={handleCreateSession}
                                                disabled={isLoading}
                                                className="flex-1 coffee-gradient hover:opacity-90 text-white"
                                            >
                                                {isLoading ? 'Creating...' : 'Create Session'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowCreateModal(false)}
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button
                                onClick={quickCreateSessions}
                                disabled={isLoading}
                                variant="outline"
                                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Create Week
                            </Button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <Card className="glass-effect border-0 mb-8">
                        <CardHeader>
                            <CardTitle className="text-coffee-espresso">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white/50 rounded-lg">
                                    <Coffee className="w-8 h-8 mx-auto mb-2 text-coffee-espresso" />
                                    <p className="font-medium text-coffee-espresso">{sessions.filter(s => s.isActive).length}</p>
                                    <p className="text-sm text-coffee-brown">Active Sessions</p>
                                </div>
                                <div className="text-center p-4 bg-white/50 rounded-lg">
                                    <Users className="w-8 h-8 mx-auto mb-2 text-coffee-espresso" />
                                    <p className="font-medium text-coffee-espresso">
                                        {sessions.reduce((total, session) => total + session.participants.length, 0)}
                                    </p>
                                    <p className="text-sm text-coffee-brown">Total Participants</p>
                                </div>
                                <div className="text-center p-4 bg-white/50 rounded-lg">
                                    <Calendar className="w-8 h-8 mx-auto mb-2 text-coffee-espresso" />
                                    <p className="font-medium text-coffee-espresso">
                                        {sessions.filter(s => new Date(s.dateTime) > new Date()).length}
                                    </p>
                                    <p className="text-sm text-coffee-brown">Upcoming Sessions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sessions List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl sm:text-2xl font-display font-bold text-coffee-espresso">
                                All Sessions
                            </h2>
                            <Badge variant="secondary" className="px-3 py-1 bg-coffee-light/20 text-coffee-espresso border-0">
                                {sessions.length} Total
                            </Badge>
                        </div>

                        {sessions.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {sessions.map((session) => (
                                    <Card key={session.id} className="glass-effect border-0 hover:shadow-xl transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="flex items-center gap-2 text-coffee-espresso text-lg">
                                                        <Coffee className="w-5 h-5" />
                                                        {session.title}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 text-sm text-coffee-brown mt-2">
                                                        <Clock className="w-4 h-4" />
                                                        {new Date(session.dateTime).toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-coffee-brown">
                                                        <MapPin className="w-4 h-4" />
                                                        {session.location}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Badge 
                                                        variant={session.isActive ? "default" : "secondary"}
                                                        className={session.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                                                    >
                                                        {session.isActive ? 'Active' : 'Completed'}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {session.participants.length}/{session.maxParticipants}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="bg-white/50 p-3 rounded-lg">
                                                <p className="text-sm font-medium text-coffee-espresso mb-2">Participants:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {session.participants.length > 0 ? (
                                                        session.participants.map(participantId => (
                                                            <Badge key={participantId} variant="secondary" className="text-xs">
                                                                User {participantId.slice(0, 8)}...
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-coffee-brown">No participants yet</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                {session.isActive && (
                                                    <Button
                                                        onClick={() => handleCompleteSession(session.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                                    >
                                                        Complete Session
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="glass-effect border-0">
                                <CardContent className="p-8 text-center">
                                    <Coffee className="w-16 h-16 mx-auto mb-4 text-coffee-brown/50" />
                                    <p className="text-coffee-brown text-lg mb-4">
                                        No sessions created yet. Create your first coffee session!
                                    </p>
                                    <Button
                                        onClick={() => setShowCreateModal(true)}
                                        className="coffee-gradient hover:opacity-90 text-white"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create First Session
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage; 
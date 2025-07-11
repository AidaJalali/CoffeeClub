
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoffeeIcon from '@/components/CoffeeIcon';
import CoffeeBackground from '@/components/CoffeeBackground';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import type { FrontendUser } from '@/types/api';

interface AuthPageProps {
    onAuth: (user: FrontendUser) => void;
}

const AuthPage = ({ onAuth }: AuthPageProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        if (!email.trim()) {
            setLoginError('Email is required');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Attempting login with email:', email);
            const response = await api.loginUser({ email });
            console.log('Login response:', response.data);
            
            const userData: FrontendUser = {
                email: response.data.email,
                name: response.data.name,
                isActive: response.data.isActive
            };
            
            onAuth(userData);
            toast({
                title: "Welcome back!",
                description: "You've successfully logged in to Coffee Club.",
            });
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.status === 401 ? 'Invalid email or user not found' :
                                error.message || 'Login failed. Please try again.';
            setLoginError(errorMessage);
            toast({
                title: "Login failed",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setRegisterError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const name = formData.get('name') as string;

        if (!email.trim() || !name.trim()) {
            setRegisterError('Name and email are required');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Attempting registration with:', { name, email });
            const response = await api.registerUser({ name, email });
            console.log('Registration response:', response.data);
            
            const userData: FrontendUser = {
                email: response.data.email,
                name: response.data.name,
                isActive: response.data.isActive
            };
            
            onAuth(userData);
            toast({
                title: "Account created!",
                description: "Welcome to Coffee Club! Your account has been created successfully.",
            });
        } catch (error: any) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 
                                error.message || 'Registration failed. Please try again.';
            setRegisterError(errorMessage);
            toast({
                title: "Registration failed",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6">
            <CoffeeBackground />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <CoffeeIcon size={80} className="mx-auto mb-4" />
                    <h1 className="text-3xl font-display font-bold text-coffee-espresso mb-2">
                        Coffee Club Scheduler
                    </h1>
                    <p className="text-coffee-brown">
                        Join fellow coffee enthusiasts for amazing brewing experiences
                    </p>
                </div>

                <Card className="glass-effect border-0">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-coffee-espresso">Welcome</CardTitle>
                        <CardDescription>
                            Sign in to your account or create a new one
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <Input
                                            id="login-email"
                                            name="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {loginError && (
                                        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                                            {loginError}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full coffee-gradient hover:opacity-90"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="register-name">Full Name</Label>
                                        <Input
                                            id="register-name"
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-email">Email</Label>
                                        <Input
                                            id="register-email"
                                            name="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {registerError && (
                                        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                                            {registerError}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full coffee-gradient hover:opacity-90"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Creating account...' : 'Create Account'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AuthPage;
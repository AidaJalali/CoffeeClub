
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coffee, Crown } from 'lucide-react';
import CoffeeIcon from '@/components/CoffeeIcon';
import CoffeeBackground from '@/components/CoffeeBackground';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import AdminCreationPage from './AdminCreationPage';
import type { FrontendUser } from '@/types/api';

interface AuthPageProps {
    onAuth: (user: FrontendUser) => void;
}

const AuthPage = ({ onAuth }: AuthPageProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [showAdminCreation, setShowAdminCreation] = useState(false);
    const { toast } = useToast();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (showAdminCreation) {
        return <AdminCreationPage onBack={() => setShowAdminCreation(false)} />;
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email.trim() || !password.trim()) {
            setLoginError('Email and password are required');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Attempting login with email:', email);
            const response = await api.loginUser({ email, password });
            console.log('Login response:', JSON.stringify(response.data, null, 2));
            
            const userData: FrontendUser = {
                id: response.data.id,
                email: response.data.email,
                name: response.data.name,
                isActive: response.data.isActive,
                isAdmin: response.data.isAdmin || false
            };
            
            onAuth(userData);
            toast({
                title: "Welcome back!",
                description: "You've successfully logged in to Coffee Club.",
            });
        } catch (error: any) {
            console.error('Login error:', error);
            
            let errorMessage = 'Login failed. Please try again.';
            
            if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Network error: Cannot connect to server. Please check if the backend is running.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout: Server is not responding. Please try again.';
            } else if (error.response?.status === 0) {
                errorMessage = 'CORS error: Cross-origin request blocked. Please check server configuration.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Invalid email or password.';
            } else if (error.response?.status === 400) {
                errorMessage = 'Invalid data: Please check your input and try again.';
            } else if (error.response?.status >= 500) {
                errorMessage = 'Server error: Please try again later.';
            }
            
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
        const password = formData.get('password') as string;

        if (!email.trim() || !name.trim() || !password.trim()) {
            setRegisterError('Name, email, and password are required');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setRegisterError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Attempting registration with:', JSON.stringify({ name, email, password: '***' }, null, 2));
            const response = await api.registerUser({ name, email, password });
            console.log('Registration response:', JSON.stringify(response.data, null, 2));
            
            const userData: FrontendUser = {
                id: response.data.id,
                email: response.data.email,
                name: response.data.name,
                isActive: response.data.isActive,
                isAdmin: response.data.isAdmin || false
            };
            
            onAuth(userData);
            toast({
                title: "Account created!",
                description: "Welcome to Coffee Club! Your account has been created successfully.",
            });
        } catch (error: any) {
            console.error('Registration error:', error);
            
            let errorMessage = 'Registration failed. Please try again.';
            
            if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Network error: Cannot connect to server. Please check if the backend is running.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout: Server is not responding. Please try again.';
            } else if (error.response?.status === 0) {
                errorMessage = 'CORS error: Cross-origin request blocked. Please check server configuration.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 400) {
                errorMessage = 'Invalid data: Please check your input and try again.';
            } else if (error.response?.status === 409) {
                errorMessage = 'User already exists with this email.';
            } else if (error.response?.status >= 500) {
                errorMessage = 'Server error: Please try again later.';
            }
            
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
        <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6">
            <CoffeeBackground />

            <div className="relative z-10 w-full max-w-md mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                    <CoffeeIcon size={80} className="mx-auto mb-4" />
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-coffee-espresso mb-2">
                        Coffee Club Scheduler
                    </h1>
                    <p className="text-coffee-brown text-sm sm:text-base">
                        Join fellow coffee enthusiasts for amazing brewing experiences
                    </p>
                </div>

                <Card className="glass-effect border-0 shadow-lg">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-coffee-espresso">Welcome</CardTitle>
                        <CardDescription>
                            Sign in to your account or create a new one
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-4 sm:px-6">
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
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Password</Label>
                                        <Input
                                            id="login-password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            disabled={isLoading}
                                            className="w-full"
                                        />
                                    </div>

                                    {loginError && (
                                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                                            {loginError}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full coffee-gradient hover:opacity-90 transition-opacity"
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
                                            className="w-full"
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
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-password">Password</Label>
                                        <Input
                                            id="register-password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            disabled={isLoading}
                                            className="w-full"
                                        />
                                    </div>

                                    {registerError && (
                                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                                            {registerError}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full coffee-gradient hover:opacity-90 transition-opacity"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Creating account...' : 'Create Account'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <button
                        onClick={() => setShowAdminCreation(true)}
                        className="text-sm text-coffee-brown hover:text-coffee-espresso transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <Crown className="w-4 h-4" />
                        Create Admin User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
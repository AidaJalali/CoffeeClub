
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoffeeIcon from '@/components/CoffeeIcon';
import CoffeeBackground from '@/components/CoffeeBackground';
import { useToast } from '@/hooks/use-toast';

interface AuthPageProps {
    onAuth: (user: { email: string; name: string }) => void;
}

const AuthPage = ({ onAuth }: AuthPageProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Simulate API call
        setTimeout(() => {
            if (email && password) {
                onAuth({ email, name: email.split('@')[0] });
                toast({
                    title: "Welcome back!",
                    description: "You've successfully logged in to Coffee Club.",
                });
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;

        // Simulate API call
        setTimeout(() => {
            if (email && password && name) {
                onAuth({ email, name });
                toast({
                    title: "Account created!",
                    description: "Welcome to Coffee Club! Your account has been created successfully.",
                });
            }
            setIsLoading(false);
        }, 1000);
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
                                        />
                                    </div>

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
                                        />
                                    </div>

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
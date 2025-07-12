import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coffee, Crown, ArrowLeft } from 'lucide-react';
import CoffeeIcon from '@/components/CoffeeIcon';
import CoffeeBackground from '@/components/CoffeeBackground';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import type { CreateUserRequest } from '@/types/api';

interface AdminCreationPageProps {
    onBack: () => void;
}

const AdminCreationPage = ({ onBack }: AdminCreationPageProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            toast({
                title: "Validation Error",
                description: "Please fill in all fields",
                variant: "destructive"
            });
            return;
        }

        if (formData.password.length < 6) {
            toast({
                title: "Validation Error",
                description: "Password must be at least 6 characters long",
                variant: "destructive"
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Validation Error",
                description: "Passwords do not match",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            const adminData: CreateUserRequest = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            await api.createAdminUser(adminData);
            
            toast({
                title: "Admin User Created!",
                description: "Admin user has been created successfully. You can now login with these credentials.",
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

        } catch (e: any) {
            toast({
                title: "Creation Failed",
                description: e.response?.data?.message || "Failed to create admin user",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative">
            <CoffeeBackground />

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Button
                            variant="outline"
                            onClick={onBack}
                            className="mb-4 border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Button>
                        
                        <div className="flex justify-center mb-6">
                            <CoffeeIcon size={80} className="float-animation" />
                        </div>

                        <h1 className="text-3xl font-display font-bold text-coffee-espresso mb-2">
                            Create Admin User
                        </h1>
                        <p className="text-coffee-brown">
                            Create the first admin user for Coffee Club
                        </p>
                    </div>

                    <Card className="glass-effect border-0">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2 text-coffee-espresso">
                                <Crown className="w-5 h-5" />
                                Admin Account Setup
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        placeholder="Enter password (min 6 characters)"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full coffee-gradient hover:opacity-90 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating Admin User...' : 'Create Admin User'}
                                </Button>
                            </form>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> This will create an admin user with full access to manage coffee sessions and the community.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminCreationPage; 
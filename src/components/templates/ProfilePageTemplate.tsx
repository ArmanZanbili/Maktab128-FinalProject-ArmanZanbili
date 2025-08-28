'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { getUserProfile } from '@/src/services/userService';
import { getOrdersByUser } from '@/src/services/orderService';
import { OrderHistory } from '../organisms/OrderHistory';
import { ProfileEditDialog } from '../organisms/ProfileEditDialog';
import { FaUserEdit } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { User } from '@/types/movie';

export function ProfilePageTemplate() {
    const { data: session, update: updateSession } = useSession();

    const [user, setUser] = React.useState<User | null>(null);

    const [orders, setOrders] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

    React.useEffect(() => {
        if (session?.user?.id) {
            const fetchData = async () => {
                try {
                    const [profileData, ordersData] = await Promise.all([
                        getUserProfile(session.user.id),
                        getOrdersByUser(session.user.id)
                    ]);
                    setUser(profileData.data.user);
                    setOrders(ordersData.data.orders);
                } catch (error) {
                    console.error("Failed to fetch profile data:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [session?.user?.id]);

    const handleProfileUpdate = (updatedUser: User) => {
        setUser(updatedUser);
        updateSession({
            ...session,
            user: {
                ...session?.user,
                address: updatedUser.address,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <div className="text-center py-10">Failed to load user profile.</div>;
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>
            <div className="space-y-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">{user.firstname} {user.lastname}</CardTitle>
                            <CardDescription>@{user.username}</CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                            <FaUserEdit className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong className="text-muted-foreground">Phone:</strong> {user.phoneNumber}</div>
                        <div><strong className="text-muted-foreground">Address:</strong> {user.address}</div>
                    </CardContent>
                </Card>

                <OrderHistory orders={orders} />
            </div>

            {isEditDialogOpen && (
                <ProfileEditDialog
                    user={user}
                    isOpen={isEditDialogOpen}
                    setIsOpen={setIsEditDialogOpen}
                    onProfileUpdate={handleProfileUpdate}
                />
            )}
        </div>
    );
}
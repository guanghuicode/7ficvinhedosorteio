import React, { useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ProgressTracker from '../components/features/ProgressTracker';
import { useAuth } from '../hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserData, registerUser } from '../services/userService';
import toast from 'react-hot-toast';
import QrScannerModal from '../components/features/QrScannerModal';
import { Timestamp } from 'firebase/firestore';

const UserLandingPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Sign in anonymously if not already signed in
  React.useEffect(() => {
    if (!authLoading && !user) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in failed", error);
        toast.error("Could not connect to the service. Please refresh.");
      });
    }
  }, [user, authLoading]);

  const { data, isLoading: dataLoading } = useQuery({
    queryKey: ['userData', user?.uid],
    queryFn: () => getUserData(user),
    enabled: !!user,
  });
  
  const registrationMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (_, { user, name, email }) => {
        toast.success("You're registered! Welcome to the event.");
        // Manually update the cache to ensure the UI updates instantly without waiting for a full refetch from Firestore
        queryClient.setQueryData(["userData", user?.uid], {
          profile: { name, email, createdAt: Timestamp.now(), eventId: import.meta.env.VITE_EVENT_ID },
          progress: { scannedCount: 0, requiredScans: 0 } // Assuming initial progress
        });
        // Invalidate queries to ensure consistency with the backend on subsequent fetches
        queryClient.invalidateQueries({ queryKey: ["userData", user?.uid] });
    },
    onError: (error) => {
        toast.error(`Registration failed: ${error.message}`);
    }
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
        registrationMutation.mutate({ user, name, email });
    }
  };

  const isLoading = authLoading || (!!user && dataLoading);

  return (
    <MainLayout>
      {isLoading ? <Spinner /> : (
        <>
          {user && data?.profile ? (
            <ProgressTracker profile={data.profile} progress={data.progress!} />
          ) : (
            <Card>
              <h2 className="text-2xl font-bold text-center mb-1">Join the Challenge!</h2>
              <p className="text-gray-600 text-center mb-6">Enter your details to start collecting stamps.</p>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <Button type="submit" isLoading={registrationMutation.isPending}>
                  Start Collecting
                </Button>
              </form>
            </Card>
          )}
        </>
      )}
      <QrScannerModal />
    </MainLayout>
  );
};

export default UserLandingPage;


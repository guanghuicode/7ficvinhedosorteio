import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';


const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAdmin();

    useEffect(() => {
        if (isAdmin) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [isAdmin, navigate]);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/admin/dashboard');
        } catch (error) {
            console.error("Admin login failed", error);
            toast.error("Login failed. Please try again.");
        }
    };

    return (
        <MainLayout>
            <Card>
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Admin Access</h2>
                    <p className="text-gray-600 mt-2">Please sign in to manage the event.</p>
                </div>
                <div className="mt-6">
                    <Button onClick={handleLogin}>
                      <LogIn className="mr-2" /> Sign In with Google
                    </Button>
                </div>
            </Card>
        </MainLayout>
    );
};

export default AdminLoginPage;


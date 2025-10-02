
import StandManager from '../components/features/StandManager';
import Button from '../components/ui/Button';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-secondary text-gray-800 flex flex-col items-center p-4">
      <header className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
        <Button onClick={handleSignOut} variant="secondary" className="w-auto">
          Sign Out
        </Button>
      </header>
      <main className="w-full max-w-4xl">
        <StandManager />
      </main>
    </div>
  );
};

export default AdminDashboardPage;


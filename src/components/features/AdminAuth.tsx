import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import Spinner from '../ui/Spinner';

const AdminAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminAuth;


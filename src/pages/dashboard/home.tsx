import { useEffect } from 'react';
import Datatable from '@/components/dashboard/datatable';
import Indicateurs from '@/components/dashboard/indicateurs';
import ChangePasswordModal from '@/components/modal/ChangePasswordModal';
import { bonAPayers, dashboardStats } from '@/data/bon-a-payers';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';

function DashboardHomePage() {
  //const tokens = localStorage.getItem('authToken');
  const navige = useNavigate();

  const {
    user,
    showChangePasswordModal,
    setShowChangePasswordModal,
    passwordModalShown,
    setPasswordModalShown,
  } = useAuthStore();

  useEffect(() => {
    //alert(tokens)
    if (!user?.token) {
      navige('/'); // Redirigez vers la page de connexion
      return;
    }
    //alert(user?.token)
    if (!user || passwordModalShown) return;

    const statusNumber = Number((user.status || '').trim());

    if (statusNumber === 300) {
      setShowChangePasswordModal(true);
      setPasswordModalShown(true);
    } else {
      // setShowChangePasswordModal(false);
    }
  }, [
    user,
    setShowChangePasswordModal,
    passwordModalShown,
    setPasswordModalShown,
  ]);

  return (
    <div className='space-y-6'>
      <Indicateurs stats={dashboardStats} />
      <Datatable data={bonAPayers} />

      {showChangePasswordModal && <ChangePasswordModal />}
    </div>
  );
}

export default DashboardHomePage;

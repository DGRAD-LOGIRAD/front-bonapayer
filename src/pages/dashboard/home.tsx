import React, { useEffect } from 'react';
import Datatable from '@/components/dashboard/datatable';
import Indicateurs from '@/components/dashboard/indicateurs';
import ChangePasswordModal from '@/components/modal/ChangePasswordModal';
import { bonAPayers, dashboardStats } from '@/data/bon-a-payers';
import { useAuthStore } from '@/stores/useAuthStore';

function DashboardHomePage() {
  const {
    user,
    showChangePasswordModal,
    setShowChangePasswordModal,
    passwordModalShown,
    setPasswordModalShown,
  } = useAuthStore();

  useEffect(() => {
    if (!user || passwordModalShown) return;

    const statusNumber = Number((user.status || '').trim());

    if (statusNumber === 300) {
      setShowChangePasswordModal(true);
      setPasswordModalShown(true);
    } else {
      setShowChangePasswordModal(false);
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

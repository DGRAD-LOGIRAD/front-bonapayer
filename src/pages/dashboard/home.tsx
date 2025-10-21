import { useEffect } from 'react';
import Datatable from '@/components/dashboard/datatable';
import Indicateurs from '@/components/dashboard/indicateurs';
import ChangePasswordModal from '@/components/modal/ChangePasswordModal';
import TableSkeleton from '@/components/dashboard/table-skeleton';
import { useDashboardStats, useBonAPayerFractionnes } from '@/hooks/useBonAPayer';
import { useAuthStore } from '@/stores/useAuthStore';

function DashboardHomePage() {
  const {
    user,
    showChangePasswordModal,
    setShowChangePasswordModal,
    passwordModalShown,
    setPasswordModalShown,
  } = useAuthStore();

  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
    isError: statsIsError,
  } = useDashboardStats();

  const {
    data: bonAPayersFractionnes,
    isLoading: bonAPayersLoading,
    error: bonAPayersError,
    isError: bonAPayersIsError,
  } = useBonAPayerFractionnes();

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
      {statsLoading ? (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='h-32 bg-muted animate-pulse rounded-lg' />
          ))}
        </div>
      ) : statsIsError ? (
        <div className='text-center py-8 text-red-600'>
          <div className='text-lg'>Erreur lors du chargement des statistiques</div>
          <div className='text-sm mt-2'>{statsError?.message}</div>
        </div>
      ) : (
        dashboardStats && <Indicateurs stats={dashboardStats} />
      )}

      {bonAPayersLoading ? (
        <TableSkeleton />
      ) : bonAPayersIsError ? (
        <div className='text-center py-8 text-red-600'>
          <div className='text-lg'>Erreur lors du chargement des bons à payer</div>
          <div className='text-sm mt-2'>{bonAPayersError?.message}</div>
        </div>
      ) : (
        <Datatable
          data={bonAPayersFractionnes || []}
          title='Bons à payer fractionnés'
          description='Liste des bons à payer qui ont été fractionnés (état = 1)'
          ctaLabel='Voir tous les bons à payer'
          ctaHref='/dashboard/bon-a-payers'
        />
      )}

      {showChangePasswordModal && <ChangePasswordModal />}
    </div>
  );
}

export default DashboardHomePage;

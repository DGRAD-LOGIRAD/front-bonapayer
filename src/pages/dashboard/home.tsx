import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Indicateurs from '@/components/dashboard/indicateurs';
import { BonAPayerBarChart } from '@/components/dashboard/bar-chart';
import { BonAPayerLineChart } from '@/components/dashboard/line-chart';
import { BonAPayerAreaChart } from '@/components/dashboard/area-chart';
import { TopCentresChart } from '@/components/dashboard/top-centres-chart';
import { TopCentresByAmountChart } from '@/components/dashboard/top-centres-by-amount-chart';
import ChangePasswordModal from '@/components/modal/ChangePasswordModal';
import { Button } from '@/components/ui/button';
import { QueryStateWrapper } from '@/components/ui/query-state-wrapper';
import {
  useDashboardStats,
  useBonAPayerFractionnes,
} from '@/hooks/useBonAPayer';
import { useAuthStore } from '@/stores/useAuthStore';

const MemoizedIndicateurs = React.memo(Indicateurs);
const MemoizedBarChart = React.memo(BonAPayerBarChart);
const MemoizedLineChart = React.memo(BonAPayerLineChart);
const MemoizedAreaChart = React.memo(BonAPayerAreaChart);
const MemoizedTopCentresChart = React.memo(TopCentresChart);
const MemoizedTopCentresByAmountChart = React.memo(TopCentresByAmountChart);

function DashboardHomePage() {
  useEffect(() => {
    document.title = 'Tableau de bord - DGRAD';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Tableau de bord de gestion des bons à payer');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Tableau de bord de gestion des bons à payer';
      document.head.appendChild(meta);
    }
  }, []);

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
  } = useDashboardStats();

  const {
    data: bonAPayersFractionnes,
    isLoading: bonAPayersLoading,
    error: bonAPayersError,
  } = useBonAPayerFractionnes();

  useEffect(() => {
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
      <div className='flex justify-end'>
        <Button asChild className='gap-2'>
          <Link to='/dashboard/bon-a-payers/creer'>
            <Plus className='h-4 w-4' />
            Fractionner un bon à payer
          </Link>
        </Button>
      </div>

      <QueryStateWrapper
        loading={statsLoading}
        error={statsError || null}
        data={dashboardStats}
        skeleton={
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className='h-32 bg-muted animate-pulse rounded-lg'
              />
            ))}
          </div>
        }
        errorTitle='Erreur lors du chargement des statistiques'
      >
        {(stats) => <MemoizedIndicateurs stats={stats} />}
      </QueryStateWrapper>

      <div className='grid gap-4 md:grid-cols-2'>
        <QueryStateWrapper
          loading={bonAPayersLoading}
          error={bonAPayersError || null}
          data={bonAPayersFractionnes}
          skeleton={
            <div className='h-[400px] bg-muted animate-pulse rounded-lg' />
          }
          errorTitle='Erreur lors du chargement des bons à payer'
        >
          {(data) => <MemoizedBarChart data={data || []} devise='USD' />}
        </QueryStateWrapper>

        <QueryStateWrapper
          loading={bonAPayersLoading}
          error={bonAPayersError || null}
          data={bonAPayersFractionnes}
          skeleton={
            <div className='h-[400px] bg-muted animate-pulse rounded-lg' />
          }
          errorTitle='Erreur lors du chargement des bons à payer'
        >
          {(data) => <MemoizedBarChart data={data || []} devise='CDF' />}
        </QueryStateWrapper>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <QueryStateWrapper
          loading={bonAPayersLoading}
          error={bonAPayersError || null}
          data={bonAPayersFractionnes}
          skeleton={
            <div className='h-[400px] bg-muted animate-pulse rounded-lg' />
          }
          errorTitle='Erreur lors du chargement des bons à payer'
        >
          {(data) => <MemoizedLineChart data={data || []} />}
        </QueryStateWrapper>

        <QueryStateWrapper
          loading={bonAPayersLoading}
          error={bonAPayersError || null}
          data={bonAPayersFractionnes}
          skeleton={
            <div className='h-[400px] bg-muted animate-pulse rounded-lg' />
          }
          errorTitle='Erreur lors du chargement des bons à payer'
        >
          {(data) => <MemoizedAreaChart data={data || []} />}
        </QueryStateWrapper>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <QueryStateWrapper
          loading={bonAPayersLoading}
          error={bonAPayersError || null}
          data={bonAPayersFractionnes}
          skeleton={
            <div className='h-[400px] bg-muted animate-pulse rounded-lg' />
          }
          errorTitle='Erreur lors du chargement des bons à payer'
        >
          {(data) => <MemoizedTopCentresChart data={data || []} />}
        </QueryStateWrapper>

        <QueryStateWrapper
          loading={bonAPayersLoading}
          error={bonAPayersError || null}
          data={bonAPayersFractionnes}
          skeleton={
            <div className='h-[400px] bg-muted animate-pulse rounded-lg' />
          }
          errorTitle='Erreur lors du chargement des bons à payer'
        >
          {(data) => <MemoizedTopCentresByAmountChart data={data || []} />}
        </QueryStateWrapper>
      </div>

      {showChangePasswordModal && <ChangePasswordModal />}
    </div>
  );
}

export default DashboardHomePage;

import Datatable from '@/components/dashboard/datatable';
import Indicateurs from '@/components/dashboard/indicateurs';
import { bonAPayers, dashboardStats } from '@/data/bon-a-payers';

function DashboardHomePage() {
  return (
    <div className='space-y-6'>
      <Indicateurs stats={dashboardStats} />
      <Datatable data={bonAPayers} />
    </div>
  );
}

export default DashboardHomePage;

import DataTableUser from '@/components/dashboard/datatableuser';
import TabMenu from '@/components/menu/tabMenu';

function Utilisateurs() {
  return (
    <div className='space-y-6'>
      <TabMenu />
      {/*   //<DataTableUser data={bonAPayers.slice(0, 3)} />  */}
      <DataTableUser />
    </div>
  );
}

export default Utilisateurs;

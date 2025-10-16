import { Outlet } from 'react-router-dom';
import { Preloader } from '@/components/ui/preloader';

function App() {
  return (
    <>
      <Preloader />
      <Outlet />
    </>
  );
}

export default App;

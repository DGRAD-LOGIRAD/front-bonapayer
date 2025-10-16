import { Outlet } from 'react-router-dom';
import { Preloader } from '@/components/ui/preloader';
import { ErrorTest } from '@/components/ui/error-test';

function App() {
  return (
    <>
      <Preloader />
      <Outlet />
      <ErrorTest />
    </>
  );
}

export default App;

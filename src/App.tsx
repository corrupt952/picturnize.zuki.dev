import { CircularProgress } from '@mui/material';
import { Suspense } from 'react';
import { MainLayout } from './components/Layout';
import { Home } from './features/misc';

const App = () => {
  return (
    <MainLayout>
      <Suspense fallback={<CircularProgress />}>
        <Home />
      </Suspense>
    </MainLayout>
  );
}

export default App;

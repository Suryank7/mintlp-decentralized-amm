import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AMMProvider } from '@/contexts/AMMContext';
import { Toaster } from '@/components/ui/toaster';
import { WelcomeDialog } from '@/components/amm/WelcomeDialog';
import Header from '@/components/common/Header';
import routes from './routes';

const App = () => {
  return (
    <Router>
      <AMMProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster />
        <WelcomeDialog />
      </AMMProvider>
    </Router>
  );
};

export default App;

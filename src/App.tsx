import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FloatingChatbotButton } from './components/FloatingChatbotButton';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PageTransition } from './components/MotionPrimitives';
import { Navbar } from './components/Navbar';
import { FarmProvider } from './context/FarmContext';
import { LanguageProvider } from './context/LanguageContext';
import { useFarmDetails } from './hooks/useFarmDetails';
import { AIChatbot } from './pages/AIChatbot';
import { Dashboard } from './pages/Dashboard';
import { HistoricalAnalysis } from './pages/HistoricalAnalysis';
import { Home } from './pages/Home';
import { Reports } from './pages/Reports';

const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

const FloatingChatbotLauncher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAssistantMode } = useFarmDetails();

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab');

  // Hide on Home page and when user is already viewing the AI Chatbot workspace
  if (location.pathname === '/' || location.pathname === '/chatbot') {
    return null;
  }
  if (location.pathname === '/dashboard' && (!currentTab || currentTab === 'chatbot')) {
    return null;
  }

  const fromFinancialAssistance =
    location.pathname === '/dashboard' && currentTab === 'information';
  const showOnMobile = fromFinancialAssistance || location.pathname === '/reports';

  const handleClick = () => {
    setAssistantMode(fromFinancialAssistance ? 'financial_assistance' : 'general');
    navigate('/dashboard?tab=chatbot');
  };

  return (
    <FloatingChatbotButton
      fromFinancialAssistance={fromFinancialAssistance}
      desktopOnly={!showOnMobile}
      onClick={handleClick}
    />
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          }
        />
        <Route
          path="/chatbot"
          element={
            <PageTransition>
              <AIChatbot />
            </PageTransition>
          }
        />
        <Route
          path="/historical-analysis"
          element={
            <PageTransition>
              <HistoricalAnalysis />
            </PageTransition>
          }
        />
        <Route
          path="/reports"
          element={
            <PageTransition>
              <Reports />
            </PageTransition>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <LanguageProvider>
          <FarmProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="font-helvetica-neue min-h-screen bg-brand-cream text-brand-dark">
                {gmpQuotaExceeded && (
                  <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
                    <span>
                      Google Maps Platform quota reached. If you are the app owner, visit{' '}
                      <a
                        href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold text-amber-950 hover:text-amber-800"
                      >
                        maps developer site
                      </a>{' '}
                      for instructions to update your account.
                    </span>
                  </div>
                )}
                <Navbar />
                <AnimatedRoutes />
                <MobileBottomNav />
                <FloatingChatbotLauncher />
              </div>
            </BrowserRouter>
          </FarmProvider>
        </LanguageProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Activity, Calculator, Landmark, MapPin, MessageCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export const MobileBottomNav: React.FC = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Show only on app workspace routes, not on the marketing Home page
  if (pathname === '/') {
    return null;
  }

  const activeTab = new URLSearchParams(search).get('tab');

  const mobileLabels: Record<
    string,
    { chat: string; health: string; loss: string; schemes: string; farm: string }
  > = {
    en: { chat: 'Chat', health: 'Health', loss: 'Loss', schemes: 'Schemes', farm: 'Farm' },
    hi: { chat: 'चैट', health: 'स्वास्थ्य', loss: 'नुकसान', schemes: 'योजनाएं', farm: 'खेत' },
    mr: { chat: 'चॅट', health: 'आरोग्य', loss: 'नुकसान', schemes: 'योजना', farm: 'शेत' },
    kn: { chat: 'ಚಾಟ್', health: 'ಆರೋಗ್ಯ', loss: 'ನಷ್ಟ', schemes: 'ಯೋಜನೆ', farm: 'ಕೃಷಿ' },
  };
  const labels = mobileLabels[language] ?? mobileLabels.en;

  const items = [
    {
      id: 'chatbot',
      to: '/dashboard?tab=chatbot',
      label: labels.chat,
      icon: MessageCircle,
      active:
        (pathname === '/dashboard' && (!activeTab || activeTab === 'chatbot')) ||
        pathname === '/chatbot',
    },
    {
      id: 'crop-health',
      to: '/dashboard?tab=crop-health',
      label: labels.health,
      icon: Activity,
      active:
        (pathname === '/dashboard' && activeTab === 'crop-health') ||
        pathname === '/historical-analysis',
    },
    {
      id: 'loss-optimisation',
      to: '/dashboard?tab=loss-optimisation',
      label: labels.loss,
      icon: Calculator,
      active: pathname === '/dashboard' && activeTab === 'loss-optimisation',
    },
    {
      id: 'information',
      to: '/dashboard?tab=information',
      label: labels.schemes,
      icon: Landmark,
      active: pathname === '/dashboard' && activeTab === 'information',
    },
    {
      id: 'farm',
      to: '/dashboard?tab=farm',
      label: labels.farm,
      icon: MapPin,
      active: pathname === '/dashboard' && activeTab === 'farm',
    },
  ];

  return (
    <nav
      aria-label="Mobile workspace navigation"
      data-testid="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-brand-border/90 bg-brand-cream/96 backdrop-blur-md shadow-[0_-4px_20px_rgba(45,58,46,0.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 items-stretch h-[62px] px-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              data-testid={`mobile-nav-${item.id}`}
              aria-current={item.active ? 'page' : undefined}
              onClick={() => navigate(item.to)}
              className={`relative flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-[10px] transition-colors cursor-pointer min-w-0 ${
                item.active
                  ? 'text-brand-dark font-semibold'
                  : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              {item.active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[2.5px] rounded-full bg-brand-dark"
                  aria-hidden="true"
                />
              )}
              <span
                className={`flex items-center justify-center w-8 h-7 rounded-full transition-colors ${
                  item.active ? 'bg-[#E7EBDD] text-brand-dark' : ''
                }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
              </span>
              <span className="text-[10px] leading-tight truncate max-w-full px-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

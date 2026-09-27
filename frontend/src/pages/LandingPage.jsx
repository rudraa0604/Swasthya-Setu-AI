import React, { useState } from 'react';
import { 
  Activity, TrendingUp, AlertTriangle, Truck, Users, 
  Building, MapPin, Layers, Globe, Code
} from 'lucide-react';
import HeroScrollCanvas from '../components/HeroScrollCanvas';
import LandingNavbar from '../components/LandingNavbar';
import FeaturesGridSection from '../components/sections/landing/FeaturesGridSection';
import RolePortalsSection from '../components/sections/landing/RolePortalsSection';
import FooterSection from '../components/sections/landing/FooterSection';
import LandingFeaturesPage from './LandingFeaturesPage';
import LandingPortalsPage from './LandingPortalsPage';
import LandingArchitecturePage from './LandingArchitecturePage';
import LandingCreditsPage from './LandingCreditsPage';
import { translations } from '../services/i18n';

export default function LandingPage({ 
  onLaunchPortal, 
  onSelectRole, 
  lang, 
  setLang,
  initialLandingPage = 'home'
}) {
  const t = translations[lang] || translations.en;
  const [activeLandingPage, setActiveLandingPage] = useState(initialLandingPage || 'home'); // 'home', 'features', 'portals', 'architecture', 'credits'

  React.useEffect(() => {
    if (initialLandingPage) {
      setActiveLandingPage(initialLandingPage);
    }
  }, [initialLandingPage]);

  const features = [
    {
      title: t.featStockTitle,
      icon: Activity,
      color: '#ea580c',
      bg: 'rgba(234, 88, 12, 0.22)',
      desc: t.featStockDesc
    },
    {
      title: t.featForecastingTitle,
      icon: TrendingUp,
      color: '#16a34a',
      bg: 'rgba(22, 163, 74, 0.22)',
      desc: t.featForecastingDesc
    },
    {
      title: t.featAlertsTitle,
      icon: AlertTriangle,
      color: '#dc2626',
      bg: 'rgba(220, 38, 38, 0.22)',
      desc: t.featAlertsDesc
    },
    {
      title: t.featRedistributionTitle,
      icon: Truck,
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.22)',
      desc: t.featRedistributionDesc
    },
    {
      title: t.featCareTitle,
      icon: Users,
      color: '#16a34a',
      bg: 'rgba(22, 163, 74, 0.22)',
      desc: t.featCareDesc
    }
  ];

  const roleStations = [
    {
      roleId: 'phc',
      title: t.rolePhcTitle,
      subtitle: t.rolePhcSubtitle,
      icon: Building,
      color: '#ea580c',
      badge: t.rolePhcBadge,
      desc: t.rolePhcDesc
    },
    {
      roleId: 'district',
      title: t.roleDistrictTitle,
      subtitle: t.roleDistrictSubtitle,
      icon: MapPin,
      color: '#f97316',
      badge: t.roleDistrictBadge,
      desc: t.roleDistrictDesc
    },
    {
      roleId: 'state',
      title: t.roleStateTitle,
      subtitle: t.roleStateSubtitle,
      icon: Layers,
      color: '#16a34a',
      badge: t.roleStateBadge,
      desc: t.roleStateDesc
    },
    {
      roleId: 'national',
      title: t.roleNationalTitle,
      subtitle: t.roleNationalSubtitle,
      icon: Globe,
      color: '#dc2626',
      badge: t.roleNationalBadge,
      desc: t.roleNationalDesc
    },
    {
      roleId: 'developer',
      title: t.roleDevTitle,
      subtitle: t.roleDevSubtitle,
      icon: Code,
      color: '#ea580c',
      badge: t.roleDevBadge,
      desc: t.roleDevDesc
    }
  ];

  // Dedicated full-page views
  if (activeLandingPage === 'features') {
    return (
      <LandingFeaturesPage 
        onBackToHome={() => setActiveLandingPage('home')}
        onLaunchPortal={onLaunchPortal}
        onSelectRole={onSelectRole}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  if (activeLandingPage === 'portals') {
    return (
      <LandingPortalsPage 
        onBackToHome={() => setActiveLandingPage('home')}
        onLaunchPortal={onLaunchPortal}
        onSelectRole={onSelectRole}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  if (activeLandingPage === 'architecture') {
    return (
      <LandingArchitecturePage 
        onBackToHome={() => setActiveLandingPage('home')}
        onLaunchPortal={onLaunchPortal}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  if (activeLandingPage === 'credits') {
    return (
      <LandingCreditsPage 
        onBackToHome={() => setActiveLandingPage('home')}
        onLaunchPortal={onLaunchPortal}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  // Default Home Overview
  return (
    <div style={{ background: 'transparent', color: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      {/* Top Navbar with Multi-Page Navigation */}
      <LandingNavbar 
        onLaunchPortal={onLaunchPortal} 
        lang={lang} 
        setLang={setLang}
        onNavigatePage={(p) => setActiveLandingPage(p)}
        activePage={activeLandingPage}
      />

      {/* Hero Canvas View */}
      <HeroScrollCanvas onEnterPortal={onLaunchPortal} lang={lang} />

      {/* Section 1: Features Grid */}
      <FeaturesGridSection features={features} lang={lang} />

      {/* Section 2: Role Access Portals */}
      <RolePortalsSection 
        roleStations={roleStations} 
        onSelectRole={onSelectRole} 
        onLaunchPortal={onLaunchPortal} 
        lang={lang} 
      />

      {/* Section 3: Footer */}
      <FooterSection lang={lang} />
    </div>
  );
}

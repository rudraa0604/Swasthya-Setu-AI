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

export default function LandingPage({ onLaunchPortal, onSelectRole, lang, setLang }) {
  const t = translations[lang] || translations.en;
  const [activeLandingPage, setActiveLandingPage] = useState('home'); // 'home', 'features', 'portals', 'architecture', 'credits'

  const features = [
    {
      title: t.featStockTitle,
      icon: Activity,
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.25)',
      desc: t.featStockDesc
    },
    {
      title: t.featForecastingTitle,
      icon: TrendingUp,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.25)',
      desc: t.featForecastingDesc
    },
    {
      title: t.featAlertsTitle,
      icon: AlertTriangle,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.25)',
      desc: t.featAlertsDesc
    },
    {
      title: t.featRedistributionTitle,
      icon: Truck,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.25)',
      desc: t.featRedistributionDesc
    },
    {
      title: t.featCareTitle,
      icon: Users,
      color: '#2e8b57',
      bg: 'rgba(46, 139, 87, 0.25)',
      desc: t.featCareDesc
    }
  ];

  const roleStations = [
    {
      roleId: 'phc',
      title: t.rolePhcTitle,
      subtitle: t.rolePhcSubtitle,
      icon: Building,
      color: '#0284c7',
      badge: t.rolePhcBadge,
      desc: t.rolePhcDesc
    },
    {
      roleId: 'district',
      title: t.roleDistrictTitle,
      subtitle: t.roleDistrictSubtitle,
      icon: MapPin,
      color: '#f59e0b',
      badge: t.roleDistrictBadge,
      desc: t.roleDistrictDesc
    },
    {
      roleId: 'state',
      title: t.roleStateTitle,
      subtitle: t.roleStateSubtitle,
      icon: Layers,
      color: '#8b5cf6',
      badge: t.roleStateBadge,
      desc: t.roleStateDesc
    },
    {
      roleId: 'national',
      title: t.roleNationalTitle,
      subtitle: t.roleNationalSubtitle,
      icon: Globe,
      color: '#10b981',
      badge: t.roleNationalBadge,
      desc: t.roleNationalDesc
    },
    {
      roleId: 'developer',
      title: t.roleDevTitle,
      subtitle: t.roleDevSubtitle,
      icon: Code,
      color: '#38bdf8',
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

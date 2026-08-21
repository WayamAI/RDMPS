import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { initLenis, destroyLenis, scrollToId } from '@/lib/lenis';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const timer = setTimeout(() => scrollToId(id), 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-page">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isHome && <Footer />}
    </div>
  );
}

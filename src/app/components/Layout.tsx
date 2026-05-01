import { Outlet, Link, useLocation } from 'react-router';
import { Home, Pill, Users, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Toaster } from './ui/sonner';

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleEmergencyCall = () => {
    // In a real app, this would trigger a call
    const contact = localStorage.getItem('easymeds_emergency_contact');
    if (contact) {
      try {
        const parsedContact = JSON.parse(contact);
        if (parsedContact && parsedContact.phone) {
          window.location.href = `tel:${parsedContact.phone}`;
        } else {
          alert('Please set up an emergency contact in the Caregiver tab');
        }
      } catch (error) {
        alert('Please set up an emergency contact in the Caregiver tab');
      }
    } else {
      alert('Please set up an emergency contact in the Caregiver tab');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">EasyMeds</h1>
          <Button
            onClick={handleEmergencyCall}
            variant="destructive"
            size="lg"
            className="h-14 px-4 text-lg gap-2"
          >
            <Phone className="h-6 w-6" />
            <span className="hidden xs:inline">Emergency</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full p-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation - Fixed */}
      <nav className="bg-card border-t-4 border-border shadow-lg fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-1 p-2 safe-area-bottom">
          <Link to="/">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="lg"
              className="w-full h-20 flex flex-col gap-1 text-base"
            >
              <Home className="h-7 w-7" />
              <span>Today</span>
            </Button>
          </Link>
          
          <Link to="/medications">
            <Button
              variant={isActive('/medications') ? 'default' : 'ghost'}
              size="lg"
              className="w-full h-20 flex flex-col gap-1 text-base"
            >
              <Pill className="h-7 w-7" />
              <span>My Meds</span>
            </Button>
          </Link>
          
          <Link to="/caregiver">
            <Button
              variant={isActive('/caregiver') ? 'default' : 'ghost'}
              size="lg"
              className="w-full h-20 flex flex-col gap-1 text-base"
            >
              <Users className="h-7 w-7" />
              <span>Caregiver</span>
            </Button>
          </Link>
        </div>
      </nav>

      <Toaster position="top-center" />
    </div>
  );
}
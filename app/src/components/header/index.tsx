import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { Locations } from '../locations';
import { Profile } from '../profile';

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const openExternalLink = (path: string) => {
    const msspUrl = 'http://localhost:3001';
    const loyaltyID = localStorage.getItem('loyaltyId');
    const locationState = useAppSelector(state => state.location.location);
    
    const params = new URLSearchParams();
    if (loyaltyID) params.append('loyaltyId', loyaltyID);
    if (locationState) params.append('location', locationState);
    
    const targetUrl = `${msspUrl}/${path}${params.toString() ? `?${params.toString()}` : ''}`;
    window.open(targetUrl);
  };

  return (
    <header>
      <nav className="flex w-full items-center justify-center">
        <div className="w-[1440px] flex items-center">
          {/* Left section */}
          <div className="flex-[0_0_15%] flex items-center">
            <Link to="/">
              <img className="w-3/4 cursor-pointer" src="/assets/bclc-logo.png" alt="Logo" />
            </Link>
          </div>

          {/* Middle section */}
          <div className="flex-[0_0_55%] flex items-center">
            <div className="flex items-center justify-center text-center">
              <NavItem to="/dashboard" icon="view-dashboard" label="Dashboard" />
              <NavItem to="/rewards" icon="gift-outline" label="Rewards" />
              <NavItem to="/purchase-history" icon="history" label="Activity History" />
              <ExternalNavItem 
                onClick={() => openExternalLink('hotel-booking')}
                icon="hotel"
                label={<>Hotel Booking <ExternalIcon /></>}
              />
              <ExternalNavItem
                onClick={() => openExternalLink('casino')}
                icon="casino"
                label={<>Casino <ExternalIcon /></>}
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex-[0_0_30%]">
            <div className="flex w-full items-center justify-between gap-10">
              <Locations />
              <Profile />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

interface NavItemProps {
  to: string;
  icon: string;
  label: React.ReactNode;
}

function NavItem({ to, icon, label }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex flex-col items-center gap-1.5 p-2.5 px-7.5 cursor-pointer nav-item
        ${isActive ? 'bg-[#f0f3f5] border-b-3 border-primary' : ''}
      `}
    >
      <img src={`/assets/icons/${icon}.svg`} alt={typeof label === 'string' ? label : 'icon'} />
      <span>{label}</span>
    </Link>
  );
}

interface ExternalNavItemProps {
  onClick: () => void;
  icon: string;
  label: React.ReactNode;
}

function ExternalNavItem({ onClick, icon, label }: ExternalNavItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 pt-2.5 px-7.5 cursor-pointer nav-item pb-1"
    >
      <img src={`/assets/icons/${icon}.svg`} alt={typeof label === 'string' ? label : 'icon'} />
      <span>{label}</span>
    </button>
  );
}

function ExternalIcon() {
  return (
    <svg
      className="small-icon pb-2 text-primary inline-block"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
    </svg>
  );
}
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

interface NavGroup {
  name: string;
  icon: JSX.Element;
  items: {
    name: string;
    href: string;
  }[];
}

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    name: "Learn",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    items: [
      { name: "Lessons", href: "/lessons" },
      { name: "Practice", href: "/practice" },
      { name: "Conjugation", href: "/verb-conjugation" },
    ]
  },
  {
    name: "Skills",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    items: [
      { name: "Writing", href: "/writing" },
      { name: "Vocabulary", href: "/vocabulary" },
      { name: "Pronunciation", href: "/pronunciation" },
      { name: "AI Pronunciation", href: "/pronunciation/ai" },
      { name: "Listening", href: "/listening" },
    ]
  },
  {
    name: "Interact",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    items: [
      { name: "Conversation", href: "/conversation" },
      { name: "Chat", href: "/chat" },
      { name: "Progress", href: "/progress" },
    ]
  }
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menus when route changes
    setIsMenuOpen(false);
    setProfileMenuOpen(false);
    setActiveDropdown(null);
  }, [router.pathname]);

  useEffect(() => {
    // Handle clicks outside dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && dropdownRefs.current[activeDropdown]) {
        if (!dropdownRefs.current[activeDropdown]?.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some(item => isActive(item.href));
  };

  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-4'}`}>
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white transition-all duration-300 shadow-sm bg-primary-600 rounded-xl group-hover:bg-primary-700">
              FT
            </div>
            <span className="text-2xl font-bold text-transparent transition-all duration-300 bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500 group-hover:from-primary-700 group-hover:to-primary-600">
              French Tutor AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-5 md:flex">
            {NAVIGATION_GROUPS.map((group) => (
              <div
                key={group.name}
                ref={(el) => { dropdownRefs.current[group.name] = el; }}
                className="relative"
              >
                <button
                  onClick={() => toggleDropdown(group.name)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeDropdown === group.name || isGroupActive(group)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-current">{group.icon}</span>
                  {group.name}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === group.name ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeDropdown === group.name && (
                  <div className="absolute z-50 py-1 mt-1 overflow-hidden bg-white border border-gray-100 rounded-lg shadow-lg w-52 animate-fadeIn">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          isActive(item.href) ? 'text-primary-700 bg-primary-50 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {item.name}
                        {isActive(item.href) && (
                          <span className="inline-block w-1.5 h-1.5 ml-2 rounded-full bg-primary-500"></span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center ml-4 space-x-2">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center p-2 space-x-2 text-gray-700 transition-all duration-200 rounded-lg hover:text-primary-600 hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center w-8 h-8 font-medium rounded-full bg-primary-100 text-primary-700">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden text-sm font-medium text-gray-700 sm:inline-block">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <svg className={`w-4 h-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 z-10 w-56 py-1 mt-2 overflow-hidden bg-white border border-gray-100 rounded-lg shadow-lg">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link
                        href="/progress"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        My Progress
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                      <div className="my-1 border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                      >
                        <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 transition-all duration-200 rounded-lg hover:text-primary-600 hover:bg-gray-100"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-white transition-all duration-200 rounded-lg bg-primary-600 hover:bg-primary-700 hover:text-white"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-gray-700 transition-colors duration-200 rounded-lg md:hidden hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="pt-4 mt-4 border-t border-gray-100 md:hidden animate-slideDown">
            <div className="grid grid-cols-1 gap-1 pb-4">
              {NAVIGATION_GROUPS.map((group) => (
                <div key={group.name} className="mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    <span className="text-primary-500">{group.icon}</span>
                    {group.name}
                  </div>
                  <div className="pl-4 space-y-1">
                    {group.items.map((item) => (
                      <MobileNavLink
                        key={item.href}
                        href={item.href}
                        active={isActive(item.href)}
                      >
                        {item.name}
                      </MobileNavLink>
                    ))}
                  </div>
                </div>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 mt-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Account
                  </div>
                  <div className="pl-4 space-y-1">
                    <MobileNavLink href="/dashboard" active={isActive('/dashboard')}>
                      Dashboard
                    </MobileNavLink>
                    <MobileNavLink href="/profile" active={isActive('/profile')}>
                      Profile
                    </MobileNavLink>
                    <MobileNavLink href="/settings" active={isActive('/settings')}>
                      Settings
                    </MobileNavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 mt-4 font-medium text-left text-red-600 transition-all duration-200 rounded-lg hover:bg-red-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-4 mt-4">
                  <Link
                    href="/login"
                    className="px-4 py-3 font-medium text-center text-gray-700 transition-all duration-200 border border-gray-200 rounded-lg hover:text-primary-600 hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-3 font-medium text-center text-white transition-all duration-200 rounded-lg bg-primary-600 hover:bg-primary-700"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease forwards;
        }
      `}</style>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
}

const NavLink = ({ href, children, active }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
        active
          ? 'text-primary-700 bg-primary-50'
          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
      }`}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary-600 rounded-full" />
      )}
    </Link>
  );
};

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
}

const MobileNavLink = ({ href, children, active }: MobileNavLinkProps) => {
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        active
          ? 'text-primary-700 bg-primary-50'
          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
      }`}
    >
      {children}
      {active && (
        <span className="inline-block w-1.5 h-1.5 ml-2 rounded-full bg-primary-500"></span>
      )}
    </Link>
  );
};

export default Header;
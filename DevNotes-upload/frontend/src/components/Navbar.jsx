import { useNavigate } from 'react-router-dom';
import { FiMenu, FiMoon, FiSun, FiLogOut, FiSearch } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Navbar = ({ onMenuClick, onSearch, searchValue }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/80 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
      <button className="btn-ghost p-2 lg:hidden" onClick={onMenuClick} aria-label="Open menu">
        <FiMenu className="text-xl" />
      </button>

      <div className="relative flex-1 max-w-xl">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Search notes..."
          className="input pl-9"
        />
      </div>

      <button
        className="btn-ghost p-2"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {theme === 'dark' ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
      </button>

      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="h-9 w-9 cursor-pointer rounded-full"
          onClick={() => navigate('/profile')}
        />
      ) : (
        <div
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white"
          onClick={() => navigate('/profile')}
        >
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      )}

      <button className="btn-ghost p-2" onClick={handleLogout} aria-label="Logout" title="Logout">
        <FiLogOut className="text-xl" />
      </button>
    </header>
  );
};

export default Navbar;

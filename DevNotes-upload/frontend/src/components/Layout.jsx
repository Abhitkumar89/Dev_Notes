import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

/**
 * App shell: persistent sidebar + top navbar with a Outlet for pages.
 * The global search value is shared with pages via the Outlet context.
 */
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onSearch={setSearch}
          searchValue={search}
        />
        <main className="mx-auto max-w-6xl px-4 py-6 animate-fade-in">
          <Outlet context={{ search, setSearch }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;

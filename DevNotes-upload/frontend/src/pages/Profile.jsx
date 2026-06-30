import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiX, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState(user?.categories || []);
  const [newCat, setNewCat] = useState('');
  const [saving, setSaving] = useState(false);

  const addCategory = () => {
    const c = newCat.trim();
    if (!c) return;
    if (categories.includes(c)) {
      toast('Category already exists');
      return;
    }
    setCategories((prev) => [...prev, c]);
    setNewCat('');
  };

  const removeCategory = (cat) => setCategories((prev) => prev.filter((c) => c !== cat));

  const saveCategories = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/categories', { categories });
      updateUser({ categories: data.categories });
      toast.success('Categories saved');
    } catch {
      toast.error('Failed to save categories');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* User card */}
      <div className="card flex items-center gap-4 p-6">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold">{user?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>

      {/* Category manager */}
      <div className="card p-6">
        <h2 className="mb-1 font-semibold">Categories</h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Organise your notes. These appear when creating or editing notes.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800"
            >
              {cat}
              <button
                onClick={() => removeCategory(cat)}
                className="text-gray-400 hover:text-red-500"
                aria-label={`Remove ${cat}`}
              >
                <FiX />
              </button>
            </span>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-400">No categories yet.</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
            placeholder="Add a category (e.g. System Design)"
            className="input"
          />
          <button className="btn-secondary shrink-0" onClick={addCategory}>
            <FiPlus /> Add
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="btn-primary" onClick={saveCategories} disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="card flex items-center justify-between p-6">
        <div>
          <h2 className="font-semibold">Sign out</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            End your session on this device.
          </p>
        </div>
        <button className="btn-danger" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

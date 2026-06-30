import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiStar, FiArchive, FiPlus, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import NoteEditor from '../components/NoteEditor.jsx';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card flex items-center gap-4 p-5">
    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
      <Icon className="text-xl" />
    </div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadStats = async () => {
    try {
      const { data } = await api.get('/notes/stats');
      setStats(data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      await api.post('/notes', payload);
      toast.success('Note created');
      setEditorOpen(false);
      loadStats();
    } catch {
      toast.error('Failed to create note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading dashboard..." />;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Hi, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Here's an overview of your workspace.</p>
        </div>
        <button className="btn-primary" onClick={() => setEditorOpen(true)}>
          <FiPlus /> New Note
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={FiFileText}
          label="Total Notes"
          value={stats.total}
          color="bg-brand-100 text-brand-700 dark:bg-brand-600/20 dark:text-brand-300"
        />
        <StatCard
          icon={FiStar}
          label="Pinned Notes"
          value={stats.pinned}
          color="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
        />
        <StatCard
          icon={FiArchive}
          label="Archived Notes"
          value={stats.archived}
          color="bg-gray-200 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent notes */}
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <FiClock className="text-gray-400" />
            <h2 className="font-semibold">Recent Notes</h2>
          </div>
          {stats.recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No notes yet. Create your first note!
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {stats.recent.map((note) => (
                <li
                  key={note._id}
                  onClick={() => navigate(`/notes/${note._id}`)}
                  className="flex cursor-pointer items-center justify-between gap-3 py-3 transition hover:opacity-80"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 truncate font-medium">
                      {note.isPinned && <FiStar className="fill-amber-400 text-amber-400" />}
                      {note.title}
                    </p>
                    <p className="truncate text-xs text-gray-400">{note.category}</p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Categories breakdown */}
        <div className="card p-5">
          <h2 className="mb-4 font-semibold">By Category</h2>
          {stats.byCategory.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No categories yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.byCategory.map((c) => (
                <li key={c._id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{c._id}</span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium dark:bg-gray-800">
                    {c.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <NoteEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleCreate}
        saving={saving}
      />
    </div>
  );
};

export default Dashboard;

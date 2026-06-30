import { useEffect, useState, useCallback } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiInbox } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import NoteCard from '../components/NoteCard.jsx';
import NoteEditor from '../components/NoteEditor.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Spinner from '../components/Spinner.jsx';

const Notes = () => {
  const { search } = useOutletContext();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pinned = searchParams.get('pinned') === 'true';
  const archived = searchParams.get('archived') === 'true';

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('recent');

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (pinned) params.pinned = 'true';
      if (archived) params.archived = 'true';

      const { data } = await api.get('/notes', { params });
      setNotes(data);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, pinned, archived]);

  // Debounce search-driven reloads
  useEffect(() => {
    const t = setTimeout(loadNotes, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [loadNotes]);

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (note) => {
    setEditing(note);
    setEditorOpen(true);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/notes/${editing._id}`, payload);
        toast.success('Note updated');
      } else {
        await api.post('/notes', payload);
        toast.success('Note created');
      }
      setEditorOpen(false);
      loadNotes();
    } catch {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const togglePin = async (note) => {
    try {
      await api.put(`/notes/${note._id}`, { isPinned: !note.isPinned });
      toast.success(note.isPinned ? 'Unpinned' : 'Pinned');
      loadNotes();
    } catch {
      toast.error('Action failed');
    }
  };

  const toggleArchive = async (note) => {
    try {
      await api.put(`/notes/${note._id}`, { isArchived: !note.isArchived });
      toast.success(note.isArchived ? 'Unarchived' : 'Archived');
      loadNotes();
    } catch {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (note) => {
    try {
      await api.delete(`/notes/${note._id}`);
      toast.success('Note deleted');
      loadNotes();
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const title = pinned ? 'Pinned Notes' : archived ? 'Archived Notes' : 'All Notes';
  const categories = ['All', 'General', ...(user?.categories || [])];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button className="btn-primary" onClick={openCreate}>
          <FiPlus /> New Note
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                category === c
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input ml-auto max-w-[160px]"
        >
          <option value="recent">Recently updated</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title (A–Z)</option>
        </select>
      </div>

      {loading ? (
        <Spinner label="Loading notes..." />
      ) : notes.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
          <FiInbox className="text-4xl text-gray-300" />
          <p className="font-medium">No notes found</p>
          <p className="text-sm text-gray-400">
            {search ? 'Try a different search term.' : 'Create your first note to get started.'}
          </p>
          {!search && (
            <button className="btn-primary mt-2" onClick={openCreate}>
              <FiPlus /> New Note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onOpen={(n) => navigate(`/notes/${n._id}`)}
              onEdit={openEdit}
              onTogglePin={togglePin}
              onToggleArchive={toggleArchive}
              onDelete={(n) =>
                setConfirm({
                  title: 'Delete note',
                  message: `Are you sure you want to delete "${n.title}"? This cannot be undone.`,
                  onConfirm: () => handleDelete(n),
                })
              }
            />
          ))}
        </div>
      )}

      <NoteEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        note={editing}
        saving={saving}
      />

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={confirm?.onConfirm || (() => {})}
        title={confirm?.title}
        message={confirm?.message}
        confirmText="Delete"
      />
    </div>
  );
};

export default Notes;

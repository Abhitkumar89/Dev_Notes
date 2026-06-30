import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiStar, FiArchive, FiTrash2, FiCornerUpLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import MarkdownRenderer from '../components/MarkdownRenderer.jsx';
import NoteEditor from '../components/NoteEditor.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Spinner from '../components/Spinner.jsx';

const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const loadNote = async () => {
    try {
      const { data } = await api.get(`/notes/${id}`);
      setNote(data);
    } catch {
      toast.error('Note not found');
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/notes/${id}`, payload);
      setNote(data);
      toast.success('Note updated');
      setEditorOpen(false);
    } catch {
      toast.error('Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  const patch = async (changes, successMsg) => {
    try {
      const { data } = await api.put(`/notes/${id}`, changes);
      setNote(data);
      if (successMsg) toast.success(successMsg);
    } catch {
      toast.error('Action failed');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note deleted');
      navigate('/notes');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  if (loading) return <Spinner label="Loading note..." />;
  if (!note) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button className="btn-ghost -ml-2" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>

      <div className="card p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-600/20 dark:text-brand-300">
                {note.category}
              </span>
              {note.isPinned && <FiStar className="fill-amber-400 text-amber-400" />}
              {note.isArchived && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
                  Archived
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold">{note.title}</h1>
            <p className="mt-1 text-xs text-gray-400">
              Updated {new Date(note.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button className="btn-ghost p-2" title="Pin" onClick={() => patch({ isPinned: !note.isPinned }, note.isPinned ? 'Unpinned' : 'Pinned')}>
              <FiStar className={note.isPinned ? 'fill-amber-400 text-amber-400' : ''} />
            </button>
            <button className="btn-ghost p-2" title="Archive" onClick={() => patch({ isArchived: !note.isArchived }, note.isArchived ? 'Unarchived' : 'Archived')}>
              {note.isArchived ? <FiCornerUpLeft /> : <FiArchive />}
            </button>
            <button className="btn-ghost p-2" title="Edit" onClick={() => setEditorOpen(true)}>
              <FiEdit2 />
            </button>
            <button
              className="btn-ghost p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              title="Delete"
              onClick={() => setConfirmDelete(true)}
            >
              <FiTrash2 />
            </button>
          </div>
        </div>

        {note.tags?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs dark:bg-gray-800">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <hr className="my-4 border-gray-200 dark:border-gray-800" />

        <MarkdownRenderer content={note.content} />
      </div>

      <NoteEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        note={note}
        saving={saving}
      />

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete note"
        message={`Are you sure you want to delete "${note.title}"? This cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default NoteView;

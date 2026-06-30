import { useEffect, useState } from 'react';
import { FiEye, FiEdit3 } from 'react-icons/fi';
import Modal from './Modal.jsx';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const emptyNote = { title: '', content: '', category: 'General', tags: [], isPinned: false };

/**
 * Create / edit note modal with a live markdown preview tab.
 */
const NoteEditor = ({ open, onClose, onSave, note, saving }) => {
  const { user } = useAuth();
  const [form, setForm] = useState(emptyNote);
  const [tab, setTab] = useState('write');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (open) {
      setForm(note ? { ...emptyNote, ...note } : emptyNote);
      setTab('write');
      setTagInput('');
    }
  }, [open, note]);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setField('tags', [...form.tags, t]);
    }
    setTagInput('');
  };

  const removeTag = (tag) => setField('tags', form.tags.filter((t) => t !== tag));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      title: form.title.trim() || 'Untitled',
    });
  };

  const categories = ['General', ...(user?.categories || [])];

  return (
    <Modal open={open} onClose={onClose} title={note ? 'Edit Note' : 'New Note'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setField('title', e.target.value)}
          placeholder="Note title"
          className="input text-lg font-semibold"
          autoFocus
        />

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
            className="input max-w-[180px]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(e) => setField('isPinned', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            Pin this note
          </label>
        </div>

        {/* Tags */}
        <div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs dark:bg-gray-800"
              >
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500">
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag and press Enter"
            className="input mt-2"
          />
        </div>

        {/* Write / Preview tabs */}
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-sm dark:bg-gray-800">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 transition ${
              tab === 'write' ? 'bg-white shadow dark:bg-gray-900' : 'text-gray-500'
            }`}
          >
            <FiEdit3 /> Write
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 transition ${
              tab === 'preview' ? 'bg-white shadow dark:bg-gray-900' : 'text-gray-500'
            }`}
          >
            <FiEye /> Preview
          </button>
        </div>

        {tab === 'write' ? (
          <textarea
            value={form.content}
            onChange={(e) => setField('content', e.target.value)}
            placeholder="Write your note in markdown... Supports headings, lists, tables, images, links and code blocks."
            className="input min-h-[280px] font-mono text-sm leading-relaxed"
          />
        ) : (
          <div className="min-h-[280px] rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <MarkdownRenderer content={form.content} />
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NoteEditor;

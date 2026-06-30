import { FiStar, FiArchive, FiEdit2, FiTrash2, FiCornerUpLeft } from 'react-icons/fi';

const categoryColors = {
  React: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  Node: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
  DSA: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  Interview: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  JavaScript: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300',
  Database: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

const stripMarkdown = (md = '') =>
  md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~\-]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

const NoteCard = ({ note, onOpen, onEdit, onDelete, onTogglePin, onToggleArchive }) => {
  const badge =
    categoryColors[note.category] ||
    'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300';

  return (
    <div className="card group flex cursor-pointer flex-col p-4 transition hover:shadow-md">
      <div onClick={() => onOpen(note)} className="flex-1">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold">{note.title}</h3>
          {note.isPinned && <FiStar className="shrink-0 fill-amber-400 text-amber-400" />}
        </div>
        <p className="line-clamp-3 min-h-[3.75rem] text-sm text-gray-500 dark:text-gray-400">
          {stripMarkdown(note.content) || 'Empty note'}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
          {note.category}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-3 opacity-0 transition group-hover:opacity-100 dark:border-gray-800">
        <button
          className="btn-ghost p-1.5"
          title={note.isPinned ? 'Unpin' : 'Pin'}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note);
          }}
        >
          <FiStar className={note.isPinned ? 'fill-amber-400 text-amber-400' : ''} />
        </button>
        <button
          className="btn-ghost p-1.5"
          title={note.isArchived ? 'Unarchive' : 'Archive'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleArchive(note);
          }}
        >
          {note.isArchived ? <FiCornerUpLeft /> : <FiArchive />}
        </button>
        <button
          className="btn-ghost p-1.5"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
        >
          <FiEdit2 />
        </button>
        <button
          className="btn-ghost ml-auto p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note);
          }}
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;

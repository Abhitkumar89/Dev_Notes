import Note from '../models/Note.js';

/**
 * GET /api/notes
 * Supports query params: search, category, pinned, archived, sort.
 */
export const getNotes = async (req, res, next) => {
  try {
    const { search, category, pinned, archived, sort } = req.query;

    const filter = { user: req.user._id };

    // By default, hide archived notes unless explicitly requested
    if (archived === 'true') {
      filter.isArchived = true;
    } else if (archived === 'all') {
      // no filter on archived
    } else {
      filter.isArchived = false;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (pinned === 'true') {
      filter.isPinned = true;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { content: regex }, { tags: regex }];
    }

    let sortOption = { isPinned: -1, updatedAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title') sortOption = { title: 1 };

    const notes = await Note.find(filter).sort(sortOption);
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notes/stats
 * Dashboard statistics for the authenticated user.
 */
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [total, pinned, archived, recent, byCategory] = await Promise.all([
      Note.countDocuments({ user: userId, isArchived: false }),
      Note.countDocuments({ user: userId, isPinned: true, isArchived: false }),
      Note.countDocuments({ user: userId, isArchived: true }),
      Note.find({ user: userId, isArchived: false }).sort({ updatedAt: -1 }).limit(5),
      Note.aggregate([
        { $match: { user: userId, isArchived: false } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({ total, pinned, archived, recent, byCategory });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notes/:id
 */
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/notes
 */
export const createNote = async (req, res, next) => {
  try {
    const { title, content, category, tags, isPinned } = req.body;

    const note = await Note.create({
      user: req.user._id,
      title: title?.trim() || 'Untitled',
      content: content || '',
      category: category?.trim() || 'General',
      tags: Array.isArray(tags) ? tags : [],
      isPinned: Boolean(isPinned),
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notes/:id
 */
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    const fields = ['title', 'content', 'category', 'tags', 'isPinned', 'isArchived'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        note[field] = req.body[field];
      }
    });

    const updated = await note.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/notes/:id
 */
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }
    res.json({ message: 'Note deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

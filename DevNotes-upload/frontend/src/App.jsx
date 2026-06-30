import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './context/ThemeContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Notes from './pages/Notes.jsx';
import NoteView from './pages/NoteView.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => {
  const { theme } = useTheme();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style:
            theme === 'dark'
              ? { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' }
              : { background: '#ffffff', color: '#111827', border: '1px solid #e5e7eb' },
        }}
      />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:id" element={<NoteView />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
};

export default App;

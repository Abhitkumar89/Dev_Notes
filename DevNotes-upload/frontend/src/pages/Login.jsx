import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiFileText, FiCode, FiStar, FiMoon } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

const features = [
  { icon: FiFileText, text: 'Markdown notes with live preview' },
  { icon: FiCode, text: 'Syntax-highlighted code snippets' },
  { icon: FiStar, text: 'Pin, archive and organise by category' },
  { icon: FiMoon, text: 'Beautiful dark mode' },
];

const Login = () => {
  const { user, loading, loginWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const navigate = useNavigate();

  if (loading) return <Spinner fullScreen label="Loading DevNotes..." />;
  if (user) return <Navigate to="/" replace />;

  const handleGoogle = async () => {
    setSigningIn(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome to DevNotes!');
      navigate('/');
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        toast('Sign-in cancelled');
      } else {
        toast.error(err?.response?.data?.message || 'Google sign-in failed');
      }
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Branding panel */}
      <div className="flex flex-1 flex-col justify-center bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-white lg:p-16">
        <div className="mx-auto max-w-md">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl font-bold backdrop-blur">
              D
            </div>
            <h1 className="text-3xl font-extrabold">DevNotes</h1>
          </div>
          <p className="mb-10 text-lg text-brand-100">
            A Notion-inspired markdown workspace built for developers. Capture notes, snippets and
            ideas — beautifully organised.
          </p>
          <ul className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <Icon />
                </span>
                <span className="text-brand-50">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sign-in panel */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-10 dark:bg-gray-950">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Sign in to continue to your workspace
          </p>

          <button
            onClick={handleGoogle}
            disabled={signingIn}
            className="btn-secondary mt-8 w-full py-3 text-base"
          >
            {signingIn ? (
              <Spinner size="sm" />
            ) : (
              <>
                <FcGoogle className="text-xl" />
                Continue with Google
              </>
            )}
          </button>

          <p className="mt-6 text-xs text-gray-400">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

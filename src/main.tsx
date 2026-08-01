import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const AdminApp = lazy(() => import('./admin/AdminApp.tsx'));
const isAdminOnlyBuild = import.meta.env.VITE_ADMIN_ONLY === 'true';
const isAdminHost = window.location.hostname.toLowerCase().startsWith('admin.');
const isLocalAdmin = import.meta.env.DEV && new URLSearchParams(window.location.search).has('admin');
const RootApp = isAdminOnlyBuild || isAdminHost || isLocalAdmin ? AdminApp : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <RootApp />
    </Suspense>
  </StrictMode>
);

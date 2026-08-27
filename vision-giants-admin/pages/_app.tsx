// pages/_app.tsx
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import { AdminAuthProvider } from '@/lib/AdminAuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import '../styles/globals.css';
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AdminAuthProvider>
        {isLoginPage ? (
          <Component {...pageProps} />
        ) : (
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        )}
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
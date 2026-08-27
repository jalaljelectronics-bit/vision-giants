import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import Layout from '@/components/layout/Layout';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import '@/styles/globals.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        <OrganizationJsonLd />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </ThemeProvider>
  );
}
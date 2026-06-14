'use client';

import * as React from 'react';
import './globals.css';
import { storage } from '@/lib/storage';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = React.useState('dark');
  const [lang, setLang] = React.useState('en');

  React.useEffect(() => {
    const profile = storage.getProfile();
    setTheme(profile.preferences.theme);
    setLang(profile.preferences.language);
  }, []);

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`dark theme-${theme}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
        <title>NeuroCortex Pro | Advanced Neurosurgery CDSS</title>
      </head>
      <body className="font-body antialiased selection:bg-accent selection:text-accent-foreground">
        {children}
      </body>
    </html>
  );
}

'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import theme from '../theme';
import { MapProvider } from '../contexts/MapContext';
import { trpc, trpcClient } from '../utils/trpc';
import Header from '../components/Header';
import './globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <AppRouterCacheProvider>
          <UserProvider>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
              <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <MapProvider>
                    <Header />
                    <main>
                      {children}
                    </main>
                  </MapProvider>
                </ThemeProvider>
              </QueryClientProvider>
            </trpc.Provider>
          </UserProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

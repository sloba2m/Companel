import 'src/global.css';

// ----------------------------------------------------------------------

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

const queryClient = new QueryClient();

export default function App() {
  useScrollToTop();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider settings={defaultSettings}>
          <ThemeProvider>
            <MotionLazy>
              <ProgressBar />
              <SettingsDrawer
                hideCompact
                hideContrast
                hideDirection
                hideFont
                hideNavColor
                hideNavLayout
                hidePresets
              />
              <Router />
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

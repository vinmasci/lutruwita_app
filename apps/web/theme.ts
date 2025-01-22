import { createTheme, alpha } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Create a theme instance for each mode
const getTheme = (mode: PaletteMode) => {
  const primaryMain = mode === 'light' ? '#2B6CB0' : '#90CDF4';
  const secondaryMain = mode === 'light' ? '#38A169' : '#9AE6B4';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryMain,
        light: alpha(primaryMain, 0.8),
        dark: alpha(primaryMain, 1.0),
      },
      secondary: {
        main: secondaryMain,
        light: alpha(secondaryMain, 0.8),
        dark: alpha(secondaryMain, 1.0),
      },
      background: {
        default: mode === 'light' ? '#F7FAFC' : '#1A202C',
        paper: mode === 'light' ? '#FFFFFF' : '#2D3748',
      },
      text: {
        primary: mode === 'light' ? '#2D3748' : '#F7FAFC',
        secondary: mode === 'light' ? '#4A5568' : '#E2E8F0',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '8px 16px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0,0,0,0.1)'
              : '0 1px 3px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#2D3748',
            color: mode === 'light' ? '#2D3748' : '#F7FAFC',
            boxShadow: 'none',
            borderBottom: `1px solid ${mode === 'light' ? '#E2E8F0' : '#4A5568'}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#2D3748',
            borderRight: `1px solid ${mode === 'light' ? '#E2E8F0' : '#4A5568'}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light'
              ? '0 1px 3px rgba(0,0,0,0.1)'
              : '0 1px 3px rgba(0,0,0,0.3)',
            border: `1px solid ${mode === 'light' ? '#E2E8F0' : '#4A5568'}`,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: 8,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === 'light' ? '#2D3748' : '#F7FAFC',
            color: mode === 'light' ? '#F7FAFC' : '#2D3748',
            fontSize: '0.75rem',
          },
        },
      },
    },
  });
};

// Export both light and dark themes
export const lightTheme = getTheme('light');
export const darkTheme = getTheme('dark');

// Export default theme (light)
export default lightTheme;

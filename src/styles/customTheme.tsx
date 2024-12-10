import {
  experimental_extendTheme as extendTheme,
  getContrastRatio,
} from '@mui/material/styles';

// Common component style overrides

const commonComponents = {
  MuiButton: {
    styleOverrides: {
      root: ({ theme }: any) => {
        const lightA400 = theme.colorSchemes.light.palette.warning.A400;
        const darkA400 = theme.colorSchemes.dark.palette.warning.A400;
        return {
          borderRadius: '100px',
          border: '1px solid #1E1B16',
          color: theme.palette.mode === 'dark' ? lightA400 : darkA400, // Replace with a valid color value
        };
      },
      containedPrimary: ({ theme }: any) => ({
        border: 'none',
        color:
          getContrastRatio(theme.palette.primary.main, '#FFFFFF') >= 3
            ? '#FFFFFF'
            : '#000000',
      }),
      outlinedPrimary: {
        backgroundColor: 'none',
        border: '1px solid #1E1B16',
      },
      textPrimary: {
        backgroundColor: 'none',
        border: 'none',
        color: '#0D599E',
      },
      containedSecondary: {
        backgroundColor: '#fbbc13',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: ({ theme }: any) => {
        const lightA400 = theme.colorSchemes.light.palette.warning.A400;
        const darkA400 = theme.colorSchemes.dark.palette.warning.A400;

        return {
          width: '100%',
          '& .MuiInputBase-input:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 100px ${theme.palette?.warning?.A400 || '#000'} inset`,
            WebkitTextFillColor:
              theme.palette.mode === 'dark' ? lightA400 : darkA400,
          },
        };
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: '16px',
        width: '90vw',
        maxWidth: '340px',
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        '&.Mui-focused': {
          color: '#1F1B13',
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {},
        // background: '#BA1A1A'
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: ({ theme }: any) => {
        const lightA400 = theme.colorSchemes.light.palette.warning.A400;
        const darkA400 = theme.colorSchemes.dark.palette.warning.A400;

        return {
          color: theme.palette.mode === 'dark' ? lightA400 : darkA400, // Checkbox default color based on the opposite theme
          '&.Mui-checked': {
            color: theme.palette.mode === 'dark' ? lightA400 : darkA400, // Checked color based on opposite theme
          },
        };
      },
    },
  },
};

const customTheme = extendTheme({
  // direction: 'rtl',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#FDBE16',
          light: '#FFDEA1',
        },
        secondary: {
          main: '#0D599E',
          light: '#E7F3F8',
        },
        success: {
          main: '#1A8825',
          light: '#C0FFC7',
        },
        info: {
          main: '#064471',
          light: '#D6EEFF',
          contrastText: '#EFC570',
        },
        warning: {
          '100': '#17130B',
          '200': '#261900',
          '300': '#1F1B13',
          '400': '#7C766F',
          '500': '#969088',
          '600': '#B1AAA2',
          '700': '#DED8E1',
          '800': '#F8EFE7',
          '900': '#DADADA',
          A100: '#D0C5B4',
          A200: '#4D4639',
          A400: '#FFFFFF',
          A700: '#EDEDED',
        },
        error: {
          main: '#BA1A1A',
          light: '#FFDAD6',
          contrastText: '#1E1B16',
        },
        action: {
          activeChannel: '#987100',
          selectedChannel: '#dba403',
          selected: '#FBF4E4',
        },
        customTextColors: {
          custom1: '#FF6347', // Tomato
          custom2: '#20B2AA', // LightSeaGreen
          custom3: '#4682B4', // SteelBlue
          custom4: '#FF4500', // OrangeRed
          custom5: '#32CD32', // LimeGreen
          custom6: '#9370DB', // MediumPurple
          custom7: '#2ac300', //parrotGreen
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#FDBE16',
          light: '#FFC64D',
        },
        secondary: {
          main: '#0D599E',
          light: '#A3CADF',
        },
        success: {
          main: '#1A8825',
          light: '#82D494',
        },
        info: {
          main: '#064471',
          light: '#4E6E8F',
          contrastText: '#F0E68C',
        },
        warning: {
          '100': '#1A1A1A',
          '200': '#fff',
          '300': '#fff',
          '400': '#4D4D4D',
          '500': '#666666',
          '600': '#808080',
          '700': '#999999',
          '800': '#B3B3B3',
          '900': '#CCCCCC',
          A100: '#E6E6E6',
          A200: '#4D4639',
          A400: '#121212', // #222831
          A700: '#FFFFFF',
        },
        error: {
          main: '#FF4C4C',
          light: '#FF9999',
          contrastText: '#333333',
        },
        action: {
          activeChannel: '#FFC107',
          selectedChannel: '#FF9800',
        },
      },
    },
  },

  components: commonComponents,
  typography: {
    fontFamily: 'inherit',
    h1: {
      fontSize: '22px',
      fontWeight: 400,
      lineHeight: '28px',
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '24px',
    },
    h3: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
      marginBottom: '0.5rem',
    },
    h4: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '0.1px',
    },
    h5: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.5px',
    },
    h6: {
      fontSize: '11px',
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.5px',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '0.5px',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '0.25px',
      marginBottom: '1rem',
    },
    button: {
      textTransform: 'none',
      fontSize: '14px',
      fontWeight: 600,
    },
  },
});

export default customTheme;

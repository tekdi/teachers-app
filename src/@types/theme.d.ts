import { PaletteOptions, Palette } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customTextColors: {
      custom1: string;
      custom2: string;
      custom3: string;
      custom4: string;
      custom5: string;
      custom6: string;
    };
  }
  interface PaletteOptions {
    customTextColors?: {
      custom1?: string;
      custom2?: string;
      custom3?: string;
      custom4?: string;
      custom5?: string;
      custom6?: string;
      custom7?: string;
    };
  }
}

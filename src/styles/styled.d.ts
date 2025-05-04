import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      secondary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      error: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      warning: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      info: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      success: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      grey: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      text: {
        primary: string;
        secondary: string;
        disabled: string;
      };
      background: {
        default: string;
        paper: string;
        surface: string;
        light: string;
      };
      surface: string;
      border: {
        main: string;
        light: string;
        dark: string;
      };
      divider: string;
    };
    typography: {
      fontFamily: string;
      sizes: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
      };
      weights: {
        light: number;
        regular: number;
        medium: number;
        bold: number;
      };
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    transitions: {
      duration: {
        shortest: number;
        shorter: number;
        short: number;
        standard: number;
        medium: number;
        long: number;
        complex: number;
        enteringScreen: number;
        leavingScreen: number;
      };
      easing: {
        easeInOut: string;
        easeOut: string;
        easeIn: string;
        sharp: string;
      };
    };
    zIndex: {
      mobileStepper: number;
      speedDial: number;
      appBar: number;
      drawer: number;
      modal: number;
      snackbar: number;
      tooltip: number;
    };
  }
}

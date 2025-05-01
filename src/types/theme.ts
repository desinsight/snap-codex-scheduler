export interface Theme {
  colors: {
    primary: {
      main: string;
      light: string;
      dark: string;
    };
    background: {
      default: string;
      paper: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    divider: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    h1: {
      fontSize: string;
      fontWeight: number;
    };
    h2: {
      fontSize: string;
      fontWeight: number;
    };
    h3: {
      fontSize: string;
      fontWeight: number;
    };
    h4: {
      fontSize: string;
      fontWeight: number;
    };
    h5: {
      fontSize: string;
      fontWeight: number;
    };
    body1: {
      fontSize: string;
      fontWeight: number;
    };
    body2: {
      fontSize: string;
      fontWeight: number;
    };
    button: {
      fontSize: string;
      fontWeight: number;
    };
  };
  shape: {
    borderRadius: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  transitions: {
    duration: {
      short: number;
      standard: number;
      long: number;
    };
    easing: {
      easeInOut: string;
      easeOut: string;
      easeIn: string;
      sharp: string;
    };
  };
} 
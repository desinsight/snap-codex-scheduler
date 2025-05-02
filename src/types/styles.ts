// 기본 색상 타입
export type Color = string;
export type ColorScheme = 'light' | 'dark' | 'system';

// 테마 색상 타입
export interface ThemeColors {
  primary: Color;
  secondary: Color;
  success: Color;
  warning: Color;
  error: Color;
  info: Color;
  background: {
    primary: Color;
    secondary: Color;
    tertiary: Color;
  };
  text: {
    primary: Color;
    secondary: Color;
    disabled: Color;
  };
  border: {
    default: Color;
    focus: Color;
    hover: Color;
  };
}

// 타이포그래피 타입
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type LineHeight = 'none' | 'tight' | 'normal' | 'relaxed' | 'loose';

export interface Typography {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  fontSize: Record<FontSize, string>;
  fontWeight: Record<FontWeight, number>;
  lineHeight: Record<LineHeight, number | string>;
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

// 스페이싱 및 레이아웃 타입
export type Space = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface Spacing {
  padding: Record<Space, string>;
  margin: Record<Space, string>;
  gap: Record<Space, string>;
}

export interface Layout {
  width: Record<Size, string>;
  height: Record<Size, string>;
  maxWidth: Record<Size, string>;
  maxHeight: Record<Size, string>;
}

// 테두리 및 모서리 타입
export type BorderWidth = 'none' | 'thin' | 'normal' | 'thick';
export type BorderStyle = 'solid' | 'dashed' | 'dotted';
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface Borders {
  width: Record<BorderWidth, string>;
  style: Record<BorderStyle, string>;
  radius: Record<BorderRadius, string>;
}

// 그림자 타입
export type Shadow = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface Shadows {
  boxShadow: Record<Shadow, string>;
  textShadow: Record<Shadow, string>;
}

// z-index 타입
export type ZIndex = 'base' | 'dropdown' | 'sticky' | 'fixed' | 'modal' | 'popover' | 'toast';

export interface ZIndices {
  values: Record<ZIndex, number>;
}

// 애니메이션 및 전환 타입
export type Duration = 'fast' | 'normal' | 'slow';
export type Easing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface Transitions {
  duration: Record<Duration, number>;
  easing: Record<Easing, string>;
}

// 반응형 브레이크포인트 타입
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface Breakpoints {
  values: Record<Breakpoint, number>;
  up: (breakpoint: Breakpoint) => string;
  down: (breakpoint: Breakpoint) => string;
  between: (start: Breakpoint, end: Breakpoint) => string;
}

// 컴포넌트별 스타일 타입
export interface ComponentStyles {
  // 버튼 스타일
  button: {
    base: React.CSSProperties;
    variants: {
      primary: React.CSSProperties;
      secondary: React.CSSProperties;
      outline: React.CSSProperties;
      ghost: React.CSSProperties;
    };
    sizes: Record<Size, React.CSSProperties>;
    states: {
      hover: React.CSSProperties;
      active: React.CSSProperties;
      disabled: React.CSSProperties;
      loading: React.CSSProperties;
    };
  };

  // 입력 필드 스타일
  input: {
    base: React.CSSProperties;
    variants: {
      outline: React.CSSProperties;
      filled: React.CSSProperties;
      flushed: React.CSSProperties;
    };
    sizes: Record<Size, React.CSSProperties>;
    states: {
      focus: React.CSSProperties;
      error: React.CSSProperties;
      disabled: React.CSSProperties;
    };
  };

  // 카드 스타일
  card: {
    base: React.CSSProperties;
    variants: {
      elevated: React.CSSProperties;
      outlined: React.CSSProperties;
      filled: React.CSSProperties;
    };
    sizes: Record<Size, React.CSSProperties>;
  };

  // 모달 스타일
  modal: {
    overlay: React.CSSProperties;
    container: React.CSSProperties;
    header: React.CSSProperties;
    body: React.CSSProperties;
    footer: React.CSSProperties;
  };

  // 알림 스타일
  notification: {
    base: React.CSSProperties;
    variants: {
      success: React.CSSProperties;
      error: React.CSSProperties;
      warning: React.CSSProperties;
      info: React.CSSProperties;
    };
    positions: {
      topRight: React.CSSProperties;
      topLeft: React.CSSProperties;
      bottomRight: React.CSSProperties;
      bottomLeft: React.CSSProperties;
    };
  };
}

// 전역 테마 타입
export interface Theme {
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  layout: Layout;
  borders: Borders;
  shadows: Shadows;
  zIndices: ZIndices;
  transitions: Transitions;
  breakpoints: Breakpoints;
  components: ComponentStyles;
}

// 스타일 유틸리티 타입
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
export type ColorValue = Color | keyof ThemeColors;
export type SpaceValue = Space | string | number;

// 스타일 프롭스 타입
export interface StyleProps {
  m?: ResponsiveValue<SpaceValue>;
  mt?: ResponsiveValue<SpaceValue>;
  mr?: ResponsiveValue<SpaceValue>;
  mb?: ResponsiveValue<SpaceValue>;
  ml?: ResponsiveValue<SpaceValue>;
  mx?: ResponsiveValue<SpaceValue>;
  my?: ResponsiveValue<SpaceValue>;
  p?: ResponsiveValue<SpaceValue>;
  pt?: ResponsiveValue<SpaceValue>;
  pr?: ResponsiveValue<SpaceValue>;
  pb?: ResponsiveValue<SpaceValue>;
  pl?: ResponsiveValue<SpaceValue>;
  px?: ResponsiveValue<SpaceValue>;
  py?: ResponsiveValue<SpaceValue>;
  color?: ResponsiveValue<ColorValue>;
  bg?: ResponsiveValue<ColorValue>;
  width?: ResponsiveValue<Size | string>;
  height?: ResponsiveValue<Size | string>;
  minWidth?: ResponsiveValue<Size | string>;
  maxWidth?: ResponsiveValue<Size | string>;
  minHeight?: ResponsiveValue<Size | string>;
  maxHeight?: ResponsiveValue<Size | string>;
  fontSize?: ResponsiveValue<FontSize>;
  fontWeight?: ResponsiveValue<FontWeight>;
  lineHeight?: ResponsiveValue<LineHeight>;
  borderWidth?: ResponsiveValue<BorderWidth>;
  borderStyle?: ResponsiveValue<BorderStyle>;
  borderRadius?: ResponsiveValue<BorderRadius>;
  boxShadow?: ResponsiveValue<Shadow>;
  zIndex?: ZIndex;
}

// 스타일 시스템 설정 타입
export interface StyleSystemConfig {
  theme: Theme;
  cssReset?: boolean;
  globalStyles?: React.CSSProperties;
  colorMode?: ColorScheme;
  useSystemColorMode?: boolean;
} 
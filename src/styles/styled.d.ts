import 'styled-components';
import { Theme as MuiTheme } from '@mui/material/styles';

declare module 'styled-components' {
  export interface DefaultTheme extends MuiTheme {
    // MUI theme를 확장하는 추가 타입 정의
    vars?: never; // vars 속성을 명시적으로 제거
  }
}

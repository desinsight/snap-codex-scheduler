import { createGlobalStyle } from 'styled-components';
import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: {
      small: string;
      medium: string;
      large: string;
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
  }
}

export const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background-color: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.5;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    color: inherit;
  }

  input, textarea {
    font: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: white;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.grey[100]};
    border-radius: ${radius('small')};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.grey[400]};
    border-radius: ${radius('small')};
    
    &:hover {
      background: ${({ theme }) => theme.colors.grey[500]};
    }
  }

  .button {
    border-radius: ${radius('small')};
  }

  .card {
    border-radius: ${radius('small')};
  }

  .fade-enter {
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.duration.medium}ms;
  }

  .fade-enter-active {
    opacity: 1;
    transition: opacity ${({ theme }) => theme.transitions.duration.medium}ms;
  }

  .fade-exit {
    opacity: 1;
    transition: transform ${({ theme }) => theme.transitions.duration.medium}ms;
  }

  .fade-exit-active {
    opacity: 0;
    transition: transform ${({ theme }) => theme.transitions.duration.medium}ms;
  }

  .slide-enter {
    transform: translateX(100%);
  }

  .slide-enter-active {
    transform: translateX(0);
    transition: transform ${({ theme }) => theme.transitions.medium};
  }

  .slide-exit {
    transform: translateX(0);
  }

  .slide-exit-active {
    transform: translateX(-100%);
    transition: transform ${({ theme }) => theme.transitions.medium};
  }
`;

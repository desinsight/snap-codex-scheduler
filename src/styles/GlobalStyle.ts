import { createGlobalStyle } from 'styled-components';
import type { AppTheme } from './theme';

export const GlobalStyle = createGlobalStyle<{ theme: AppTheme }>`
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
    background-color: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
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
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.palette.grey[100]};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.palette.grey[400]};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  }

  .button {
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  }

  .card {
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  }

  .fade-enter {
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.duration.standard}ms;
  }

  .fade-enter-active {
    opacity: 1;
    transition: opacity ${({ theme }) => theme.transitions.duration.standard}ms;
  }

  .fade-exit {
    opacity: 1;
    transition: transform ${({ theme }) => theme.transitions.duration.standard}ms;
  }

  .fade-exit-active {
    opacity: 0;
    transition: transform ${({ theme }) => theme.transitions.duration.standard}ms;
  }

  .slide-enter {
    transform: translateX(100%);
  }

  .slide-enter-active {
    transform: translateX(0);
    transition: transform ${({ theme }) => theme.transitions.duration.standard}ms ${({ theme }) => theme.transitions.easing.easeOut};
  }

  .slide-exit {
    transform: translateX(0);
  }

  .slide-exit-active {
    transform: translateX(-100%);
    transition: transform ${({ theme }) => theme.transitions.duration.standard}ms ${({ theme }) => theme.transitions.easing.easeOut};
  }
`;

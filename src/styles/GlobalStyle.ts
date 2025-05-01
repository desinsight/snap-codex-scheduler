import { createGlobalStyle } from 'styled-components';

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
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.grey[400]};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    
    &:hover {
      background: ${({ theme }) => theme.colors.grey[500]};
    }
  }

  .fade-enter {
    opacity: 0;
  }

  .fade-enter-active {
    opacity: 1;
    transition: opacity ${({ theme }) => theme.transitions.medium};
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-exit-active {
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.medium};
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

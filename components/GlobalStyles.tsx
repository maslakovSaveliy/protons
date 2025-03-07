"use client";

import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
@font-face {
  font-family: 'RG-Standard';
  src: url('/fonts/RG-StandardSemibold.otf') format('opentype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
  :root {
    --color-violet-accent: #A928C9;
    --color-white: #FAE9FF;
    --color-body: #541161;
    --color-black: #2E0738;
    --color-border: #D9B9E2;
    
    --font-size-body-l: 22px;
    --line-height-body-l: 24px;
    --font-size-body-m: 18px;
    --line-height-body-m: 20px;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: 'RG-Standard', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #1E1E1E;
    color: var(--color-body);
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  
  /* Скрыть скролл бар для всех элементов */
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
  
  /* Для Firefox */
  * {
    scrollbar-width: none;
  }
  
  /* Для IE и Edge */
  * {
    -ms-overflow-style: none;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  button {
    cursor: pointer;
  }
`;

export default GlobalStyles;

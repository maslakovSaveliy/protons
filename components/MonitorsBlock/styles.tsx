import styled from "styled-components";

/**
 * Основной контейнер блока, занимающий всю высоту экрана
 */
export const BlockContainer = styled.section`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 150px;
    pointer-events: none;
  }

  &::before {
    top: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0)
    );
    z-index: 1;
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
    z-index: 1;
  }
`;

/**
 * Компонент для отображения видео-фона с плавным появлением
 */
export const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  
  /* Оптимизация для Safari */
  transform: translate3d(0, 0, 0);
  will-change: opacity;
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  -webkit-tap-highlight-color: transparent;
  -webkit-perspective: 1000;
  background-color: transparent;
  
  /* Улучшения для iOS Safari */
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-overflow-scrolling: touch;
  
  /* Скрываем кнопку воспроизведения */
  &::-webkit-media-controls {
    display: none !important;
  }
  
  &::-webkit-media-controls-start-playback-button {
    display: none !important;
  }
  
  /* Важные свойства для предотвращения проблем в iOS Safari */
  &[playsinline] {
    object-fit: cover;
    -webkit-mask-image: -webkit-radial-gradient(white, black);
  }

  &.loaded {
    opacity: 1;
  }
`;

/**
 * Статический фоновый элемент, отображаемый до загрузки видео
 */
export const StaticBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("/videos/poster-desktop.jpg"),
    url("/images/fallback/poster-desktop.jpg");
  background-size: cover;
  background-position: center center;
  z-index: 0;
  transition: opacity 0.8s ease-in-out;
  
  /* Оптимизация для мобильных устройств */
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  will-change: opacity;

  @media (max-width: 775px) {
    background-image: url("/videos/poster-mobile.jpg"),
      url("/images/fallback/poster-mobile.jpg");
    background-position: center center;
  }
`;

/**
 * Индикатор прокрутки в нижней части экрана
 */
export const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-white);
  font-size: 2rem;
  opacity: 0.8;
  z-index: 2;
  cursor: pointer;
  svg {
    animation: bounce 2s infinite;
  }

  @media (max-width: 775px) {
    font-size: 1.5rem;
    flex-direction: column;
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

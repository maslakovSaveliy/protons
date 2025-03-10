"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import ArrowDown from "./icons/ArrowDown";

const BlockContainer = styled.section`
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

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;

  @media (max-width: 768px) {
    object-fit: cover;
    transform-origin: center center;
  }
`;

const BackgroundPoster = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("/images/background.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  z-index: 0;
  transition: opacity 0.5s ease;
`;

const ScrollIndicator = styled.div`
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

  @media (max-width: 768px) {
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

export default function MonitorsBlock() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      const mobileByWidth = window.innerWidth <= 768;
      const mobileByAgent =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      setIsMobile(mobileByWidth || mobileByAgent);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Устанавливаем правильные URL для видео
  const getVideoUrl = useCallback(() => {
    const baseUrl = isMobile
      ? "/videos/background-mobile-optimized"
      : "/videos/background-desktop-optimized";

    // Добавляем временную метку для предотвращения кэширования во время разработки
    // В продакшене эту часть можно удалить
    const cacheBuster =
      process.env.NODE_ENV === "development" ? `?v=${Date.now()}` : "";

    return {
      webm: `${baseUrl}.webm${cacheBuster}`,
    };
  }, [isMobile]);

  // Оптимизированная загрузка видео
  useEffect(() => {
    if (!videoRef.current) return;

    // Настраиваем видео для прогрессивной загрузки
    videoRef.current.preload = "metadata";

    const loadVideo = () => {
      if (!videoRef.current) return;

      // Сначала загружаем только метаданные
      videoRef.current.load();

      // Устанавливаем обработчики для отслеживания загрузки
      const handleCanPlay = () => {
        if (videoRef.current && !videoStarted) {
          // Видео достаточно загрузилось для начала воспроизведения
          videoRef.current
            .play()
            .then(() => {
              setVideoStarted(true);
            })
            .catch((e) => {
              console.error("Ошибка автовоспроизведения:", e);
            });
        }
      };

      videoRef.current.addEventListener("canplay", handleCanPlay);

      return () => {
        videoRef.current?.removeEventListener("canplay", handleCanPlay);
      };
    };

    // Инициализируем загрузку видео после монтирования компонента
    const timer = setTimeout(loadVideo, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [videoStarted]);

  // Обновляем источники при изменении размера экрана
  useEffect(() => {
    if (videoRef.current) {
      const urls = getVideoUrl();

      // Обновляем источники для тега video
      const sources = videoRef.current.getElementsByTagName("source");
      if (sources[0]) sources[0].src = urls.webm;

      // Перезагружаем видео с новыми источниками
      videoRef.current.load();

      // Если видео уже начало воспроизводиться ранее, продолжаем воспроизведение
      if (videoStarted) {
        videoRef.current
          .play()
          .catch((e) => console.error("Ошибка автовоспроизведения:", e));
      }
    }
  }, [isMobile, getVideoUrl, videoStarted]);

  // Обработчик загрузки видео
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  // Функция для скролла к следующему блоку
  const scrollToNextBlock = () => {
    const nextBlock = document.getElementById("EnterJourneyBlock");
    if (nextBlock) {
      nextBlock.scrollIntoView({ behavior: "smooth" });
    } else {
      // Прокрутить на высоту экрана вниз как запасной вариант
      window.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <BlockContainer>
      {/* Фоновое изображение как постер, пока видео не загружено */}
      <BackgroundPoster style={{ opacity: videoLoaded ? 0 : 1 }} />

      {/* Видео-фон с оптимизированной загрузкой */}
      <VideoBackground
        ref={videoRef}
        autoPlay={false} // Отключаем автовоспроизведение, чтобы контролировать его программно
        loop
        muted
        playsInline
        onLoadedData={handleVideoLoaded}
        poster="/images/background.png"
        preload="metadata" // Сначала загружаем только метаданные
      >
        <source type="video/webm" />
      </VideoBackground>

      <ScrollIndicator onClick={scrollToNextBlock}>
        <span>Scroll for more</span>
        <ArrowDown color="var(--color-white)" />
      </ScrollIndicator>
    </BlockContainer>
  );
}

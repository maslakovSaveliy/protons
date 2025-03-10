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
  opacity: 0;
  transition: opacity 1.5s ease-in-out;

  &.loaded {
    opacity: 1;
  }

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
  transition: opacity 1.5s ease-in-out;
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
  const [isMobile, setIsMobile] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);

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
      mp4: `${baseUrl}.mp4${cacheBuster}`,
    };
  }, [isMobile]);

  // Оптимизированная и плавная загрузка видео
  useEffect(() => {
    if (!videoRef.current) return;

    // Настраиваем видео для прогрессивной загрузки
    videoRef.current.preload = "auto";

    const loadVideo = () => {
      if (!videoRef.current) return;

      // Загружаем видео
      videoRef.current.load();

      // Устанавливаем обработчики для отслеживания загрузки и начала воспроизведения
      const handleCanPlay = () => {
        if (videoRef.current && !videoStarted) {
          // Устанавливаем флаг готовности видео, но не меняем его видимость сразу
          setVideoStarted(true);

          // Небольшая задержка перед началом воспроизведения для плавного перехода
          setTimeout(() => {
            videoRef.current
              ?.play()
              .then(() => {
                setVideoStarted(true);
                // Показываем видео только после начала воспроизведения
                setTimeout(() => {
                  if (videoRef.current) {
                    videoRef.current.classList.add("loaded");
                  }
                }, 100);
              })
              .catch((e) => {
                console.error("Ошибка автовоспроизведения:", e);
              });
          }, 300);
        }
      };

      const handleLoadedData = () => {
        // Видео загрузилось, но мы не показываем его сразу
        setVideoStarted(true);
      };

      const handleTimeUpdate = () => {
        // Убеждаемся, что воспроизведение действительно началось перед тем как делать переход
        if (
          !videoStarted &&
          videoRef.current &&
          videoRef.current.currentTime > 0
        ) {
          setVideoStarted(true);
        }
      };

      videoRef.current.addEventListener("canplay", handleCanPlay);
      videoRef.current.addEventListener("loadeddata", handleLoadedData);
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("canplay", handleCanPlay);
          videoRef.current.removeEventListener("loadeddata", handleLoadedData);
          videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };
    };

    // Инициализируем загрузку видео после монтирования компонента с небольшой задержкой
    const timer = setTimeout(loadVideo, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [videoStarted]);

  // Обновляем источники при изменении размера экрана
  useEffect(() => {
    if (videoRef.current) {
      // Сбрасываем состояния при изменении устройства
      setVideoStarted(false);

      if (videoRef.current.classList.contains("loaded")) {
        videoRef.current.classList.remove("loaded");
      }

      const urls = getVideoUrl();

      // Обновляем источники для тега video
      const sources = videoRef.current.getElementsByTagName("source");
      if (sources[0]) sources[0].src = urls.webm;
      if (sources[1]) sources[1].src = urls.mp4;

      // Перезагружаем видео с новыми источниками
      videoRef.current.load();
    }
  }, [isMobile, getVideoUrl]);

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
      {/* Фоновое изображение как постер, которое плавно исчезает, когда видео готово */}
      <BackgroundPoster
        ref={posterRef}
        style={{ opacity: videoStarted ? 0 : 1 }}
      />

      {/* Видео-фон с плавным появлением */}
      <VideoBackground
        ref={videoRef}
        loop
        muted
        playsInline
        poster="/images/background.png"
        preload="auto"
      >
        <source type="video/webm" />
        <source type="video/mp4" />
      </VideoBackground>

      <ScrollIndicator onClick={scrollToNextBlock}>
        <span>Scroll for more</span>
        <ArrowDown color="var(--color-white)" />
      </ScrollIndicator>
    </BlockContainer>
  );
}

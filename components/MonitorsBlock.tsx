"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
// import Image from "next/image";
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

// const MonitorsSetup = styled.div`
//   position: relative;
//   width: 100%;
//   max-width: 1200px;
//   height: 70vh;
//   margin: 0 auto;
//   perspective: 1000px;
//   transform-style: preserve-3d;

//   @media (max-width: 1200px) {
//     max-width: 90%;
//   }

//   @media (max-width: 768px) {
//     height: 80vh;
//   }
// `;

// const Monitor = styled.div<{
//   top: string;
//   left: string;
//   width: string;
//   height: string;
//   zIndex: number;
//   transform?: string;
// }>`
//   position: absolute;
//   top: ${(props) => props.top};
//   left: ${(props) => props.left};
//   width: ${(props) => props.width};
//   height: ${(props) => props.height};
//   background-color: #111;
//   border: 2px solid #222;
//   overflow: hidden;
//   z-index: ${(props) => props.zIndex};
//   box-shadow: 0 0 15px rgba(194, 126, 255, 0.3);
//   transform: ${(props) => props.transform || "none"};
//   transition: transform 0.3s ease;

//   &::after {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: linear-gradient(
//       135deg,
//       rgba(194, 126, 255, 0.05) 0%,
//       transparent 100%
//     );
//     pointer-events: none;
//   }

//   video,
//   img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     opacity: 0.8;
//   }
// `;

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

// const monitorContent = [
//   "/placeholder.svg",
//   "/placeholder.svg",
//   "/placeholder.svg",
//   "/placeholder.svg",
//   "/placeholder.svg",
//   "/placeholder.svg",
// ];

// const monitors = [
//   // Центральный монитор
//   {
//     top: "38%",
//     left: "46%",
//     width: "31%",
//     height: "40%",
//     zIndex: 5,
//     transform:
//       "translate(-50%, -50%) perspective(1000px) rotateY(0deg) rotateX(0deg)",
//   },
//   // Верхний левый
//   {
//     top: "-100px",
//     left: "20px",
//     width: "300px",
//     height: "237px",
//     zIndex: 2,
//     transform:
//       "rotate(10deg) perspective(1000px) rotateY(20deg) rotateX(-10deg) scale(0.95)",
//   },
//   // Верхний правый
//   {
//     top: "10%",
//     left: "70%",
//     width: "30%",
//     height: "25%",
//     zIndex: 2,
//     transform: "perspective(1000px) rotateY(-15deg) rotateX(-5deg) scale(0.95)",
//   },
//   // Нижний левый
//   {
//     top: "70%",
//     left: "10%",
//     width: "30%",
//     height: "25%",
//     zIndex: 2,
//     transform: "perspective(1000px) rotateY(15deg) rotateX(5deg) scale(0.95)",
//   },
//   // Нижний правый
//   {
//     top: "70%",
//     left: "70%",
//     width: "30%",
//     height: "25%",
//     zIndex: 2,
//     transform: "perspective(1000px) rotateY(-15deg) rotateX(5deg) scale(0.95)",
//   },
// ];

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

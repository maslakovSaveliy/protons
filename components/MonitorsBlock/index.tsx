"use client";

import { useRef, useState, useEffect } from "react";
import {
  BlockContainer,
  StaticBackground,
  VideoBackground,
  ScrollIndicator,
} from "./styles";
import ArrowDown from "../icons/ArrowDown";

/**
 * MonitorsBlock - компонент для отображения полноэкранного видео-фона
 */
export default function MonitorsBlock() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  // Определяем тип устройства и браузер
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 775;
      setIsMobile(mobile);
    };
    
    // Определяем, является ли браузер Safari
    const checkIfSafari = () => {
      const isSafariCheck = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isIOSCheck = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsSafari(isSafariCheck || isIOSCheck);
    };
    
    checkIfMobile();
    checkIfSafari();
    
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Получаем URL видео в зависимости от типа устройства
  const getVideoUrl = () => {
    // Определяем тип устройства по актуальной ширине экрана
    // а не по предварительно определенному флагу, что важно для Safari
    const currentIsMobile = window.innerWidth <= 775;
    
    const baseUrl = currentIsMobile
      ? "/videos/background-mobile"
      : "/videos/background-desktop";

    const poster = currentIsMobile
      ? "/videos/poster-mobile.jpg"
      : "/videos/poster-desktop.jpg";

    return {
      mp4: `${baseUrl}.mp4`,
      poster,
    };
  };

  // Обработчик загрузки видео
  const handleVideoLoaded = () => {
    if (videoRef.current) {
      videoRef.current.classList.add("loaded");
      setVideoLoaded(true);
    }
  };

  // Функция для скролла к следующему блоку
  const scrollToNextBlock = () => {
    const nextBlock = document.getElementById("EnterJourneyBlock");
    if (nextBlock) {
      nextBlock.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  // Ручная проверка и запуск видео при взаимодействии пользователя
  const handleUserInteraction = () => {
    if (videoRef.current && !videoLoaded) {
      videoRef.current.play()
        .then(() => {
          handleVideoLoaded();
        })
        .catch(error => {
          console.error("Не удалось воспроизвести видео:", error);
        });
    }
  };

  // Специальное управление видео для Safari
  useEffect(() => {
    if (!isSafari || !videoRef.current) return;

    // Используем events вместо autoPlay специально для Safari
    const playVideo = () => {
      if (videoRef.current) {
        // Обязательно обновляем src для актуального устройства
        const source = videoRef.current.querySelector('source');
        if (source) {
          source.src = getVideoUrl().mp4;
          videoRef.current.poster = getVideoUrl().poster;
          videoRef.current.load();
        }
        
        videoRef.current.play()
          .then(() => {
            handleVideoLoaded();
          })
          .catch(error => {
            console.error("Safari: Не удалось воспроизвести видео:", error);
          });
      }
    };

    // Дополнительные атрибуты и настройки для Safari
    videoRef.current.muted = true;
    videoRef.current.playsInline = true;
    videoRef.current.setAttribute("webkit-playsinline", "true");
    
    // Safari требует пользовательского взаимодействия
    document.addEventListener('click', playVideo, { once: true });
    document.addEventListener('scroll', playVideo, { once: true });
    document.addEventListener('touchstart', playVideo, { once: true });
    
    // Также пытаемся воспроизвести при загрузке
    videoRef.current.addEventListener('canplay', playVideo, { once: true });
    
    return () => {
      document.removeEventListener('click', playVideo);
      document.removeEventListener('scroll', playVideo);
      document.removeEventListener('touchstart', playVideo);
      if (videoRef.current) {
        videoRef.current.removeEventListener('canplay', playVideo);
      }
    };
  }, [isSafari, isMobile]);

  // Стандартное управление видео для не-Safari браузеров
  useEffect(() => {
    if (isSafari || !videoRef.current) return;

    const handleCanPlay = () => {
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => {
            handleVideoLoaded();
          })
          .catch(() => {
            console.log("Автоматическое воспроизведение не удалось, ожидаем взаимодействия пользователя");
          });
      }
    };

    videoRef.current.addEventListener('canplay', handleCanPlay);
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('canplay', handleCanPlay);
      }
    };
  }, [isSafari]);

  // Обновляем видео при изменении устройства
  useEffect(() => {
    if (!videoRef.current) return;
    
    const updateVideoSource = () => {
      const source = videoRef.current?.querySelector('source');
      if (source) {
        const urls = getVideoUrl();
        source.src = urls.mp4;
        if (videoRef.current) {
          videoRef.current.poster = urls.poster;
          videoRef.current.load();
        }
      }
    };
    
    // Первоначальное обновление
    updateVideoSource();
    
    // Обработчики для изменения размера окна и ориентации
    const handleResize = () => {
      updateVideoSource();
    };
    
    const handleOrientationChange = () => {
      setTimeout(() => {
        updateVideoSource();
      }, 300); // Даем время для завершения смены ориентации
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <BlockContainer ref={containerRef} onClick={handleUserInteraction}>
      {/* Статический фоновый элемент, который всегда отображается первым */}
      <StaticBackground style={{ opacity: videoLoaded ? 0 : 1 }} />

      {/* Видео с правильным источником в зависимости от устройства */}
      <VideoBackground
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        poster={getVideoUrl().poster}
        loop
      >
        <source src={getVideoUrl().mp4} type="video/mp4" />
      </VideoBackground>

      <ScrollIndicator onClick={scrollToNextBlock}>
        <span>Scroll for more</span>
        <ArrowDown color="var(--color-white)" />
      </ScrollIndicator>
    </BlockContainer>
  );
}

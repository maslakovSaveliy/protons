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
  /* background-color: #000; */

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
  object-position: center center;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;

  &.loaded {
    opacity: 1;
  }
`;

// Вместо отдельного фона используем Canvas для первого кадра
const FirstFrameCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  z-index: 0;
  transition: opacity 0.8s ease-in-out;
  /* background-color: #000; */
`;

// Статический фоновый элемент
const StaticBackground = styled.div`
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

  @media (max-width: 768px) {
    background-image: url("/videos/poster-mobile.jpg"),
      url("/images/fallback/poster-mobile.jpg");
    background-position: center center;
    transform: scale(1.05);
    transform-origin: center center;
  }
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
  // Начальное определение типа устройства для избежания переключений
  const initialIsMobile =
    typeof window !== "undefined" &&
    (window.innerWidth <= 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ));

  const [isMobile, setIsMobile] = useState(initialIsMobile);
  const [videoStarted, setVideoStarted] = useState(false);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const [deviceDetected, setDeviceDetected] = useState(false);
  const [isFirstPlayCompleted, setIsFirstPlayCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Добавим состояние для отслеживания специальных случаев соотношения сторон
  const [aspectRatioType, setAspectRatioType] = useState<
    "normal" | "wide" | "ultrawide" | "portrait"
  >("normal");

  // Функция определения типа соотношения сторон контейнера
  const detectAspectRatioType = useCallback(
    (containerWidth: number, containerHeight: number) => {
      const ratio = containerWidth / containerHeight;

      if (ratio > 2.1) return "ultrawide"; // Сверхширокие мониторы с соотношением > 21:9
      if (ratio > 1.9) return "wide"; // Широкие экраны (включая 1440x720 с соотношением 2:1)
      if (ratio < 1) return "portrait"; // Портретная ориентация
      return "normal"; // Обычное соотношение сторон (около 16:9)
    },
    []
  );

  // Устанавливаем правильные URL для видео
  const getVideoUrl = useCallback(() => {
    const baseUrl = initialIsMobile
      ? "/videos/background-mobile"
      : "/videos/background-desktop";

    // Добавляем временную метку для предотвращения кэширования во время разработки
    const cacheBuster =
      process.env.NODE_ENV === "development" ? `?v=${Date.now()}` : "";

    // Определяем пути к постерам (основные и резервные)
    const mainPoster = initialIsMobile
      ? "/videos/poster-mobile.jpg"
      : "/videos/poster-desktop.jpg";
    const fallbackPoster = initialIsMobile
      ? "/images/fallback/poster-mobile.jpg"
      : "/images/fallback/poster-desktop.jpg";

    return {
      mp4: `${baseUrl}.mp4${cacheBuster}`,
      poster: posterError ? fallbackPoster : mainPoster,
    };
  }, [initialIsMobile, posterError]);

  // Функция для захвата первого кадра из видео
  const captureFirstFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Проверяем, загружены ли данные видео
    if (video.readyState === 0) {
      // Пробуем еще раз через небольшой промежуток времени
      setTimeout(captureFirstFrame, 100);
      return;
    }

    // Устанавливаем размеры canvas равными видео
    canvas.width = video.videoWidth || 1920; // Используем значение по умолчанию, если размер еще не определен
    canvas.height = video.videoHeight || 1080;

    // Рисуем первый кадр на canvas
    const ctx = canvas.getContext("2d");
    if (ctx) {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setFirstFrameLoaded(true);

        // Применяем стили canvas такие же, как видео
        canvas.style.objectFit = "cover";
        canvas.style.objectPosition = "center center";

        // Дополнительная обработка для мобильных устройств
        if (initialIsMobile) {
          // Для портретной ориентации применяем дополнительные стили
          if (window.innerHeight > window.innerWidth) {
            canvas.style.objectPosition = "50% 50%";
            canvas.style.transform = "scale(1.1)";
            canvas.style.transformOrigin = "center center";
          } else {
            // Для ландшафтной ориентации на мобильных
            canvas.style.objectPosition = "50% 50%";
          }
        }
      } catch (error) {
        console.error("Error:", error);

        // Если возникла ошибка, попробуем еще раз позже
        setTimeout(captureFirstFrame, 500);
      }
    }
  }, [initialIsMobile]);

  // Функция для точного позиционирования видео (объявляем до использования)
  const adjustVideoPosition = useCallback(() => {
    if (!videoRef.current || !containerRef.current) return;

    // Получаем точные размеры элементов
    const containerRect = containerRef.current.getBoundingClientRect();

    // Применяем одинаковые стили к canvas и видео
    if (canvasRef.current) {
      canvasRef.current.style.width = "100%";
      canvasRef.current.style.height = "100%";
      canvasRef.current.style.objectFit = "cover";
      canvasRef.current.style.objectPosition = "center center";
    }

    // Сначала сбрасываем все предыдущие трансформации
    videoRef.current.style.transform = "none";
    videoRef.current.style.width = "100%";
    videoRef.current.style.height = "100%";
    videoRef.current.style.top = "0";
    videoRef.current.style.left = "0";
    videoRef.current.style.objectFit = "cover";
    videoRef.current.style.objectPosition = "center center";

    // Определяем тип соотношения сторон
    const currentAspectRatioType = detectAspectRatioType(
      containerRect.width,
      containerRect.height
    );
    if (currentAspectRatioType !== aspectRatioType) {
      setAspectRatioType(currentAspectRatioType);
    }

    // Специальная обработка для мобильных устройств
    if (initialIsMobile) {
      // Корректируем позиционирование для мобильных устройств
      if (currentAspectRatioType === "portrait") {
        // Для портретной ориентации на мобильных - центрируем контент
        videoRef.current.style.objectPosition = "50% 50%";
        videoRef.current.style.objectFit = "cover";

        // Применяем небольшой масштаб для лучшего заполнения
        videoRef.current.style.transform = "scale(1.1)";
        videoRef.current.style.transformOrigin = "center center";

        // Такие же стили для canvas
        if (canvasRef.current) {
          canvasRef.current.style.objectPosition = "50% 50%";
          canvasRef.current.style.objectFit = "cover";
          canvasRef.current.style.transform = "scale(1.1)";
          canvasRef.current.style.transformOrigin = "center center";
        }
      } else {
        // Для ландшафтной ориентации на мобильных устройствах
        videoRef.current.style.objectPosition = "50% 50%";
        videoRef.current.style.objectFit = "cover";

        // Такие же стили для canvas
        if (canvasRef.current) {
          canvasRef.current.style.objectPosition = "50% 50%";
          canvasRef.current.style.objectFit = "cover";
        }
      }

      // Применяем те же стили к статическому фону
      const staticBg = document.querySelector<HTMLElement>(
        '[class^="MonitorsBlock__StaticBackground"]'
      );
      if (staticBg) {
        staticBg.style.backgroundPosition = "50% 50%";
        staticBg.style.backgroundSize = "cover";
      }
    }
    // Специальная обработка для различных соотношений сторон на десктопе
    else if (
      currentAspectRatioType === "wide" ||
      currentAspectRatioType === "ultrawide"
    ) {
      // Для широких экранов делаем специальную настройку
      if (videoRef.current.videoWidth && videoRef.current.videoHeight) {
        const videoNativeAspect =
          videoRef.current.videoWidth / videoRef.current.videoHeight;
        const scaledHeight = containerRect.width / videoNativeAspect;
        const yOffset = (containerRect.height - scaledHeight) / 2;

        // Принудительно задаем нужные пропорции для видео
        videoRef.current.style.width = "100%";
        videoRef.current.style.height = "auto";
        videoRef.current.style.position = "absolute";
        videoRef.current.style.top = `${yOffset}px`;
        videoRef.current.style.objectFit = "fill";

        // Применяем те же стили к canvas
        if (canvasRef.current) {
          canvasRef.current.style.width = "100%";
          canvasRef.current.style.height = "auto";
          canvasRef.current.style.position = "absolute";
          canvasRef.current.style.top = `${yOffset}px`;
          canvasRef.current.style.objectFit = "fill";
        }

        // Дополнительный масштаб для сверх-широких экранов
        if (currentAspectRatioType === "ultrawide") {
          const additionalScale = 1.1; // Немного больше масштабирование
          videoRef.current.style.transform = `scale(${additionalScale})`;
          videoRef.current.style.transformOrigin = "center center";

          if (canvasRef.current) {
            canvasRef.current.style.transform = `scale(${additionalScale})`;
            canvasRef.current.style.transformOrigin = "center center";
          }
        }
      }
    }
  }, [initialIsMobile, aspectRatioType, detectAspectRatioType]);

  // Оптимизированная потоковая загрузка видео
  useEffect(() => {
    // Если тип устройства еще не определен окончательно, не начинаем загрузку
    if (!deviceDetected) return;

    if (!videoRef.current) return;

    // Настраиваем параметры для потоковой загрузки
    videoRef.current.preload = "auto";
    videoRef.current.load();

    // Применяем позиционирование видео
    adjustVideoPosition();

    const handleCanPlayThrough = () => {
      // Видео загрузило достаточно данных для плавного воспроизведения
      if (videoRef.current && !videoStarted) {
        // Захватываем первый кадр перед воспроизведением, если он еще не захвачен
        if (!firstFrameLoaded) {
          captureFirstFrame();
        }

        videoRef.current
          .play()
          .then(() => {
            // Делаем видео видимым
            videoRef.current?.classList.add("loaded");
            setVideoStarted(true);

            // Добавляем небольшую задержку перед финальной настройкой позиции
            setTimeout(() => {
              adjustVideoPosition();
            }, 50);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };

    const handleLoadStart = () => {
      // Видео начало загружаться
    };

    const handlePlaying = () => {
      // Видео начало воспроизводиться
      setVideoStarted(true);
      if (videoRef.current) {
        videoRef.current.classList.add("loaded");
      }
    };

    // Обработчик загрузки метаданных видео - вызывается, когда известны размеры видео
    const handleLoadedMetadata = () => {
      // После получения метаданных захватываем первый кадр
      captureFirstFrame();

      // Переустанавливаем позицию
      adjustVideoPosition();
    };

    // Обработчик окончания видео
    const handleEnded = () => {
      if (videoRef.current) {
        // Отмечаем, что первое полное воспроизведение завершено
        setIsFirstPlayCompleted(true);

        // Перематываем видео на начало
        videoRef.current.currentTime = 0;

        // Запускаем видео снова
        videoRef.current.play().catch((error) => {
          console.error("Error:", error);
        });
      }
    };

    // Обработчик для зацикливания первой секунды
    const handleLoopFirstSecond = () => {
      if (
        videoRef.current &&
        isFirstPlayCompleted &&
        videoRef.current.currentTime >= (initialIsMobile ? 0.1 : 1.0)
      ) {
        // Если воспроизведение достигло заданного времени и первое воспроизведение завершено,
        // перематываем на начало
        videoRef.current.currentTime = 0;
      }
    };

    // События для отслеживания потоковой загрузки
    videoRef.current.addEventListener("canplay", handleCanPlayThrough);
    videoRef.current.addEventListener("loadstart", handleLoadStart);
    videoRef.current.addEventListener("playing", handlePlaying);
    videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoRef.current.addEventListener("ended", handleEnded);
    videoRef.current.addEventListener("timeupdate", handleLoopFirstSecond);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("canplay", handleCanPlayThrough);
        videoRef.current.removeEventListener("loadstart", handleLoadStart);
        videoRef.current.removeEventListener("playing", handlePlaying);
        videoRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoRef.current.removeEventListener("ended", handleEnded);
        videoRef.current.removeEventListener(
          "timeupdate",
          handleLoopFirstSecond
        );
      }
    };
  }, [
    videoStarted,
    initialIsMobile,
    adjustVideoPosition,
    captureFirstFrame,
    firstFrameLoaded,
    deviceDetected,
    isFirstPlayCompleted,
  ]);

  // Добавляем отдельный эффект для отслеживания и зацикливания первой секунды
  useEffect(() => {
    // Запускаем только если видео было полностью воспроизведено
    if (!isFirstPlayCompleted || !videoRef.current) return;

    // Функция для зацикливания первой секунды
    const loopFirstSecond = () => {
      if (
        videoRef.current &&
        videoRef.current.currentTime >= (initialIsMobile ? 0.1 : 1.0)
      ) {
        videoRef.current.currentTime = 0;
      }
    };

    // Добавляем обработчик события обновления времени
    videoRef.current.addEventListener("timeupdate", loopFirstSecond);

    // Если видео остановлено, запускаем его
    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => {
        console.error("Error:", err);
      });
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", loopFirstSecond);
      }
    };
  }, [isFirstPlayCompleted, initialIsMobile]);

  // Определение типа устройства - выполняем только один раз при монтировании
  useEffect(() => {
    const detectDevice = () => {
      const mobileByWidth = window.innerWidth <= 768;
      const mobileByAgent =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      const newIsMobile = mobileByWidth || mobileByAgent;
      setIsMobile(newIsMobile);
      setDeviceDetected(true); // Помечаем, что устройство определено
    };

    // Выполняем определение устройства сразу после монтирования компонента
    detectDevice();
  }, []);

  // Определяем мобильное устройство и отслеживаем изменения размера экрана
  useEffect(() => {
    // Не запускаем этот эффект, пока не определен тип устройства
    if (!deviceDetected) return;

    const checkMobileAndOrientation = () => {
      // Обновляем состояние только если оно изменилось
      if (isMobile !== initialIsMobile) {
        setIsMobile(initialIsMobile);
      }

      // Определяем тип соотношения сторон
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newAspectRatioType = detectAspectRatioType(
          rect.width,
          rect.height
        );

        // Обновляем состояние только если оно изменилось
        if (newAspectRatioType !== aspectRatioType) {
          setAspectRatioType(newAspectRatioType);
        }
      }

      // Обновляем позиционирование при изменении размера окна
      adjustVideoPosition();

      // Дополнительная коррекция для мобильных устройств при изменении ориентации
      if (initialIsMobile) {
        // Находим элемент статического фона
        const staticBg = document.querySelector<HTMLElement>(
          '[class^="MonitorsBlock__StaticBackground"]'
        );
        if (staticBg) {
          // Исправляем позиционирование в зависимости от ориентации
          const isPortrait = window.innerHeight > window.innerWidth;

          staticBg.style.backgroundPosition = "50% 50%";
          staticBg.style.transform = isPortrait ? "scale(1.1)" : "scale(1.05)";
        }
      }
    };

    checkMobileAndOrientation();
    window.addEventListener("resize", checkMobileAndOrientation);
    window.addEventListener("orientationchange", checkMobileAndOrientation);

    return () => {
      window.removeEventListener("resize", checkMobileAndOrientation);
      window.removeEventListener(
        "orientationchange",
        checkMobileAndOrientation
      );
    };
  }, [
    detectAspectRatioType,
    adjustVideoPosition,
    isMobile,
    aspectRatioType,
    deviceDetected,
  ]);

  // Настраиваем наблюдение за изменениями размеров элементов
  useEffect(() => {
    if (!containerRef.current) return;

    // Создаем ResizeObserver для контейнера
    const resizeObserver = new ResizeObserver(() => {
      // При изменении размера контейнера, вызываем adjustVideoPosition
      adjustVideoPosition();
    });

    // Наблюдаем за контейнером
    resizeObserver.observe(containerRef.current);

    // Очищаем наблюдателя при размонтировании
    return () => {
      resizeObserver.disconnect();
    };
  }, [adjustVideoPosition]);

  // Предзагрузка постеров
  useEffect(() => {
    const preloadPoster = () => {
      const img = new Image();
      img.src = getVideoUrl().poster;
      img.onload = () => {
        setPosterError(false);

        // Дополнительная логика для оптимизации позиции постера на мобильных устройствах
        if (initialIsMobile) {
          // Находим элемент статического фона
          const staticBg = document.querySelector<HTMLElement>(
            '[class^="MonitorsBlock__StaticBackground"]'
          );
          if (staticBg) {
            // В портретной ориентации корректируем позиционирование
            if (window.innerHeight > window.innerWidth) {
              staticBg.style.backgroundPosition = "50% 50%";
              staticBg.style.transform = "scale(1.1)";
            } else {
              // В ландшафтной ориентации на мобильных
              staticBg.style.backgroundPosition = "50% 50%";
              staticBg.style.transform = "scale(1.05)";
            }
          }
        }
      };
      img.onerror = (error) => {
        console.error("Error:", error);
        setPosterError(true);
      };
    };

    preloadPoster();
  }, [getVideoUrl, initialIsMobile]);

  // Обновляем источники при изменении размера экрана
  useEffect(() => {
    if (videoRef.current) {
      // Сбрасываем состояния при изменении устройства
      setVideoStarted(false);
      setFirstFrameLoaded(false);

      if (videoRef.current.classList.contains("loaded")) {
        videoRef.current.classList.remove("loaded");
      }

      const urls = getVideoUrl();

      // Устанавливаем атрибуты для потоковой загрузки
      videoRef.current.src = urls.mp4;

      // Предварительно загружаем несколько секунд видео, затем запускаем воспроизведение
      videoRef.current.load();

      // Обновляем позиционирование при изменении источника
      adjustVideoPosition();
    }
  }, [initialIsMobile, getVideoUrl, adjustVideoPosition]);

  // Обработка изменения ориентации устройства
  useEffect(() => {
    let lastOrientation: "portrait" | "landscape" =
      window.innerHeight > window.innerWidth ? "portrait" : "landscape";

    const handleOrientationChange = () => {
      const currentOrientation =
        window.innerHeight > window.innerWidth ? "portrait" : "landscape";

      // Если ориентация изменилась
      if (lastOrientation !== currentOrientation) {
        lastOrientation = currentOrientation;

        // Для мобильных устройств может потребоваться замена видео
        if (initialIsMobile) {
          // Сбрасываем состояния
          setVideoStarted(false);
          setFirstFrameLoaded(false);

          // Обновляем источник видео
          if (videoRef.current) {
            const urls = getVideoUrl();
            videoRef.current.src = urls.mp4;
            videoRef.current.poster = urls.poster;
            videoRef.current.load();
          }

          // Принудительно корректируем позиционирование
          setTimeout(() => {
            adjustVideoPosition();
          }, 300);
        }
      }
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    // Также отслеживаем resize для устройств, которые не поддерживают событие orientationchange
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, [initialIsMobile, getVideoUrl, adjustVideoPosition]);

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
    <BlockContainer ref={containerRef}>
      {/* Статический фоновый элемент, который всегда отображается первым */}
      <StaticBackground style={{ opacity: videoStarted ? 0 : 1 }} />

      {/* Canvas для первого кадра вместо фонового изображения */}
      <FirstFrameCanvas
        ref={canvasRef}
        style={{
          opacity: firstFrameLoaded && !videoStarted ? 1 : 0,
          display: firstFrameLoaded ? "block" : "none",
        }}
      />

      {/* Видео-фон с плавным появлением и потоковой загрузкой */}
      <VideoBackground
        ref={videoRef}
        muted
        playsInline
        poster={getVideoUrl().poster}
        preload="auto"
        autoPlay
      />

      <ScrollIndicator onClick={scrollToNextBlock}>
        <span>Scroll for more</span>
        <ArrowDown color="var(--color-white)" />
      </ScrollIndicator>
    </BlockContainer>
  );
}

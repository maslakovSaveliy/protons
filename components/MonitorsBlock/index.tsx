"use client";

import { useRef, useState, useEffect } from "react";
import { useVideoBackground } from "./hooks/useVideoBackground";
import { useDeviceDetection } from "./hooks/useDeviceDetection";
import { useAspectRatio } from "./hooks/useAspectRatio";
import { useOrientationChange } from "./hooks/useOrientationChange";
import {
  BlockContainer,
  StaticBackground,
  FirstFrameCanvas,
  VideoBackground,
  ScrollIndicator,
} from "./styles";
import ArrowDown from "../icons/ArrowDown";

/**
 * MonitorsBlock - компонент для отображения полноэкранного видео-фона с адаптивным поведением
 *
 * Компонент обеспечивает:
 * - Адаптивное отображение видео на разных устройствах и ориентациях
 * - Плавную загрузку с отображением статического фона до загрузки видео
 * - Захват первого кадра для быстрого отображения
 * - Оптимизацию воспроизведения видео (зацикливание первой секунды)
 * - Корректное масштабирование для разных соотношений сторон
 */
export default function MonitorsBlock() {
  // Refs для DOM-элементов
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Состояния для управления видео при изменении ориентации
  const [videoStarted, setVideoStarted] = useState(false);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [manuallyStarted, setManuallyStarted] = useState(false);

  // Определение типа устройства
  const { initialIsMobile, isMobile, deviceDetected } = useDeviceDetection();

  // Определение и отслеживание соотношения сторон
  const { aspectRatioType, detectAspectRatioType } = useAspectRatio();

  // Управление видео-фоном
  const {
    videoStarted: videoBackgroundStarted,
    firstFrameLoaded: frameLoaded,
    getVideoUrl,
    adjustVideoPosition,
    startVideoManually,
  } = useVideoBackground({
    videoRef,
    canvasRef,
    containerRef,
    initialIsMobile,
    deviceDetected,
    aspectRatioType,
    detectAspectRatioType,
  });

  // Синхронизируем состояния
  useEffect(() => {
    setVideoStarted(videoBackgroundStarted);
    setFirstFrameLoaded(frameLoaded);
  }, [videoBackgroundStarted, frameLoaded]);

  // Обработка изменения ориентации устройства
  useOrientationChange({
    initialIsMobile,
    videoRef,
    getVideoUrl,
    adjustVideoPosition,
    setVideoStarted: () => {},
    setFirstFrameLoaded: () => {},
  });

  // Функция для запуска видео при взаимодействии пользователя
  const handleUserInteraction = () => {
    if (isMobile && !manuallyStarted && videoRef.current) {
      startVideoManually();
      setManuallyStarted(true);
    }
  };

  // Запуск видео при скролле на мобильных устройствах
  useEffect(() => {
    const handleScroll = () => handleUserInteraction();

    if (isMobile && !manuallyStarted) {
      window.addEventListener("scroll", handleScroll, { once: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile, manuallyStarted]);

  // Автоматический запуск видео при касании на мобильных устройствах
  useEffect(() => {
    const handleTouch = () => handleUserInteraction();

    if (isMobile && !manuallyStarted) {
      window.addEventListener("touchstart", handleTouch, { once: true });
    }

    return () => {
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [isMobile, manuallyStarted]);

  // Функция для скролла к следующему блоку
  const scrollToNextBlock = () => {
    // Попытка запустить видео при взаимодействии пользователя
    handleUserInteraction();

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
    <BlockContainer ref={containerRef} onClick={handleUserInteraction}>
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
        playsInline={true}
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

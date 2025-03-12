import { useState, useEffect, useCallback, RefObject } from "react";
import { AspectRatioType } from "./useAspectRatio";

/**
 * Параметры хука useVideoBackground
 */
interface UseVideoBackgroundProps {
    videoRef: RefObject<HTMLVideoElement>;
    canvasRef: RefObject<HTMLCanvasElement>;
    containerRef: RefObject<HTMLElement>;
    initialIsMobile: boolean;
    deviceDetected: boolean;
    aspectRatioType: AspectRatioType;
    detectAspectRatioType: (width: number, height: number) => AspectRatioType;
}

/**
 * Хук для управления видео-фоном
 * 
 * @param {UseVideoBackgroundProps} props - Параметры хука
 * @returns {Object} Объект с состояниями и функциями для управления видео-фоном
 */
export function useVideoBackground({
    videoRef,
    canvasRef,
    containerRef,
    initialIsMobile,
    deviceDetected,
    detectAspectRatioType,
}: UseVideoBackgroundProps) {
    const [videoStarted, setVideoStarted] = useState(false);
    const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
    const [posterError, setPosterError] = useState(false);
    const [isFirstPlayCompleted, setIsFirstPlayCompleted] = useState(false);

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
                        // canvas.style.objectPosition = "50% 50%";
                        // canvas.style.transform = "scale(1.1)";
                        // canvas.style.transformOrigin = "center center";
                    } else {
                        // Для ландшафтной ориентации на мобильных
                        // canvas.style.objectPosition = "50% 50%";
                    }
                }
            } catch (error) {
                console.error("Error:", error);

                // Если возникла ошибка, попробуем еще раз позже
                setTimeout(captureFirstFrame, 500);
            }
        }
    }, [initialIsMobile]);

    // Функция для точного позиционирования видео
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

        // Специальная обработка для мобильных устройств
        if (initialIsMobile) {
            // Корректируем позиционирование для мобильных устройств
            if (currentAspectRatioType === "portrait") {
                // Для портретной ориентации на мобильных - центрируем контент
                videoRef.current.style.objectPosition = "50% 50%";
                videoRef.current.style.objectFit = "cover";

                // Применяем небольшой масштаб для лучшего заполнения
                // videoRef.current.style.transform = "scale(1.1)";
                videoRef.current.style.transformOrigin = "center center";

                // Такие же стили для canvas
                if (canvasRef.current) {
                    canvasRef.current.style.objectPosition = "50% 50%";
                    canvasRef.current.style.objectFit = "cover";
                    // canvasRef.current.style.transform = "scale(1.1)";
                    canvasRef.current.style.transformOrigin = "center center";
                }
            } else {
                // Для ландшафтной ориентации на мобильных устройствах
                // videoRef.current.style.objectPosition = "50% 50%";
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
                    // videoRef.current.style.transform = `scale(${additionalScale})`;
                    videoRef.current.style.transformOrigin = "center center";

                    if (canvasRef.current) {
                        // canvasRef.current.style.transform = `scale(${additionalScale})`;
                        canvasRef.current.style.transformOrigin = "center center";
                    }
                }
            }
        }
    }, [initialIsMobile, detectAspectRatioType]);

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

                // Для Safari и iOS устройств
                const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

                if (isIOS || isSafari) {
                    videoRef.current.setAttribute('playsinline', 'true');
                    videoRef.current.setAttribute('webkit-playsinline', 'true');
                    videoRef.current.muted = true;
                    videoRef.current.volume = 0;
                }

                const playPromise = videoRef.current.play();
                
                if (playPromise !== undefined) {
                    playPromise
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
                            
                            // Для Safari пробуем еще один подход
                            if (isIOS || isSafari) {
                                // Отложенная попытка воспроизведения для Safari
                                setTimeout(() => {
                                    if (videoRef.current) {
                                        videoRef.current.play()
                                            .then(() => {
                                                videoRef.current?.classList.add("loaded");
                                                setVideoStarted(true);
                                            })
                                            .catch(() => {
                                                // Если снова не удалось, показываем хотя бы первый кадр
                                                setFirstFrameLoaded(true);
                                            });
                                    }
                                }, 100);
                            }
                        });
                }
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
                            // staticBg.style.transform = "scale(1.1)";
                        } else {
                            // В ландшафтной ориентации на мобильных
                            staticBg.style.backgroundPosition = "50% 50%";
                            // staticBg.style.transform = "scale(1.05)";
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

            // Находим элемент source внутри видео
            const sourceElement = videoRef.current.querySelector('source');
            if (sourceElement) {
                sourceElement.src = urls.mp4;
                // Устанавливаем постер на само видео
                videoRef.current.poster = urls.poster;
                // Обновляем видео, чтобы применить новый источник
                videoRef.current.load();
            }

            // Обновляем позиционирование при изменении источника
            adjustVideoPosition();
        }
    }, [initialIsMobile, getVideoUrl, adjustVideoPosition]);

    // Функция для ручного запуска видео (для мобильных устройств)
    const startVideoManually = useCallback(() => {
        if (!videoRef.current || videoStarted) return;

        // Для iOS устройств делаем дополнительные настройки для Safari
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isIOS || isSafari) {
            videoRef.current.muted = true;
            videoRef.current.volume = 0;
            
            // Дополнительно для Safari
            videoRef.current.setAttribute('playsinline', 'true');
            videoRef.current.setAttribute('webkit-playsinline', 'true');
        }

        // Захватываем первый кадр, если он еще не захвачен
        if (!firstFrameLoaded) {
            captureFirstFrame();
        }

        // Запускаем воспроизведение видео с обработкой для Safari
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Делаем видео видимым
                    videoRef.current?.classList.add("loaded");
                    setVideoStarted(true);
                })
                .catch((error) => {
                    console.error("Ошибка при ручном запуске видео:", error);
                    
                    // Для Safari: пробуем еще один способ запуска
                    if (isIOS || isSafari) {
                        setTimeout(() => {
                            if (videoRef.current) {
                                videoRef.current.play()
                                    .then(() => {
                                        videoRef.current?.classList.add("loaded");
                                        setVideoStarted(true);
                                    })
                                    .catch((retryError) => {
                                        console.error("Повторная ошибка:", retryError);
                                        // Если не удалось запустить видео, хотя бы отображаем первый кадр
                                        setFirstFrameLoaded(true);
                                    });
                            }
                        }, 100);
                    } else {
                        // Если не удалось запустить видео, хотя бы отображаем первый кадр
                        setFirstFrameLoaded(true);
                    }
                });
        }
    }, [videoStarted, firstFrameLoaded, captureFirstFrame]);

    return {
        videoStarted,
        setVideoStarted,
        firstFrameLoaded,
        setFirstFrameLoaded,
        posterError,
        isFirstPlayCompleted,
        getVideoUrl,
        adjustVideoPosition,
        captureFirstFrame,
        startVideoManually,
    };
} 
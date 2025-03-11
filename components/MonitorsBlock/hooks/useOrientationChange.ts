import { useEffect, RefObject } from "react";

/**
 * Параметры хука useOrientationChange
 */
interface UseOrientationChangeProps {
    initialIsMobile: boolean;
    videoRef: RefObject<HTMLVideoElement>;
    getVideoUrl: () => { mp4: string; poster: string };
    adjustVideoPosition: () => void;
    setVideoStarted: (value: boolean) => void;
    setFirstFrameLoaded: (value: boolean) => void;
}

/**
 * Хук для обработки изменения ориентации устройства
 * 
 * @param {UseOrientationChangeProps} props - Параметры хука
 */
export function useOrientationChange({
    initialIsMobile,
    videoRef,
    getVideoUrl,
    adjustVideoPosition,
    setVideoStarted,
    setFirstFrameLoaded,
}: UseOrientationChangeProps) {
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
    }, [
        initialIsMobile,
        videoRef,
        getVideoUrl,
        adjustVideoPosition,
        setVideoStarted,
        setFirstFrameLoaded,
    ]);
} 
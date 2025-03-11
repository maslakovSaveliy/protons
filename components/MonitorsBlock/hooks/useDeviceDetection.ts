import { useState, useEffect } from "react";

/**
 * Хук для определения типа устройства (мобильное/десктоп)
 * 
 * @returns {Object} Объект с информацией о типе устройства
 */
export function useDeviceDetection() {
    // Начальное определение типа устройства для избежания переключений
    const initialIsMobile =
        typeof window !== "undefined" &&
        (window.innerWidth <= 768 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ));

    const [isMobile, setIsMobile] = useState(initialIsMobile);
    const [deviceDetected, setDeviceDetected] = useState(false);

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

    return { isMobile, initialIsMobile, deviceDetected };
} 
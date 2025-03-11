import { useState, useCallback } from "react";

/**
 * Типы соотношения сторон экрана
 */
export type AspectRatioType = "normal" | "wide" | "ultrawide" | "portrait";

/**
 * Хук для определения и отслеживания соотношения сторон экрана
 * 
 * @returns {Object} Объект с информацией о соотношении сторон и функцией для его определения
 */
export function useAspectRatio() {
    // Состояние для отслеживания специальных случаев соотношения сторон
    const [aspectRatioType, setAspectRatioType] = useState<AspectRatioType>("normal");

    // Функция определения типа соотношения сторон контейнера
    const detectAspectRatioType = useCallback(
        (containerWidth: number, containerHeight: number): AspectRatioType => {
            const ratio = containerWidth / containerHeight;

            if (ratio > 2.1) return "ultrawide"; // Сверхширокие мониторы с соотношением > 21:9
            if (ratio > 1.9) return "wide"; // Широкие экраны (включая 1440x720 с соотношением 2:1)
            if (ratio < 1) return "portrait"; // Портретная ориентация
            return "normal"; // Обычное соотношение сторон (около 16:9)
        },
        []
    );

    return { aspectRatioType, setAspectRatioType, detectAspectRatioType };
} 
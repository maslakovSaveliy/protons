"use client";

import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Image from "next/image";
import ArrowDown from "./icons/ArrowDown";

const BlockContainer = styled.section`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  background-image: url("/images/background.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
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
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  }
`;

const MonitorsSetup = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 70vh;
  margin: 0 auto;
  perspective: 1000px;
  transform-style: preserve-3d;

  @media (max-width: 1200px) {
    max-width: 90%;
  }

  @media (max-width: 768px) {
    height: 80vh;
  }
`;

const Monitor = styled.div<{
  top: string;
  left: string;
  width: string;
  height: string;
  zIndex: number;
  transform?: string;
}>`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: #111;
  border: 2px solid #222;
  overflow: hidden;
  z-index: ${(props) => props.zIndex};
  box-shadow: 0 0 15px rgba(194, 126, 255, 0.3);
  transform: ${(props) => props.transform || "none"};
  transition: transform 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(194, 126, 255, 0.05) 0%,
      transparent 100%
    );
    pointer-events: none;
  }

  video,
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8;
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
  z-index: 1;

  svg {
    animation: bounce 2s infinite;
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

// Sample video/GIF URLs for the monitors
const monitorContent = [
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
];

// Монитор получает абсолютные координаты и трансформации для создания эффекта 3D
const monitors = [
  // Центральный монитор
  {
    top: "38%",
    left: "46%",
    width: "31%",
    height: "40%",
    zIndex: 5,
    transform:
      "translate(-50%, -50%) perspective(1000px) rotateY(0deg) rotateX(0deg)",
  },
  // Верхний левый
  {
    top: "-100px",
    left: "20px",
    width: "300px",
    height: "237px",
    zIndex: 2,
    transform:
      "rotate(10deg) perspective(1000px) rotateY(20deg) rotateX(-10deg) scale(0.95)",
  },
  // Верхний правый
  {
    top: "10%",
    left: "70%",
    width: "30%",
    height: "25%",
    zIndex: 2,
    transform: "perspective(1000px) rotateY(-15deg) rotateX(-5deg) scale(0.95)",
  },
  // Нижний левый
  {
    top: "70%",
    left: "10%",
    width: "30%",
    height: "25%",
    zIndex: 2,
    transform: "perspective(1000px) rotateY(15deg) rotateX(5deg) scale(0.95)",
  },
  // Нижний правый
  {
    top: "70%",
    left: "70%",
    width: "30%",
    height: "25%",
    zIndex: 2,
    transform: "perspective(1000px) rotateY(-15deg) rotateX(5deg) scale(0.95)",
  },
];

export default function MonitorsBlock() {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Rotate through content
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentContentIndex((prev) => (prev + 1) % monitorContent.length);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <BlockContainer>
      {/* <MonitorsSetup>
        {monitors.map((monitor, index) => (
          <Monitor
            key={index}
            top={monitor.top}
            left={monitor.left}
            width={monitor.width}
            height={monitor.height}
            zIndex={monitor.zIndex}
            transform={monitor.transform}
          >
            <Image
              src={
                monitorContent[
                  (currentContentIndex + index) % monitorContent.length
                ] || "/placeholder.svg"
              }
              alt={`Monitor content ${index}`}
              width={600}
              height={400}
              style={{ filter: "hue-rotate(270deg) brightness(0.8)" }}
            />
          </Monitor>
        ))}
      </MonitorsSetup> */}

      <ScrollIndicator>
        <span>Scroll for more</span>
        <ArrowDown color="var(--color-white)" />
      </ScrollIndicator>
    </BlockContainer>
  );
}

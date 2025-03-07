"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import EnterButton from "./EnterButton";

const BlockContainer = styled.section`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #2e0738;
  background-image: url("/images/bg.png");
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
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0)
    );
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
  }
`;

const Title = styled.h2`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 4rem;
  color: var(--color-white);
  text-align: center;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
    margin-bottom: 2.5rem;
  }
`;

const EnterKeyContainer = styled(motion.div)`
  position: relative;
  cursor: pointer;
  z-index: 1;
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const GlowEffect = styled(motion.div)`
  position: absolute;
  z-index: -1;
  opacity: 0.5;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  & svg {
    width: 100%;
    height: 100%;
    filter: blur(20px);
    opacity: 0.7;

    @media (max-width: 768px) {
      filter: blur(15px);
    }

    @media (max-width: 480px) {
      filter: blur(10px);
    }
  }
`;

export default function EnterJourneyBlock() {
  const [isPressed, setIsPressed] = useState(false);

  const handleKeyPress = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 500);
  };

  const containerVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
    pressed: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  const glowVariants = {
    initial: {
      opacity: 0.5,
    },
    hover: {
      opacity: 0.8,
      scale: 1.1,
    },
    tap: {
      opacity: 1,
      scale: 1.2,
    },
    pressed: {
      opacity: 1,
      scale: 1.3,
      transition: { duration: 0.3 },
    },
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleKeyPress();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <BlockContainer>
      <Title>Enter The Journey</Title>

      <EnterKeyContainer
        variants={containerVariants}
        whileHover="hover"
        whileTap="tap"
        animate={isPressed ? "pressed" : ""}
        onClick={handleKeyPress}
        onKeyDown={(e) => e.key === "Enter" && handleKeyPress()}
        tabIndex={0}
        role="button"
        aria-label="Enter the journey"
      >
        <GlowEffect
          variants={glowVariants}
          initial="initial"
          animate={isPressed ? "pressed" : "initial"}
          whileHover="hover"
          whileTap="tap"
        >
          <EnterButton />
        </GlowEffect>

        <EnterButton />
      </EnterKeyContainer>
    </BlockContainer>
  );
}

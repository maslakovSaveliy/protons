"use client";

import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
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
  }
`;

const EnterKeyContainer = styled(motion.div)`
  position: relative;
  width: 352px;
  height: 156px;
  cursor: pointer;
  z-index: 1;
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const EnterKey = styled(motion.div)`
  position: relative;
  width: 352px;
  height: 156px;
  background-color: rgba(194, 126, 255, 0.2);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c27eff;
  font-size: 2.5rem;
  font-weight: 600;
  box-shadow: 0 0 30px rgba(194, 126, 255, 0.5);
  overflow: hidden;
  z-index: 1;

  background-image: url("/images/enter.png");
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 100%
    );
    pointer-events: none;
  }
`;

const GlowEffect = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  filter: blur(20px);
  background-color: rgba(194, 126, 255, 0.3);
  z-index: -1;
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

  return (
    <BlockContainer>
      <Title>Enter The Journey</Title>

      <EnterKeyContainer
        variants={containerVariants}
        whileHover="hover"
        whileTap="tap"
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
        />

        <EnterKey></EnterKey>
      </EnterKeyContainer>
    </BlockContainer>
  );
}

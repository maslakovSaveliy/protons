"use client";

import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import LogoIcon from "./icons/Logo";
import { motion, AnimatePresence } from "framer-motion";
import Curve from "./icons/Curve";
import { useRouter } from "next/navigation";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 46.56px 76px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  background-color: linear-gradient(to right, #1e1e1e, #111111);
  align-items: center;

  & > *:first-child {
    justify-self: start;
  }

  & > *:nth-child(2) {
    justify-self: center;
  }

  & > *:last-child {
    justify-self: end;
  }
`;

const CurveIcon = styled(Curve)<{ isOpen: boolean }>`
  transform: rotate(${(props) => (props.isOpen ? "90deg" : "0deg")});
`;

const Logo = styled.div`
  padding: 2.56px 0;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const NavItem = styled.div`
  position: relative;

  a {
    color: var(--color-white);
    text-decoration: none;
    font-size: var(--font-size-body-l);
    line-height: var(--line-height-body-l);
    transition: all 0.3s ease;
    &:hover {
      color: var(--color-violet-accent);
    }
  }
`;

const DropdownContainer = styled.div<{ isOpen: boolean }>`
  position: relative;
  border-radius: 0.5rem;
  background: ${(props) =>
    props.isOpen ? "var(--color-white)" : "transparent"};
  transition: background-color 0.3s ease, border-radius 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.isOpen ? "var(--color-white)" : "transparent"};
  }
`;

const DropdownButton = styled.button<{ isOpen: boolean }>`
  background: transparent;
  border: none;
  width: 100%;
  color: ${(props) =>
    props.isOpen ? "var(--color-black)" : "var(--color-white)"};
  font-size: var(--font-size-body-l);
  line-height: var(--line-height-body-l);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  text-align: left;
  cursor: pointer;
  transition: color 0.3s ease;
  border-radius: 0.5rem;
`;

const MotionDropdownContent = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: -7px;
  padding-top: 7px;
  background: var(--color-white);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-top: none;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow: hidden;
  z-index: 10;

  a {
    display: block;
    padding: 0.5rem 1rem;
    color: var(--color-black);
    font-size: var(--font-size-body-l);
    line-height: var(--line-height-body-l);
    text-decoration: none;
    transition: background 0.3s ease, color 0.3s ease;

    &:hover {
      background: rgba(169, 40, 201, 0.1);
      color: var(--color-violet-accent);
    }
  }
`;

export default function Header() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      setIsDropdownActive(true);
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon onClick={() => router.push("/")} />
      </Logo>

      <Nav>
        <NavItem>
          <Link href="#">Section</Link>
        </NavItem>
        <NavItem>
          <Link href="#">Section</Link>
        </NavItem>
        <NavItem>
          <Link href="#">Section</Link>
        </NavItem>
        <NavItem ref={dropdownRef}>
          <DropdownContainer isOpen={isDropdownActive}>
            <DropdownButton isOpen={isDropdownActive} onClick={toggleDropdown}>
              Section
              <CurveIcon
                isOpen={isDropdownOpen}
                rotate={isDropdownOpen ? 180 : 0}
                color={
                  isDropdownActive ? "var(--color-black)" : "var(--color-white)"
                }
              />
            </DropdownButton>
            <AnimatePresence
              onExitComplete={() => {
                setIsDropdownActive(false);
              }}
            >
              {isDropdownOpen && (
                <MotionDropdownContent
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                >
                  <motion.div variants={itemVariants}>
                    <Link href="#">About</Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="#">Services</Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="#">Contact</Link>
                  </motion.div>
                </MotionDropdownContent>
              )}
            </AnimatePresence>
          </DropdownContainer>
        </NavItem>
        <NavItem>
          <Link href="#">Section</Link>
        </NavItem>
      </Nav>
      <NavItem>
        <Link href="#">CTA</Link>
      </NavItem>
    </HeaderContainer>
  );
}

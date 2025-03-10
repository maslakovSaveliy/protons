"use client";

import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import LogoIcon from "./icons/Logo";
import { motion, AnimatePresence } from "framer-motion";
import Curve from "./icons/Curve";
import { useRouter } from "next/navigation";
import Menu from "./icons/Menu";
import Close from "./icons/Close";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 46.56px 76px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: linear-gradient(to right, #1e1e1e, #111111);

  & > *:first-child {
    justify-self: start;
  }

  & > *:nth-child(2) {
    justify-self: center;
  }

  & > *:last-child {
    justify-self: end;
  }

  @media (max-width: 1024px) {
    padding: 36px 56px;
  }

  @media (max-width: 768px) {
    padding: 24px 36px;
  }

  @media (max-width: 480px) {
    padding: 20px 24px;
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

  @media (max-width: 1024px) {
    gap: 20px;
  }
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

  &.desktop-cta {
    @media (max-width: 768px) {
      display: none;
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

// Бургер-меню кнопка
const BurgerButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  position: relative;
  z-index: 110;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const BurgerButtonClose = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 0;
  width: 32px;
  height: 32px;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    width: 32px;
    height: 32px;
  }
`;

// Мобильное меню
const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: var(--color-black);
  z-index: 105;
  padding: 24px 36px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MobileNavItem = styled.div`
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

const MobileDropdownContainer = styled.div`
  margin-bottom: 8px;
`;

const MobileDropdownButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color-white);
  font-size: var(--font-size-body-l);
  line-height: var(--line-height-body-l);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0;
  text-align: left;
  cursor: pointer;
  width: 100%;
  justify-content: space-between;
`;

const MobileDropdownContent = styled(motion.div)`
  margin-top: 16px;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  a {
    color: var(--color-white);
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
`;

export default function Header() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Блокируем скролл страницы при открытом мобильном меню
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

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

  const mobileMenuVariants = {
    hidden: {
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    visible: {
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const overlayVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      setIsDropdownActive(true);
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  return (
    <>
      <HeaderContainer>
        <Logo>
          <LogoIcon onClick={() => router.push("/")} />
        </Logo>

        {/* <Nav>
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
              <DropdownButton
                isOpen={isDropdownActive}
                onClick={toggleDropdown}
              >
                Section
                <CurveIcon
                  isOpen={isDropdownOpen}
                  rotate={isDropdownOpen ? 180 : 0}
                  color={
                    isDropdownActive
                      ? "var(--color-black)"
                      : "var(--color-white)"
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
        </Nav> */}

        <div>
          <NavItem>
            <Link href="#">CTA</Link>
          </NavItem>
          {/* <BurgerButton
            onClick={toggleMobileMenu}
            className={isMobileMenuOpen ? "active" : ""}
          >
            <Menu color="var(--color-white)" width="32" height="32" />
          </BurgerButton> */}
        </div>
      </HeaderContainer>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <MobileMenuOverlay
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              onClick={toggleMobileMenu}
            />
            <MobileMenuContainer
              ref={mobileMenuRef}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
            >
              <MobileNav>
                <BurgerButtonClose onClick={toggleMobileMenu}>
                  <Close
                    color="var(--color-white)"
                    width="100%"
                    height="100%"
                  />
                </BurgerButtonClose>
                <MobileNavItem>
                  <Link href="#">Section</Link>
                </MobileNavItem>
                <MobileNavItem>
                  <Link href="#">Section</Link>
                </MobileNavItem>
                <MobileNavItem>
                  <Link href="#">Section</Link>
                </MobileNavItem>
                <MobileNavItem>
                  <MobileDropdownContainer>
                    <MobileDropdownButton onClick={toggleMobileDropdown}>
                      Section
                      <CurveIcon
                        isOpen={isMobileDropdownOpen}
                        rotate={isMobileDropdownOpen ? 180 : 0}
                        color="var(--color-white)"
                      />
                    </MobileDropdownButton>
                    <AnimatePresence>
                      {isMobileDropdownOpen && (
                        <MobileDropdownContent
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
                        </MobileDropdownContent>
                      )}
                    </AnimatePresence>
                  </MobileDropdownContainer>
                </MobileNavItem>
                <MobileNavItem>
                  <Link href="#">Section</Link>
                </MobileNavItem>
                <MobileNavItem>
                  <Link href="#">CTA</Link>
                </MobileNavItem>
              </MobileNav>
            </MobileMenuContainer>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

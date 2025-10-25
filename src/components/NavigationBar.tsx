import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Settings, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { toggleTheme } from "../hooks/darkTheme";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { HEADER_LINKS } from "../utils/constants";
import HeaderTab from "./HeaderTab";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

function NavigationBar() {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { colors, isDark } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };

  const settingsDropdownVariants = {
    closed: {
      opacity: 0,
      x: 60,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.nav
      className="relative z-50"
      style={{
        backgroundColor: "transparent",
        backdropFilter: "blur(10px)",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex-shrink-0 flex items-center group">
            {/* <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            > */}
            <Logo
              width={32}
              height={32}
              fill={colors.primary}
              style={{ transform: "scaleX(-1)" }}
            />
            {/* </motion.div> */}
          </Link>

          {isMobile && (
            <Link to="/">
              <motion.span
                className="ml-3 text-xl font-bold"
                style={{ color: colors.primary }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                Keisar Club
              </motion.span>
            </Link>
          )}

          {!isMobile && (
            <>
              <motion.div
                className="flex items-center space-x-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {HEADER_LINKS.map((link, i) => (
                  <motion.div
                    key={`${link.translationKey}-${i}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.3 }}
                  >
                    <HeaderTab to={link.to} input={t(link.translationKey)} className="default" />
                  </motion.div>
                ))}
              </motion.div>

              <div className="relative flex items-center" ref={settingsRef}>
                <AnimatePresence>
                  {isSettingsOpen && (
                    <motion.div
                      className="absolute right-full flex items-center gap-2 mr-2"
                      variants={settingsDropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleThemeToggle}
                        style={{ color: colors.textSecondary }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {colors.background === "#000000" ? (
                            <Sun className="h-5 w-5" />
                          ) : (
                            <Moon className="h-5 w-5" />
                          )}
                        </motion.div>
                      </Button>
                      <LanguageSwitcher />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Settings className="h-5 w-5" />
                  </motion.div>
                </Button>
              </div>
            </>
          )}

          {isMobile && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Menu - Using Portal */}
      {isMobile &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0"
                  style={{
                    top: "64px",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    zIndex: 40,
                  }}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Menu Panel */}
                <motion.div
                  className="fixed left-0 right-0 shadow-2xl"
                  style={{
                    top: "64px",
                    borderBottomLeftRadius: "50px",
                    borderBottomRightRadius: "50px",
                    backgroundColor: colors.background,
                    zIndex: 50,
                  }}
                  variants={menuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <div className="pb-10 pt-4">
                    <motion.div className="space-y-3 flex flex-col items-center">
                      {HEADER_LINKS.map((link, i) => (
                        <motion.div
                          key={`${link.translationKey}-${i}`}
                          variants={itemVariants}
                          className="max-w-sm w-full"
                        >
                          <HeaderTab
                            to={link.to}
                            input={t(link.translationKey)}
                            onClick={() =>
                              setTimeout(() => {
                                setIsOpen(false);
                              }, 700)
                            }
                            className="mobile"
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* <Separator style={{ backgroundColor: colors.border }} /> */}

                  <motion.div className="px-6 py-6 rounded-b-2xl" variants={itemVariants}>
                    <div className="flex justify-center gap-3">
                      <Button
                        variant="ghost"
                        onClick={handleThemeToggle}
                        className="flex items-center px-6 py-3 rounded-lg transition-all duration-200"
                        style={{
                          // backgroundColor: colors.surface,
                          color: colors.textSecondary,
                        }}
                      >
                        {isDark ? (
                          <>
                            <Sun className="h-5 w-5" />
                            {/* <span className="font-medium">{t("theme.light")}</span> */}
                          </>
                        ) : (
                          <>
                            <Moon className="h-5 w-5" />
                            {/* <span className="font-medium">{t("theme.dark")}</span> */}
                          </>
                        )}
                      </Button>
                      <LanguageSwitcher variant="mobile" />
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.nav>
  );
}

export default NavigationBar;

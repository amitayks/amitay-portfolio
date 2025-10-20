import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toggleTheme } from "../hooks/darkTheme";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useTheme } from "@/hooks/useTheme";
import { HEADER_LINKS } from "../utils/constants";
import HeaderTab from "./HeaderTab";
import Logo from "./Logo";

function NavigationBar() {

  const [isOpen, setIsOpen] = useState(false);

  const colors = useTheme();

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



  const handleThemeToggle = () => {

    toggleTheme();

  };



  return (

    <nav

      style={{

        backgroundColor: colors.surface,

        borderBottom: `1px solid ${colors.border}`,

        boxShadow: `0 1px 2px 0 ${colors.shadow}`,

      }}

    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          <Link to="/" className="flex-shrink-0 flex items-center group">

            <Logo

              width={32}

              height={32}

              fill={colors.primary}

              style={{ transform: "scaleX(-1)" }}

            />

          </Link>



          {isMobile && (

            <Link to="/">

              <span

                className="ml-3 text-xl font-bold"

                style={{ color: colors.primary }}

              >

                Keisar Club

              </span>

            </Link>

          )}



          {!isMobile && (

            <>

              <div className="flex items-center space-x-8">

                {HEADER_LINKS.map((link, i) => (

                  <HeaderTab

                    key={i}

                    to={link.to}

                    input={link.input}

                    // icon={link.icon}

                    className="default"

                  />

                ))}

              </div>



              <button

                onClick={handleThemeToggle}

                style={{ color: colors.textSecondary }}

                className="dark:hover:text-gray-200"

              >

                {colors.background === "#000000" ? (

                  <Sun className="h-5 w-5" />

                ) : (

                  <Moon className="h-5 w-5" />

                )}

              </button>

            </>

          )}



          {isMobile && (

            <button

              onClick={() => setIsOpen(!isOpen)}

              type="button"

              style={{ color: colors.text }}

              className={`rounded-md`}

            >

              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}

            </button>

          )}

        </div>

      </div>



      {isMobile && (

        <div className="mobile-menu-content">

          <div

            className={`fixed left-0 right-0 shadow-2xl transform transition-all duration-600 ease-in-out z-50 ${

              isOpen ? " visible opacity-100" : "invisible opacity-0"

            }`}

            style={{

              top: "64px",

              borderBottomLeftRadius: "20px",

              borderBottomRightRadius: "20px",

              backgroundColor: colors.surface,

            }}

          >

            <div className="pb-10">

              <div className="space-y-3 flex flex-col items-center">

                {HEADER_LINKS.map((link, i) => (

                  <div

                    key={i}

                    className={`transform transition-all duration-200 ease-in-out max-w-sm ${

                      isOpen ? "translate-y-4 visible" : "translate-y-0 invisible"

                    }`}

                  >

                    <HeaderTab

                      to={link.to}

                      input={link.input}

                      //   icon={link.icon}

                      onClick={() => setIsOpen(false)}

                      className="mobile"

                    />

                  </div>

                ))}

              </div>

            </div>



            <div

              className="mx-6 border-t"

              style={{ borderColor: colors.border }}

            ></div>



            <div className="px-6 py-6 rounded-b-2xl">

              <div className="flex justify-center">

                <button

                  onClick={handleThemeToggle}

                  style={{

                    color: colors.text,

                    backgroundColor: colors.surfaceSecondary,

                  }}

                  className="flex items-center px-6 py-3 rounded-lg transition-all duration-200"

                >

                  {colors.background === "#000000" ? (

                    <>

                      <Sun className="h-5 w-5 mr-3" />

                      <span className="font-medium">Light Mode</span>

                    </>                  ) : (

                    <>

                      <Moon className="h-5 w-5 mr-3" />

                      <span className="font-medium">Dark Mode</span>

                    </>

                  )}

                </button>

              </div>

            </div>

          </div>



          {isOpen && (

            <div

              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-1000 ease-in-out"

              onClick={() => setIsOpen(false)}

              style={{ top: "64px" }}

            />

          )}

        </div>

      )}

    </nav>

  );

}

export default NavigationBar;

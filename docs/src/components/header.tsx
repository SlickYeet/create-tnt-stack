"use client"

import {
  ChevronDownIcon,
  ChevronRightIcon,
  MenuIcon,
  StarIcon,
  XIcon,
} from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { DocsSidebar } from "@/components/docs/sidebar"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  GITHUB_CREATE_TNT_APP_REPO,
  RELATIVE_INITIAL_DOCS_PATH,
} from "@/constants"
import { cn } from "@/lib/utils"

const NAVIGATION = [
  { href: "/", label: "Home" },
  { href: RELATIVE_INITIAL_DOCS_PATH, label: "Docs" },
]

export function Header() {
  const pathname = usePathname()
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const isDocs = pathname.startsWith("/docs")

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const activeIndex = NAVIGATION.findIndex(
      (item) =>
        item.href ===
        (pathname.startsWith("/docs") ? RELATIVE_INITIAL_DOCS_PATH : pathname),
    )
    if (activeIndex !== -1 && navRefs.current[activeIndex]) {
      const activeElement = navRefs.current[activeIndex]
      const { offsetLeft, offsetWidth } = activeElement!
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth })
    }
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "sticky top-0 z-50 w-full border-b backdrop-blur-sm",
          isOpen ? "bg-background" : "bg-background/80",
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>

            <nav className="relative hidden lg:block">
              {/* Hover Highlight */}
              <motion.div
                layout
                initial={false}
                animate={
                  hoveredIndex !== null && navRefs.current[hoveredIndex]
                    ? {
                        opacity: 1,
                        left: navRefs.current[hoveredIndex]!.offsetLeft,
                        width: navRefs.current[hoveredIndex]!.offsetWidth,
                      }
                    : { opacity: 0 }
                }
                className="bg-muted/50 absolute flex h-[30px] items-center rounded-[6px]"
              />

              {/* Active Indicator */}
              <motion.div
                layout
                initial={false}
                animate={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
                className="bg-primary absolute bottom-[-18px] h-px rounded-full"
              />

              <div className="relative flex items-center space-x-[6px]">
                {NAVIGATION.map(({ href, label }, index) => (
                  <Link
                    key={index}
                    href={href}
                    ref={(el) => {
                      navRefs.current[index] = el
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={cn(
                      "h-[30px] cursor-pointer px-3 py-2 transition-colors duration-300",
                      (pathname.startsWith("/docs") &&
                        href === RELATIVE_INITIAL_DOCS_PATH) ||
                        href === pathname
                        ? "text-primary"
                        : "text-foreground",
                    )}
                  >
                    <div className="flex h-full items-center justify-center leading-5 whitespace-nowrap">
                      {label}
                    </div>
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden items-center gap-2 lg:flex"
          >
            <Button variant="outline" asChild>
              <Link href={GITHUB_CREATE_TNT_APP_REPO} target="_blank">
                <StarIcon className="size-4 fill-yellow-500 stroke-yellow-500 dark:fill-yellow-400 dark:stroke-yellow-400" />
                Star on GitHub
              </Link>
            </Button>
            <ThemeToggle />
          </motion.div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              size="icon"
              variant="outline"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden"
          >
            <div className="z-10 container flex flex-col gap-4 py-4">
              {NAVIGATION.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => {
                    /**
                     * Hack to close the menu after navigating
                     */
                    setTimeout(() => setMobileMenuOpen(false), 100)
                  }}
                  className={cn(
                    "hover:text-primary text-foreground rounded-md border p-4 text-sm font-medium transition-colors",
                    (pathname.startsWith("/docs") &&
                      href === RELATIVE_INITIAL_DOCS_PATH) ||
                      href === pathname
                      ? "bg-primary/10 border-primary"
                      : "border-border/ bg-input/10",
                  )}
                >
                  {label}
                </Link>
              ))}

              <div className="bg-border h-px w-full" />

              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={GITHUB_CREATE_TNT_APP_REPO} target="_blank">
                    <StarIcon className="size-4 fill-yellow-500 stroke-yellow-500 dark:fill-yellow-400 dark:stroke-yellow-400" />
                    Star on GitHub
                  </Link>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {isDocs && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "sticky top-16 left-0 z-20 hidden max-md:block",
              !isOpen
                ? "bg-background/80 border-b backdrop-blur-sm"
                : "bg-background",
            )}
          >
            <button
              onClick={toggleMobileMenu}
              className="container flex h-10 w-full cursor-pointer items-center"
            >
              {isOpen ? (
                <ChevronDownIcon className="size-5" />
              ) : (
                <ChevronRightIcon className="size-5" />
              )}
              <span className="ml-1.5">Menu</span>
            </button>
          </motion.div>
          {isOpen && (
            <DocsSidebar isOpen={isOpen} setIsOpen={toggleMobileMenu} />
          )}
        </>
      )}
    </>
  )
}

"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

import { Heading } from "@/components/mdx/headings"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SIDEBAR_NAVIGATION } from "@/constants"
import { cn } from "@/lib/utils"

interface DocsSidebarProps {
  isOpen?: boolean
  setIsOpen?: () => void
}

export function DocsSidebar({ isOpen, setIsOpen }: DocsSidebarProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const SidebarContent = () => (
    <aside>
      {SIDEBAR_NAVIGATION.map((page) => (
        <div key={page.title}>
          <Heading depth={3} className="text-xl">
            {page.title}
          </Heading>
          <ul className="mb-4 ml-4">
            {page.items.map((item) => {
              const isActive = pathname.includes(item.slug)

              return (
                <li key={item.slug}>
                  <Link
                    href={item.slug}
                    onClick={() => {
                      setTimeout(() => setIsOpen && setIsOpen(), 100)
                    }}
                    className="block"
                  >
                    <div className="relative">
                      {isActive && (
                        <motion.div
                          layoutId="sidebarActiveItem"
                          className="bg-primary/10 border-primary absolute inset-0 border-l-2"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 block px-4 py-2",
                          "hover:text-primary hover:bg-primary/5",
                          "border-primary/20 hover:border-primary/50 border-l-2",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {item.title}
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </aside>
  )

  return (
    <div className="bg-background sticky top-20 z-40 h-screen">
      <div className="hidden md:block">
        <SidebarContent />
      </div>
      <ScrollArea className="container block h-[calc(100vh-7rem)] md:hidden">
        <SidebarContent />
      </ScrollArea>
    </div>
  )
}

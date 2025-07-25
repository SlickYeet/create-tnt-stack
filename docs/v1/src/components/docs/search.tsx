"use client"

import Fuse from "fuse.js"
import {
  ArrowRightIcon,
  CommandIcon,
  FileTextIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { useMobile } from "@/hooks/use-mobile"
import { type MdxDocument } from "@/lib/mdx"
import { cn } from "@/lib/utils"

export function Search({ docs }: { docs: MdxDocument[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMobile(1024)

  const [query, setQuery] = useState<string>("")
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  /**
   * Fix for dialog not closing when navigating
   */
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const fuse = new Fuse(docs, {
    threshold: 0.3,
    keys: ["title", "description"],
  })

  const results: MdxDocument[] =
    debouncedQuery.length > 1
      ? fuse.search(debouncedQuery).map((result) => result.item)
      : []

  const handleSearch = (query: string) => {
    setQuery(query)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size={isMobile ? "icon" : "default"}
          variant="outline"
          className="text-muted-foreground group"
        >
          <SearchIcon className="size-5" />
          <p className="hidden pr-10 lg:block">Search documentation...</p>
          <span className="sr-only">Search documentation</span>
          <span className="bg-background group-hover:text-accent-foreground dark:bg-input dark:border-input hidden items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs shadow-xs transition-all lg:flex">
            <kbd>
              <CommandIcon className="size-2.5" />
            </kbd>
            <kbd>K</kbd>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="top-1/4 max-w-[450px] -translate-y-1/4 border-0 bg-transparent p-0">
        <DialogTitle hidden />
        <DialogDescription hidden />
        <div className="w-full">
          <div className="relative">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search documentation..."
              className={cn(
                "!bg-background h-12 pl-10",
                (results.length > 0 ||
                  debouncedQuery.length > 1 ||
                  debouncedQuery.length === 1) &&
                  "rounded-b-none",
              )}
              autoFocus
            />
            {query && (
              <Button
                tabIndex={-1}
                onClick={() => handleSearch("")}
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
              >
                <XIcon className="size-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          {results.length > 0 ? (
            <div className="bg-background max-h-[400px] overflow-auto rounded-lg rounded-t-none border px-2 shadow-lg">
              <div className="text-muted-foreground py-2 text-sm font-medium">
                Results ({results.length})
              </div>

              {["docs"].map((category) => {
                return (
                  <div key={category} className="mb-4">
                    <div className="text-muted-foreground mb-2 px-2 text-xs font-semibold uppercase">
                      {category}
                    </div>
                    <ul className="space-y-1">
                      {results.map((result) => (
                        <li key={result.slug}>
                          <Link
                            href={result.slug}
                            onClick={(e) => {
                              e.preventDefault()
                              setIsOpen(false)
                              setQuery("")
                              router.push(result.slug)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                setIsOpen(false)
                                setQuery("")
                                router.push(result.slug)
                              }
                            }}
                            className="hover:bg-input/30 focus-within:bg-input/30 flex w-full items-start gap-2 rounded-md p-2 text-left ring-0 outline-0"
                          >
                            <span className="mt-0.5 shrink-0">
                              <FileTextIcon className="text-primary size-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">
                                {result.title}
                              </div>
                              <div className="text-muted-foreground line-clamp-2 text-sm">
                                {result.description}
                              </div>
                            </div>
                            <ArrowRightIcon className="text-muted-foreground size-4 shrink-0 self-center" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          ) : debouncedQuery.length > 1 ? (
            <div className="text-muted-foreground bg-background max-h-[400px] overflow-auto rounded-lg rounded-t-none border py-6 text-center shadow-lg">
              <FileTextIcon className="mx-auto mb-2 size-8 opacity-50" />
              <p>No results found for &quot;{query}&quot;</p>
              <p className="mt-1 text-sm">Try adjusting your search terms</p>
            </div>
          ) : null}

          {debouncedQuery.length === 1 && (
            <div className="text-muted-foreground bg-background max-h-[400px] overflow-auto rounded-lg rounded-t-none border py-4 text-center text-sm shadow-lg">
              Please enter at least 2 characters to search
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

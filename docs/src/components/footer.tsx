import {
  AlertCircleIcon,
  BookOpenIcon,
  CodeIcon,
  FileCogIcon,
  FilePenIcon,
  GithubIcon,
  StarIcon,
} from "lucide-react"
import Link from "next/link"

import { Logo } from "@/components/logo"
import { Anchor } from "@/components/mdx/anchor"
import { Button } from "@/components/ui/button"
import { GITHUB_CREATE_TNT_APP_REPO } from "@/constants"

export function Footer() {
  return (
    <footer className="mt-auto border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and GitHub buttons */}
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Logo
                  animate={false}
                  ping={false}
                  textClassName="inline-block"
                />
              </Link>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm">
              A powerful web application scaffolding CLI tool to jumpstart your
              projects with explosive speed.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link
                  href={GITHUB_CREATE_TNT_APP_REPO}
                  target="_blank"
                  aria-label="GitHub"
                >
                  <GithubIcon className="size-4" />
                  <span>Repository</span>
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href={GITHUB_CREATE_TNT_APP_REPO} target="_blank">
                  <StarIcon className="size-4 fill-yellow-500 stroke-yellow-500 dark:fill-yellow-400 dark:stroke-yellow-400" />
                  <span>Star on GitHub</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Create TNT Stack links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Create TNT Stack</h3>
            <ul className="space-y-2">
              <li>
                <Anchor href="/docs/introduction">Introduction</Anchor>
              </li>
              <li>
                <Anchor href="/docs/getting-started">Getting Started</Anchor>
              </li>
              <li>
                <Anchor href="/docs/why">Why?</Anchor>
              </li>
              <li>
                <Anchor href="/docs/faq">FAQ</Anchor>
              </li>
            </ul>
          </div>

          {/* Community links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Community</h3>
            <ul className="space-y-2">
              <li>
                <Anchor
                  href={`${GITHUB_CREATE_TNT_APP_REPO}/blob/main/CONTRIBUTING.md`}
                >
                  <div className="flex items-center gap-1.5">
                    <CodeIcon className="size-4" />
                    <span>Contributing Guidelines</span>
                  </div>
                </Anchor>
              </li>
              <li>
                <Anchor
                  href={`${GITHUB_CREATE_TNT_APP_REPO}/issues/new?template=bug_report.yml`}
                >
                  <div className="flex items-center gap-1.5">
                    <AlertCircleIcon className="size-4" />
                    <span>Report an Issue</span>
                  </div>
                </Anchor>
              </li>
              <li>
                <Anchor href="/docs">
                  <div className="flex items-center gap-1.5">
                    <BookOpenIcon className="size-4" />
                    <span>Documentation</span>
                  </div>
                </Anchor>
              </li>
              <li>
                <Anchor href="/v1">Roadmap</Anchor>
              </li>
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Anchor href="https://lasse.famlam.ca">Portfolio</Anchor>
              </li>
              <li>
                <Anchor href="https://lasse.famlam.ca/projects">
                  <div className="flex items-center gap-1.5">
                    <FileCogIcon className="size-4" />
                    <span>Projects</span>
                  </div>
                </Anchor>
              </li>
              <li>
                <Anchor href="https://lasse.famlam.ca/blog">
                  <div className="flex items-center gap-1.5">
                    <FilePenIcon className="size-4" />
                    <span>Blog</span>
                  </div>
                </Anchor>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} TNT-Powered. All right reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <a
              href={`${GITHUB_CREATE_TNT_APP_REPO}/blob/main/LICENSE.md`}
              target="_blank"
              className="text-muted-foreground text-sm hover:underline"
            >
              MIT License
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { StarIcon } from "lucide-react"
import Link from "next/link"
import { GitHubIcon } from "nextra/icons"

import { Logo } from "@/components/logo"
import { Anchor } from "@/components/mdx/anchor"
import { Button } from "@/components/ui/button"
import { GITHUB_CREATE_TNT_APP_REPO } from "@/constants"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-10">
      <div className="container flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/">
            <Logo animate={false} ping={false} textClassName="inline-block" />
          </Link>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} TNT-Powered CLI. MIT License.
          </p>
        </div>

        <div className="text-muted-foreground flex flex-col items-start gap-4 text-sm lg:flex-row lg:items-center lg:gap-6">
          <Anchor
            href="/docs/create-tnt-stack/introduction"
            className="text-muted-foreground hover:underline"
          >
            Documentation
          </Anchor>
          <Anchor
            href={`${GITHUB_CREATE_TNT_APP_REPO}/blob/main/CONTRIBUTING.md`}
            className="text-muted-foreground hover:underline"
          >
            Contributing
          </Anchor>
          <Anchor
            href={`${GITHUB_CREATE_TNT_APP_REPO}/issues/new`}
            className="text-muted-foreground hover:underline"
          >
            Report Issue
          </Anchor>

          <div className="flex items-center gap-4">
            <Link
              href={GITHUB_CREATE_TNT_APP_REPO}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon className="size-5" />
            </Link>

            <Button size="sm" variant="outline" asChild>
              <Link href={GITHUB_CREATE_TNT_APP_REPO} target="_blank">
                <StarIcon className="size-4 fill-yellow-500 stroke-yellow-500 dark:fill-yellow-400 dark:stroke-yellow-400" />
                Star on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

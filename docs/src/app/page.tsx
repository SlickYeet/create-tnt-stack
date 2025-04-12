import { CTA } from "@/components/home/cta"
import { Features } from "@/components/home/features"
import { Hero } from "@/components/home/hero"
import { Usage } from "@/components/home/usage"
import { getNpmVersion } from "@/lib/utils"

export default async function HomePage() {
  const npmVersion = await getNpmVersion("beta")

  return (
    <div className="flex min-h-screen flex-col">
      <Hero npmVersion={npmVersion} />
      <Features />
      <Usage />
      <CTA />
    </div>
  )
}

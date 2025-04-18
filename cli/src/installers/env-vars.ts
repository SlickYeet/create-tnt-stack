import path from "path"
import fs from "fs-extra"

import { PKG_ROOT } from "@/constants.js"
import { AvailableDependencies } from "@/installers/dependency-version-map.js"
import { type DatabaseProvider, type Installer } from "@/installers/index.js"
import { addPackageDependency } from "@/utils/add-package-dependency.js"

export const envVariablesInstaller: Installer = ({
  projectDir,
  scopedAppName,
  packages,
  databaseProvider,
}) => {
  const usingEnv = packages?.envVariables.inUse
  const usingAuthjs = packages?.authjs.inUse
  const usingBetterAuth = packages?.betterAuth.inUse
  const usingPrisma = packages?.prisma.inUse
  const usingPayload = packages?.payload.inUse

  const deps: AvailableDependencies[] = []
  if (usingEnv) {
    deps.push("@t3-oss/env-nextjs")
    deps.push("zod")
  }

  addPackageDependency({
    projectDir,
    dependencies: deps,
    devMode: false,
  })

  const usingDb = usingPrisma || usingPayload

  const envContent = getEnvContent(
    !!usingAuthjs,
    !!usingBetterAuth,
    !!usingPrisma,
    !!usingPayload,
    scopedAppName,
    databaseProvider
  )

  let envFile = ""
  if (usingDb) {
    if (usingAuthjs) {
      envFile = "with-authjs-db.js"
    } else if (usingBetterAuth) {
      envFile = "with-better-auth-db.js"
    } else if (usingPayload) {
      envFile = "with-payload.js"
    } else {
      envFile = "with-db.js"
    }
  } else {
    if (usingAuthjs) {
      envFile = "with-authjs.js"
    } else if (usingBetterAuth) {
      envFile = "with-better-auth.js"
    }
  }

  if (envFile !== "") {
    const envSchemaSrc = path.join(
      PKG_ROOT,
      "template/packages/src/env",
      envFile
    )
    const envSchemaDest = path.join(projectDir, "src/env.js")
    fs.copyFileSync(envSchemaSrc, envSchemaDest)
  }

  const envDest = path.join(projectDir, ".env")
  const envExampleDest = path.join(projectDir, ".env.example")

  const _exampleEnvContent = exampleEnvContent + envContent

  // Generate an auth secret and put in .env, not .env.example
  const secret = Buffer.from(
    crypto.getRandomValues(new Uint8Array(32))
  ).toString("base64")
  const _envContent = envContent
    // Authjs
    .replace(
      'AUTH_SECRET=""',
      `AUTH_SECRET="${secret}" # Generated by create-tnt-stack`
    )
    // Better Auth
    .replace(
      'BETTER_AUTH_SECRET=""',
      `BETTER_AUTH_SECRET="${secret}" # Generated by create-tnt-stack`
    )
    // Payload CMS
    .replace(
      'PAYLOAD_SECRET=""',
      `PAYLOAD_SECRET="${secret}" # Generated by create-tnt-stack`
    )

  fs.writeFileSync(envDest, _envContent, "utf-8")
  fs.writeFileSync(envExampleDest, _exampleEnvContent, "utf-8")
}

function getEnvContent(
  usingAuthjs: boolean,
  usingBetterAuth: boolean,
  usingPrisma: boolean,
  usingPayload: boolean,
  scopedAppName: string,
  databaseProvider: DatabaseProvider
) {
  let content = `
# When adding additional environment variables, the schema in "/src/env.js"
# should be updated accordingly.
  `
    .trim()
    .concat("\n")

  if (usingPrisma)
    content += `
# Prisma
# https://www.prisma.io/docs/reference/database-reference/connection-urls#env
`

  if (usingPrisma) {
    if (databaseProvider === "mysql") {
      content += `DATABASE_URL="mysql://root:password@localhost:3306/${scopedAppName}"`
    } else if (databaseProvider === "postgresql") {
      // postgres user is default for postgresql
      content += `DATABASE_URL="postgresql://postgres:password@localhost:5432/${scopedAppName}"`
    } else if (databaseProvider === "sqlite") {
      content += 'DATABASE_URL="file:./db.sqlite"'
    }
    content += "\n"
  }

  if (usingPayload) {
    content += `
# Payload CMS
# https://payloadcms.com/docs/database/overview
`
    content += `PAYLOAD_SECRET=""\n`
    if (databaseProvider === "postgresql") {
      // postgres user is default for postgresql
      content += `DATABASE_URL="postgresql://postgres:password@localhost:5432/${scopedAppName}"`
    } else if (databaseProvider === "sqlite") {
      content += 'DATABASE_URL="file:./db.sqlite"'
    }
    content += "\n"
  }

  if (usingAuthjs)
    content += `
# Next Auth
# You can generate a new secret on the command line with:
# npx auth secret
# https://authjs.dev/getting-started/installation#setup-environment
AUTH_SECRET=""

# Next Auth Discord Provider
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
`

  if (usingBetterAuth) {
    content += `
# Better Auth
# You can generate a new secret by going to the Better Auth docs:
# https://www.better-auth.com/docs/installation#set-environment-variables
BETTER_AUTH_SECRET=""
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000" # Base URL of your app

# Better Auth Discord Provider
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
`
  }

  if (!usingAuthjs && !usingPrisma && !usingPayload) {
    content += `
# Example:
# SERVERVAR="foo"
# NEXT_PUBLIC_CLIENTVAR="bar"
`
  }

  return content
}

const exampleEnvContent = `
# Since the ".env" file is gitignored, you can use the ".env.example" file to
# build a new ".env" file when you clone the repo. Keep this file up-to-date
# when you add new variables to \`.env\`.

# This file will be committed to version control, so make sure not to have any
# secrets in it. If you are cloning this repo, create a copy of this file named
# ".env" and populate it with your secrets.
`
  .trim()
  .concat("\n\n")

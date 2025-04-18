import path from "path"

import { installPackages } from "@/helpers/install-packages.js"
import { scaffoldProject } from "@/helpers/scaffold-project.js"
import {
  selectGlobals,
  selectLayoutFile,
  selectPageFile,
} from "@/helpers/select-boilerplate.js"
import {
  type DatabaseProvider,
  type PkgInstallerMap,
} from "@/installers/index.js"
import { getUserPkgManager } from "@/utils/get-user-pkg-manager.js"

interface CreateProjectOptions {
  projectName: string
  scopedAppName: string
  packages: PkgInstallerMap
  noInstall: boolean
  databaseProvider: DatabaseProvider
}

export async function createProject({
  projectName,
  scopedAppName,
  packages,
  noInstall,
  databaseProvider,
}: CreateProjectOptions) {
  const pkgManager = getUserPkgManager()
  const projectDir = path.resolve(process.cwd(), projectName)

  // Bootstrap the base Next.js app
  await scaffoldProject({
    projectName,
    projectDir,
    pkgManager,
    scopedAppName,
    noInstall,
    databaseProvider,
  })

  // Install the selected packages
  installPackages({
    projectName,
    scopedAppName,
    projectDir,
    pkgManager,
    packages,
    noInstall,
    databaseProvider,
  })

  // Copy the boilerplate files
  selectLayoutFile({ packages, projectDir })
  selectPageFile({ packages, projectDir })
  selectGlobals({ packages, projectDir })

  return projectDir
}

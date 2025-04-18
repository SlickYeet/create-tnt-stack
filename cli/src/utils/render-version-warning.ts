import { execSync } from "child_process"
import https from "https"

import { getVersion } from "./get-tnt-version.js"
import { logger } from "./logger.js"

export function renderVersionWarning(npmVersion: string) {
  const currentVersion = getVersion()

  if (currentVersion.includes("beta")) {
    logger.warn("  You are using a beta version of create-tnt-stack.")
    logger.warn("  Please report any bugs you encounter.")
  } else if (currentVersion !== npmVersion) {
    logger.warn("  You are using an outdated version of create-tnt-stack.")
    logger.warn(
      "  Your version:",
      currentVersion + ".",
      "Latest version in the npm registry:",
      npmVersion
    )
    logger.warn("  Please run the CLI with @latest to get the latest updates.")
  }
  console.log("")
}

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 * https://github.com/facebook/create-react-app/blob/main/packages/create-react-app/LICENSE
 */
interface DistTagsBody {
  latest: string
}

function checkForLatestVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(
        "https://registry.npmjs.org/-/package/tnt-stack/dist-tags",
        (res) => {
          if (res.statusCode === 200) {
            let body = ""
            res.on("data", (data) => (body += data))
            res.on("end", () => {
              resolve((JSON.parse(body) as DistTagsBody).latest)
            })
          } else {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject()
          }
        }
      )
      .on("error", () => {
        // logger.error("Unable to check for latest version.");
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject()
      })
  })
}

export const getNpmVersion = () =>
  // `fetch` to the registry is faster than `npm view` so we try that first
  checkForLatestVersion().catch(() => {
    try {
      return execSync("npm view create-tnt-stack version").toString().trim()
    } catch {
      return null
    }
  })

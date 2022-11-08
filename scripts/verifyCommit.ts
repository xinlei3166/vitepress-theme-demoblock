// Invoked on the commit-msg git hook by simple-git-hooks.

import { readFileSync } from 'fs'
import colors from 'picocolors'

// get $1 from commit-msg script
const msgPath = process.argv[2]
const msg = readFileSync(msgPath, 'utf-8').trim()

// Merge branch
const mergeRE = /^Merge branch.*/
const commitRE =
  /^(revert: )?(feat|fix|docs|style|refactor|perf|test|chore|revert|release)(\(.+\))?: .{1,50}/

if (!mergeRE.test(msg) && !commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${colors.bgRed(colors.white(' ERROR '))} ${colors.red(
      `invalid commit message format.`
    )}\n\n` +
      colors.red(
        `  Proper commit message format is required for automated changelog generation. Examples:\n\n`
      ) +
      `    ${colors.green(`feat: add 'comments' option`)}\n` +
      `    ${colors.green(`fix: handle events on blur (close #28)`)}\n`
  )
  process.exit(1)
}

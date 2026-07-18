/**
 * Firebase login (answers consent prompts) + build + hosting deploy.
 * Run: node scripts/deploy-firebase.mjs
 */
import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(root)

function run(command, args, { inputLines = [] } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      shell: true,
      env: {
        ...process.env,
        FIREBASE_CLI_AI_FEATURES_DISABLED: '1',
      },
      stdio: inputLines.length ? ['pipe', 'inherit', 'inherit'] : 'inherit',
    })

    if (inputLines.length && child.stdin) {
      let i = 0
      const sendNext = () => {
        if (i >= inputLines.length) return
        child.stdin.write(`${inputLines[i++]}\n`)
        setTimeout(sendNext, 400)
      }
      setTimeout(sendNext, 800)
    }

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
    })
  })
}

async function isLoggedIn() {
  return new Promise((resolve) => {
    const child = spawn('npx', ['firebase', 'login:list'], {
      cwd: root,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let out = ''
    child.stdout.on('data', (d) => {
      out += d.toString()
    })
    child.stderr.on('data', (d) => {
      out += d.toString()
    })
    child.on('close', () => {
      resolve(!/No authorized accounts/i.test(out) && /@/.test(out))
    })
  })
}

async function main() {
  console.log('========================================')
  console.log(' BindLab Firebase Hosting deploy')
  console.log(' Domain: bindlab.ru')
  console.log('========================================\n')

  const loggedIn = await isLoggedIn()
  if (!loggedIn) {
    console.log('[1/3] Firebase login — browser will open.')
    console.log('      Sign in with the same Google account as Firebase Console.\n')
    console.log('      Answer prompts: Gemini = No, usage = No (auto).')
    console.log('      Then confirm login in the browser.\n')
    try {
      await run('npx', ['firebase', 'login', '--interactive'], {
        inputLines: ['n', 'n'],
      })
    } catch {
      console.error('\nLOGIN FAILED.')
      console.error('Close this window and run again, or in a new terminal:')
      console.error('  npx firebase login')
      console.error('  npm run deploy')
      process.exitCode = 1
      await waitKey()
      return
    }
  } else {
    console.log('[1/3] Already logged in to Firebase.\n')
  }

  console.log('\n[2/3] Building site...')
  await run('npm', ['run', 'build'])

  console.log('\n[3/3] Deploying to Firebase Hosting...')
  await run('npx', [
    'firebase',
    'deploy',
    '--only',
    'hosting',
    '--project',
    'bindlab',
    '--non-interactive',
  ])

  console.log('\n========================================')
  console.log(' DONE. Open: https://bindlab.web.app')
  console.log('========================================\n')
  console.log('Next: Firebase Hosting → bindlab.ru → Verify DNS')
  console.log('Auth → Settings → Authorized domains → bindlab.ru\n')

  try {
    spawn('cmd', ['/c', 'start', 'https://bindlab.web.app'], {
      shell: true,
      stdio: 'ignore',
      detached: true,
    }).unref()
  } catch {
    // ignore
  }

  await waitKey()
}

function waitKey() {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      resolve()
      return
    }
    console.log('Press Enter to close...')
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    rl.question('', () => {
      rl.close()
      resolve()
    })
  })
}

main().catch(async (err) => {
  console.error('\nERROR:', err.message || err)
  process.exitCode = 1
  await waitKey()
})

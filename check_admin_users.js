/**
 * check_admin_users.js — lists auth users in the current Supabase project.
 * Read-only. Run: node check_admin_users.js
 */
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const eq = line.indexOf('=')
    if (eq > 0) acc[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
    return acc
  }, {})

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'])

async function run() {
  console.log(`Project: ${env['NEXT_PUBLIC_SUPABASE_URL']}\n`)
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) {
    console.error('Error listing users:', error.message)
    return
  }
  if (!data.users.length) {
    console.log('NO admin users exist yet — login will fail until one is created.')
  } else {
    console.log(`${data.users.length} user(s):`)
    data.users.forEach((u) =>
      console.log(`  - ${u.email}  | confirmed: ${u.email_confirmed_at ? 'YES' : 'NO (login will fail)'}`)
    )
  }
}

run().catch(console.error)

import { readFileSync } from 'fs'
import { loadSheetTables, parseSheetMeta, wait } from 'sheet-down-helpers'

export async function example() {
  type User = {
    nickname: string;
    status: string
  }

  const client_email = 'user-name@project-name.iam.gserviceaccount.com'
  const private_key = readFileSync('key.pem').toString()
  const xml = readFileSync('full.xml').toString()
  const sheetMeta = await parseSheetMeta(xml)

  let db = loadSheetTables<'User', User>({
    auth: {
      client_email,
      private_key,
    },
    meta: sheetMeta,
  })

  await db.User.putCell({ row: 1, col: 1, value: 'nickname' })
  await db.User.putCell({ row: 1, col: 1, value: 'status' })
  await wait(300) // FIXME find way to confirm when it's actually stored

  await db.User.putRow({ row: 2, value: { nickname: 'Alice', status: 'New' } })
  await wait(300)
  let user = await db.User.getRow({ row: 2 })
  console.log(user) // will print { nickname: 'Alice', status: 'New' }
}

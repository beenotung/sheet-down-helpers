import { loadSheetTables, SheetTables } from '../src/sheet-db'
import { expect } from 'chai'
import { wait } from '../src/helpers'
import { escapeString } from '../src/string'
import { loadConfig } from './config'

describe('sheet-db TestSuit', () => {
  type User = { nickname: string; status: string }
  let db: SheetTables<'Testing1', User>
  before(async () => {
    let config = await loadConfig()
    if (config.invalidSettingsMessage !== false) {
      throw new Error(config.invalidSettingsMessage as string)
    }
    db = loadSheetTables({
      auth: {
        client_email: config.client_email,
        private_key: config.private_key,
      },
      meta: config.sheetMeta,
    })
  })
  it('should load the table', function () {
    expect(db).not.undefined
    expect(db.Testing1).not.undefined
  })

  it('should put & get simple string by cell', async function () {
    let values = ['Alice', 'Bob']
    for (let value of values) {
      await db.Testing1.putCell({ row: 2, col: 1, value })
      await wait(300) // FIXME find way to confirm when it's actually stored
      expect(await db.Testing1.getCell({ row: 2, col: 1 })).equals(value)
    }
  }).timeout(5000)

  it('should put & get simple string by row', async function () {
    await db.Testing1.putCell({ row: 1, col: 1, value: 'nickname' })
    await db.Testing1.putCell({ row: 1, col: 2, value: 'status' })
    await wait(300)

    let values: User[] = [
      { nickname: 'Alice', status: 'New' },
      { nickname: 'Bob', status: 'Active' },
    ]
    for (let value of values) {
      await db.Testing1.putRow({ row: 3, value })
      await wait(300 * 3) // FIXME find way to confirm when it's actually stored
      expect(await db.Testing1.getRow({ row: 3 })).deep.equals(value)
    }
  }).timeout(5000)

  it('should put & get string with "%"', async function () {
    await db.Testing1.putCell({
      row: 6,
      col: 1,
      value: new Date().toTimeString().split(' ')[0],
    })
    await wait(300)
    await db.Testing1.putCell({ row: 6, col: 1, value: '%' })
    await wait(300)
    expect(await db.Testing1.getCell({ row: 6, col: 1 })).equals('%')
  }).timeout(5000)

  it('should put & get string with "&"', async function () {
    await db.Testing1.putCell({
      row: 6,
      col: 1,
      value: new Date().toTimeString().split(' ')[0],
    })
    await wait(300)
    await db.Testing1.putCell({
      row: 6,
      col: 1,
      value: encodeURIComponent('&'),
    })
    await wait(300)
    expect(await db.Testing1.getCell({ row: 6, col: 1 })).equals(
      encodeURIComponent('&'),
    )
  }).timeout(5000)

  it('should put & get complex url', async function () {
    let url = 'http://domain.com/search?page=1&q=apple+tree'
    await db.Testing1.putCell({ row: 10, col: 1, value: escapeString(url) })
    await wait(300)
    expect(await db.Testing1.getCell({ row: 10, col: 1 })).equals(
      escapeString(url),
    )
  }).timeout(5000)
})

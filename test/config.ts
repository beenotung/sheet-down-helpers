import { existsSync, readFileSync } from 'fs'
import { parseSheetMeta, SheetMeta } from '../src/sheet-meta'
import { email, spreadsheet_id } from './env'

export async function loadConfig() {
  let invalidSettingsMessage: string | false = false
  let private_key: string = ''
  let sheetMeta: SheetMeta

  const keyFile = 'key.pem'
  if (!existsSync(keyFile)) {
    invalidSettingsMessage = `Missing file "${keyFile}".`
    return { invalidSettingsMessage }
  }
  private_key = readFileSync(keyFile).toString()

  if (!email) {
    invalidSettingsMessage = `Missing "email" in env.`
    return { invalidSettingsMessage }
  }

  if (!spreadsheet_id) {
    invalidSettingsMessage = `Missing "spreadsheet_id" in env.`
    return { invalidSettingsMessage }
  }

  const sheetMetaFile = 'full.xml'
  if (!existsSync(sheetMetaFile)) {
    const url = `https://spreadsheets.google.com/feeds/worksheets/${spreadsheet_id}/private/full`
    // TODO add some instruction on how to save / paste the result
    invalidSettingsMessage = `<a href="${url}">load spreadsheet meta data</a>`
    return { invalidSettingsMessage }
  }

  const xml = readFileSync(sheetMetaFile).toString()
  try {
    sheetMeta = await parseSheetMeta(xml)
  } catch (err) {
    invalidSettingsMessage = `Failed to load spreadsheet meta data: ${err}`
    return { invalidSettingsMessage }
  }
  return {
    invalidSettingsMessage: false,
    private_key,
    sheetMeta,
    email,
  }
}

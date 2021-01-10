import { parseStringPromise } from 'xml2js'

export type SheetMeta = {
  spreadsheet_id: string
  worksheets: WorksheetMeta[]
}
export type WorksheetMeta = {
  worksheet_id: string
  title: string
  updated: string
}

export async function parseSheetMeta(xmlString: string): Promise<SheetMeta> {
  const data = await parseStringPromise(xmlString)
  const feed = data.feed
  const id: string = feed.id[0]
  if (!id.endsWith('/private/full')) {
    throw new Error('Invalid sheet meta XML file: "spreadsheet_id" not found.')
  }
  const spreadsheet_id: string = id
    .replace('/private/full', '')
    .split('/')
    .pop()!
  const worksheets = feed.entry.map(
    (entry: any): WorksheetMeta => {
      const id: string = entry.id[0]
      if (!id.includes('/private/full/')) {
        throw new Error(
          'Invalid sheet meta XML file: "worksheet_id" not found.',
        )
      }
      const worksheet_id: string = id.split('/private/full/').pop()!
      const title: string = entry.title[0]._
      const updated: string = entry.updated[0]
      return { worksheet_id, title, updated }
    },
  )
  return {
    spreadsheet_id,
    worksheets,
  }
}

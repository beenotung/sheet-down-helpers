import { expect } from 'chai'
import { readFileSync } from 'fs'
import { parseSheetMeta } from '../src/sheet-meta'

// tslint:disable no-unused-expression

describe('sheet-meta TestSuit', () => {
  it('should parse config', async function () {
    const xml = readFileSync('full.xml').toString()
    const sheetMeta = await parseSheetMeta(xml)
    expect(sheetMeta).not.undefined
    const { spreadsheet_id, worksheets } = sheetMeta
    expect(spreadsheet_id).not.empty
    expect(worksheets).not.empty
    const [worksheet] = worksheets
    expect(worksheet).not.undefined
    expect(worksheet.worksheet_id).not.undefined
    expect(worksheet.title).not.empty
    expect(worksheet.updated).not.empty
    expect(new Date(worksheet.updated).getTime()).greaterThan(0)
  })
})

import { Token } from 'google-oauth-jwt-stream'
import levelup from 'levelup'
import { CellDOWN, CellLevelUp, RowDOWN, RowLevelUp } from 'sheet-down'
import { SheetMeta } from './sheet-meta'

export interface SheetAuth {
  email: string
  private_key: string
}

export const scopes = ['https://spreadsheets.google.com/feeds']

export function toToken(auth: SheetAuth) {
  return new Token(auth.email, auth.private_key, scopes)
}

export function toLocation(args: {
  spreadsheet_id: string
  worksheet_id: string
}) {
  return args.spreadsheet_id + '/' + args.worksheet_id
}

export class SheetTable<T extends object> {
  public cells: CellLevelUp
  public rows: RowLevelUp

  constructor(args: { cells: CellLevelUp; rows: RowLevelUp }) {
    this.cells = args.cells
    this.rows = args.rows
  }

  putCell(args: { row: number; col: number; value: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      const key = toRowColKey(args)
      this.cells.put(key, args.value, (error: any) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  getCell(args: { row: number; col: number }): Promise<string> {
    return new Promise((resolve, reject) => {
      const key = toRowColKey(args)
      this.cells.get(key, (error: any, value: string) => {
        if (error) {
          reject(error)
        } else {
          resolve(value)
        }
      })
    })
  }

  putRow(args: { row: number; value: T }): Promise<void> {
    return new Promise((resolve, reject) => {
      this.rows.put(args.row, args.value, (error: any) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  getRow(args: { row: number }): Promise<T> {
    return new Promise((resolve, reject) => {
      return this.rows.get(args.row, (error: any, value: T) => {
        if (error) {
          reject(error)
        } else {
          resolve(value as T)
        }
      })
    })
  }
}

function toRowColKey(args: { row: number; col: number }): [number, number] {
  return [args.row, args.col]
}

export type SheetTables<TableName extends string, Row extends object> = Record<
  TableName,
  SheetTable<Row>
>

export function loadSheetTables<
  TableName extends string,
  Row extends object
>(args: { meta: SheetMeta; auth: SheetAuth }): SheetTables<TableName, Row> {
  const token = toToken(args.auth)
  const tables = {} as Record<TableName, SheetTable<Row>>
  for (const worksheet of args.meta.worksheets) {
    const location = toLocation({
      spreadsheet_id: args.meta.spreadsheet_id,
      worksheet_id: worksheet.worksheet_id,
    })
    const cells: CellLevelUp = levelup(location, CellDOWN({ token }))
    const rows: RowLevelUp = levelup(location, RowDOWN({ token }))
    tables[worksheet.title as TableName] = new SheetTable({ rows, cells })
  }
  return tables
}

declare module 'sheet-down' {
  import { Token } from 'google-oauth-jwt-stream'
  import { LevelUp, levelupOptions } from 'levelup'

  export function CellDOWN(args: { token: Token }): CellLevelDown

  export type CellLevelDown = levelupOptions
  export type CellLevelUp = LevelUp<CellLevelDown>

  export function RowDOWN(args: { token: Token }): RowLevelDown

  export type RowLevelDown = levelupOptions
  export type RowLevelUp = LevelUp<RowLevelDown>
}

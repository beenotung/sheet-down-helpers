import { Token } from 'google-oauth-jwt-stream'

export interface SheetAuth {
  client_email: string
  private_key: string
}

export const scopes = ['https://spreadsheets.google.com/feeds']

export function toToken(auth: SheetAuth) {
  return new Token(auth.client_email, auth.private_key, scopes)
}

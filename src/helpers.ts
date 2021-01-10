export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getFullFeedXMLUrl(spreadsheet_id: string) {
  return `https://spreadsheets.google.com/feeds/worksheets/${spreadsheet_id}/private/full`
}

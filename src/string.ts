const AND = '&'
const ANDRegExp = new RegExp(AND, 'g')

const ANDCode = escape(AND)
const ANDCodeRegExp = new RegExp(ANDCode, 'g')

export function escapeString(value: string) {
  return value.replace(ANDRegExp, ANDCode)
}

export function unescapeString(value: string) {
  return value.replace(ANDCodeRegExp, AND)
}

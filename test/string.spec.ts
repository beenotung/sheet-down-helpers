import { expect } from 'chai'
import { escapeString, unescapeString } from '../src/string'

describe('string TestSuit', function () {
  it('should preserve string value', function () {
    let url = 'https://domain.com/search?page=1&q=apple+tree'
    let escaped = escapeString(url)
    // console.log(escaped)
    expect(escaped).not.includes('&')
    expect(escaped).includes('://')
    expect(escaped).includes('?')
    let restored = unescapeString(url)
    expect(restored).equals(url)
  })
})

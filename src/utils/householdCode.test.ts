import { describe, expect, it } from 'vitest'
import { formatHouseholdCode, generateHouseholdCode, householdCredentials, normalizeHouseholdCode } from './householdCode'

describe('household codes', () => {
  it('accepts formatted, compact, and lower-case codes', () => {
    expect(normalizeHouseholdCode('BANS-ABCD-2345')).toBe('ABCD2345')
    expect(normalizeHouseholdCode('abcd2345')).toBe('ABCD2345')
    expect(formatHouseholdCode('abcd2345')).toBe('BANS-ABCD-2345')
  })

  it('rejects ambiguous or incorrectly sized codes', () => {
    expect(normalizeHouseholdCode('BANS-ABCI-2345')).toBeNull()
    expect(normalizeHouseholdCode('SHORT')).toBeNull()
  })

  it('generates a valid code and stable private credentials', () => {
    const code = generateHouseholdCode()
    expect(code).toMatch(/^BANS-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/)
    expect(householdCredentials(code)).toEqual(householdCredentials(code.toLowerCase()))
  })
})

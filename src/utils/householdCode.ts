const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const TOKEN_LENGTH = 8

export function normalizeHouseholdCode(value: string) {
  const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const token = compact.startsWith('BANS') ? compact.slice(4) : compact
  if (token.length !== TOKEN_LENGTH || [...token].some((character) => !ALPHABET.includes(character))) return null
  return token
}

export function formatHouseholdCode(value: string) {
  const token = normalizeHouseholdCode(value)
  return token ? `BANS-${token.slice(0, 4)}-${token.slice(4)}` : null
}

export function generateHouseholdCode() {
  const random = crypto.getRandomValues(new Uint8Array(TOKEN_LENGTH))
  const token = [...random].map((value) => ALPHABET[value % ALPHABET.length]).join('')
  return formatHouseholdCode(token)!
}

export function householdCredentials(value: string) {
  const token = normalizeHouseholdCode(value)
  if (!token) throw new Error('Enter a valid BANS household code.')
  return {
    code: formatHouseholdCode(token)!,
    email: `household-${token.toLowerCase()}@bans-home.app`,
    password: `BansHome-${token}-Family!`,
  }
}

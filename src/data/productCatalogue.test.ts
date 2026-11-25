import { describe, expect, it } from 'vitest'
import { matchProducts } from './productCatalogue'

describe('product catalogue matching', () => {
  it('suggests the closest product for a transposed typo', () => {
    expect(matchProducts('mikl')[0]?.name.toLowerCase()).toContain('milk')
  })

  it('matches a partial product name', () => {
    expect(matchProducts('basmathi')[0]?.name.toLowerCase()).toContain('basmathi')
  })

  it('does not suggest products for unrelated text', () => {
    expect(matchProducts('zzqvvx')).toEqual([])
  })
})

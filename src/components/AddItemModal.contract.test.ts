import { describe, expect, it } from 'vitest'
import source from './AddItemModal.tsx?raw'

describe('add-item form contract', () => {
  it('never asks the family to store a supermarket per item', () => {
    expect(source).not.toMatch(/<label>\s*Store\b/i)
    expect(source).not.toMatch(/form\.store\b/i)
  })

  it('uses Ionic content as the modal scroll owner', () => {
    expect(source).toMatch(/<IonContent[^>]*scrollY/)
    expect(source).toMatch(/expandToScroll=\{false\}/)
  })
})

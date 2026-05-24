import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRule } from '@regle/core'

describe('containsNumber custom rule', () => {
  const containsNumber = createRule({
    validator: (value: string | null | undefined) => /\d/.test(value ?? ''),
    message: 'Must contain a number',
  })

  it('returns true for values containing a digit', () => {
    const result = containsNumber.validator('abc1')
    expect(result).toBe(true)
  })

  it('returns false for values without any digit', () => {
    const result = containsNumber.validator('abcdef')
    expect(result).toBe(false)
  })

  it('returns false for empty string', () => {
    const result = containsNumber.validator('')
    expect(result).toBe(false)
  })

  it('returns false for null', () => {
    const result = containsNumber.validator(null)
    expect(result).toBe(false)
  })

  it('returns false for undefined', () => {
    const result = containsNumber.validator(undefined)
    expect(result).toBe(false)
  })
})

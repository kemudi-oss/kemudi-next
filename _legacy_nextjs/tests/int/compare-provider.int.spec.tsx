import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import React from 'react'
import { CompareProvider, useCompare } from '@/providers/CompareProvider'

// Test component that uses the compare context
function TestComponent() {
  const { providers, add, remove, isInCompare } = useCompare()

  return (
    <div>
      <span data-testid="count">{providers.length}</span>
      <span data-testid="isInCompare123">{isInCompare('123') ? 'yes' : 'no'}</span>
      <button onClick={() => add({ id: '123', name: 'Dr. Test', title: 'Psychologist', rating: 4.5, sessionFee: 150 })}>
        Add
      </button>
      <button onClick={() => remove('123')}>Remove</button>
    </div>
  )
}

describe('CompareProvider', () => {
  it('provides empty initial state', () => {
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    )

    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('isInCompare123')).toHaveTextContent('no')
  })

  it('adds item to compare', async () => {
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    )

    await act(async () => {
      screen.getByText('Add').click()
    })
    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('isInCompare123')).toHaveTextContent('yes')
  })

  it('removes item from compare', async () => {
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    )

    await act(async () => {
      screen.getByText('Add').click()
    })
    expect(screen.getByTestId('count')).toHaveTextContent('1')

    await act(async () => {
      screen.getByText('Remove').click()
    })
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('isInCompare123')).toHaveTextContent('no')
  })

  it('checks if item is in compare', async () => {
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    )

    expect(screen.getByTestId('isInCompare123')).toHaveTextContent('no')
    await act(async () => {
      screen.getByText('Add').click()
    })
    expect(screen.getByTestId('isInCompare123')).toHaveTextContent('yes')
  })
})

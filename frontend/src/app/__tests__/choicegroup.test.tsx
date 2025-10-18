// src/app/__tests__/choicegroup.test.tsx
import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChoiceGroup from '@/components/ChoiceGroup'

type Mode = 'single' | 'multi'

const OPTIONS = ['Pre-Award', 'Post-Award', 'Other (please specify)']

function setup(mode: Mode = 'single') {
  const onChange = jest.fn()
  render(<ChoiceGroup mode={mode} options={OPTIONS} onChange={onChange} />)

  const groupRole = mode === 'single' ? 'radiogroup' : 'group'
  const itemRole = mode === 'single' ? 'radio' : 'checkbox'

  const group = screen.getByRole(groupRole)
  const chips = within(group).getAllByRole(itemRole)

  return { onChange, group, chips, itemRole }
}

describe('ChoiceGroup (single)', () => {
  test('renders with correct roles and option order', () => {
    const { group, chips } = setup('single')
    expect(group).toBeInTheDocument()
    expect(chips.map(c => (c as HTMLButtonElement).textContent)).toEqual(
      OPTIONS
    )
  })

  test('selects one chip and deselects previous', async () => {
    const user = userEvent.setup()
    const { chips, onChange } = setup('single')

    // Initially all unselected
    chips.forEach(c => expect(c).toHaveAttribute('aria-checked', 'false'))

    // Click first -> selected
    await user.click(chips[0])
    expect(chips[0]).toHaveAttribute('aria-checked', 'true')
    expect(onChange).toHaveBeenLastCalledWith(['Pre-Award'])

    // Click second -> first deselected, second selected
    await user.click(chips[1])
    expect(chips[0]).toHaveAttribute('aria-checked', 'false')
    expect(chips[1]).toHaveAttribute('aria-checked', 'true')
    expect(onChange).toHaveBeenLastCalledWith(['Post-Award'])
  })
})

describe('ChoiceGroup (multi)', () => {
  test('renders with correct roles and option order', () => {
    const { group, chips } = setup('multi')
    expect(group).toBeInTheDocument()
    expect(chips.map(c => (c as HTMLButtonElement).textContent)).toEqual(
      OPTIONS
    )
  })

  test('toggles chips on/off and aggregates selection', async () => {
    const user = userEvent.setup()
    const { chips, onChange } = setup('multi')

    // Select two
    await user.click(chips[0]) // Pre-Award
    expect(chips[0]).toHaveAttribute('aria-checked', 'true')
    await user.click(chips[1]) // Post-Award
    expect(chips[1]).toHaveAttribute('aria-checked', 'true')

    // onChange should reflect current selection each time, last call has both
    expect(onChange).toHaveBeenCalled()
    expect(
      onChange.mock.calls.some(
        call => JSON.stringify(call[0]) === JSON.stringify(['Pre-Award'])
      )
    ).toBe(true)
    expect(onChange).toHaveBeenLastCalledWith(['Pre-Award', 'Post-Award'])

    // Toggle one off
    await user.click(chips[0]) // deselect Pre-Award
    expect(chips[0]).toHaveAttribute('aria-checked', 'false')
    expect(onChange).toHaveBeenLastCalledWith(['Post-Award'])
  })

  test('toggling the same chip twice ends up unchecked', async () => {
    const user = userEvent.setup()
    const { chips, onChange } = setup('multi')

    await user.click(chips[2]) // Other
    expect(chips[2]).toHaveAttribute('aria-checked', 'true')
    await user.click(chips[2]) // deselect
    expect(chips[2]).toHaveAttribute('aria-checked', 'false')

    // Last payload should be empty array
    expect(onChange).toHaveBeenLastCalledWith([])
  })
})

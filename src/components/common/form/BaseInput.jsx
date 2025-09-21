import React from 'react'
import Base from '../Base.jsx'

export const CONFIGURATION = {
	base: {
		className: `
			font-monospace-body
			disabled:cursor-not-allowed
		`
	},
	variant: {
		default: `
			bg-white border-1 border-neutral-500 text-neutral-900
			hover:bg-neutral-100 hover:border-neutral-900
			focus:bg-neutral-100 focus:border-neutral-900 focus:outline-none
			disabled:text-neutral-500 disabled:bg-neutral-100
		`,
		invisible: `
			bg-neutral-50 border-0 text-neutral-900
			hover:bg-neutral-100 hover:border-neutral-100
			focus:bg-neutral-100 focus:outline-none
			disabled:cursor-not-allowed disabled:text-neutral-500
		`
	},
	size: {
		medium: `
			px-3.5 h-8 text-sm
		`,
		large: `
			px-4 h-9 text-base
		`
	}
}

const BaseInput = (
	{
		as = 'input',
		size = 'medium',
		variant = 'default',
		inactive = false,
		placeholder = '',
		type = 'text',
		id = '',
		name = '',
		value = '',
		onChange = null,
		classNames = '',
		maxLength = null,
		...props
	}
) => {
	const [inputValue, setInputValue] = React.useState(value)

	const onInputChange = (inputChangeEvent) => {
		setInputValue(inputChangeEvent.target.value)
		if (onChange) onChange(inputChangeEvent)
	}

	const baseInputClassNames = [
		CONFIGURATION.base.className,
		CONFIGURATION.variant[variant],
		CONFIGURATION.size[size],
		classNames
	].join(' ')

	return (
		<Base as={as}
		      classNames={baseInputClassNames}
		      data-size={size}
		      data-variant={variant}
		      disabled={inactive}
		      type={type}
		      id={id}
		      name={name}
		      value={inputValue}
					placeholder={placeholder}
          maxLength={maxLength}
          size={maxLength}
					onChange={onInputChange}/>
	)
}

export default BaseInput

import React from 'react'
import Base from '../Base.jsx'
import * as Icons from '@heroicons/react/24/outline'

export const CONFIGURATION = {
	base: {
		className: `
			flex items-center justify-center gap-2 font-monospace-body
			disabled:cursor-not-allowed
			[&>input]:focus:outline-none
		`
	},
	variant: {
		default: `
			bg-white border-1 border-neutral-500 text-neutral-900
			hover:bg-neutral-100 hover:border-neutral-900
			focus:bg-neutral-100 focus:border-neutral-900
			disabled:text-neutral-500 disabled:bg-neutral-100
		`,
		invisible: `
			bg-neutral-50 border-0 text-neutral-900
			hover:bg-neutral-100 hover:border-neutral-100
			focus:bg-neutral-100
			disabled:cursor-not-allowed disabled:text-neutral-500
		`
	},
	size: {
		medium: `
			px-2 h-8 text-sm
		`,
		large: `
			px-3 h-9 text-base
		`
	},
	iconSize: {
		small: 'size-3',
		medium: 'size-5',
		large: 'size-5'
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
		id = 'id',
		name = 'name',
		value = '',
		onChange = null,
		classNames = '',
		maxLength = null,
		leadingIconName = null,
		trailingIconName = null,
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

	const LeadingIconElement = leadingIconName ? Icons[leadingIconName] : null
	const TrailingIconElement = trailingIconName ? Icons[trailingIconName] : null

	const iconClassName = [
		CONFIGURATION.iconSize[size],
		''
	].join(' ')

	const inputClassNames = [
		'w-full text-neutral-900'
	].join(' ')

	return (
		<Base as="div"
		      data-size={size}
		      data-variant={variant}
		      disabled={inactive}
		      classNames={baseInputClassNames}>
			{ LeadingIconElement && <LeadingIconElement className={iconClassName} /> }

			<Base as={as}
			      disabled={inactive}
			      type={type}
			      id={id}
			      name={name}
			      value={inputValue}
						placeholder={placeholder}
	          maxLength={maxLength}
	          size={maxLength}
						onChange={onInputChange}
            classNames={inputClassNames}
						{...props}/>

			{ TrailingIconElement && <TrailingIconElement className={iconClassName} /> }
		</Base>
	)
}

export default BaseInput

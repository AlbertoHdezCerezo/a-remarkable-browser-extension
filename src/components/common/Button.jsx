import React from 'react'

export const CONFIGURATION = {
	base: {
		className: 'cursor-pointer font-monospace-body'
	},
	variant: {
		default: `
			bg-white border-1 rounded-sm border-neutral-900
			hover:bg-neutral-900 hover:border-neutral-900 hover:text-white
			active:bg-neutral-700 active:border-neutral-700 active:text-white
		`,
		primary: `
		`,
		secondary: `
		`,
		invisible: `
		`
	},
	size: {
		small: 'px-3 py-1 text-sm',
		medium: 'px-3.5 py-1 text-base',
		large: 'px-4 py-2 text-xl'
	}
}

const Button = ({
	as = 'button',
	size = 'medium',
	variant = 'default',
	inactive = false,
	content = 'I\'m a button',
	...props
}) => {
	const Component = as ?? 'button'

	const className = [
		CONFIGURATION.base.className,
		CONFIGURATION.variant[variant],
		CONFIGURATION.size[size]
	].join(' ')

  return (
    <Component  type="button"
		            className={className}
		            data-size={size}
		            data-variant={variant}
		            disabled={inactive}>
			{content}
		</Component>
  )
}

export default Button

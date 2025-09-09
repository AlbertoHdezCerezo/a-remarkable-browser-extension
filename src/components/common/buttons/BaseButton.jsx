import React from 'react'
import Base from '../Base.jsx'

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
		small: `
			px-3 h-7 text-xs
			data-[squared=true]:w-7 data-[squared=true]:flex data-[squared=true]:items-center
			data-[squared=true]:justify-center data-[squared=true]:px-0
		`,
		medium: `
			px-3.5 h-8 text-sm
			data-[squared=true]:w-8 data-[squared=true]:flex data-[squared=true]:items-center
			data-[squared=true]:justify-center data-[squared=true]:px-0
		`,
		large: `
			px-4 h-9 text-base
			data-[squared=true]:w-9 data-[squared=true]:flex data-[squared=true]:items-center
			data-[squared=true]:justify-center data-[squared=true]:px-0
		`
	}
}

const BaseButton = (
	{
		as = 'button',
		size = 'medium',
		variant = 'default',
		inactive = false,
		squared = false,
		children,
		...props
	}
) => {
	const className = [
		CONFIGURATION.base.className,
		CONFIGURATION.variant[variant],
		CONFIGURATION.size[size],
		squared ? 'rounded-none' : 'rounded-sm',
	].join(' ')

	return (
		<Base as="button"
		      classNames={className}
		      data-size={size}
		      data-variant={variant}
		      data-squared={squared}
		      disabled={inactive}>
			{children}
		</Base>
	)
}

export default BaseButton

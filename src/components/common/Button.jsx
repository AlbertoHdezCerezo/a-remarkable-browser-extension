import React from 'react'

export const CONFIGURATION = {
	base: {
		className: ''
	},
	variant: {
		default: 'bg-white text-lg',
		primary: '',
		secondary: '',
		invisible: ''
	},
	size: {
		small: '',
		medium: '',
		large: ''
	}
}

const Button = ({
	className = '',
	size = 'medium',
	variant = 'default',
	inactive = false,
	content = 'I\'m a button',
	...props
}) => {
	const classes = [
		CONFIGURATION.base.className,
		CONFIGURATION.variant[variant],
		CONFIGURATION.size[size],
		className
	].join(' ')

  return (
    <button type='button'
            className="w-full bg-white text-black"
            data-size={size}
            data-variant={variant}
            disabled={inactive}>
			{content}
		</button>
  )
}

export default Button

import React from 'react'

export const CONFIGURATION = {
	base: {
		className: 'cursor-pointer'
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
	as = 'button',
	instanceClassName = '',
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
		CONFIGURATION.size[size],
		instanceClassName
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

import React from 'react'
import Base from './Base.jsx'

export const CONFIGURATION = {
	base: {
		className: 'font-heading font-semibold'
	},
	size: {
		small: `
			text-[20px]
		`,
		medium: `
			text-[25px]
		`,
		large: `
			text-[30px]
		`
	}
}

const Header = (
	{
		as = 'h1',
		size = 'medium',
		classNames = '',
		children,
		...props
	}
) => {
	const headerClassNames = [
		CONFIGURATION.base.className,
		CONFIGURATION.size[size],
		classNames
	].join(' ')

	return (
		<Base as={as}
		      classNames={headerClassNames}
		      data-size={size}>
			{children}
		</Base>
	)
}

export default Header
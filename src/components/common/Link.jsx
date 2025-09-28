import React from 'react'
import Base from './Base.jsx'
import * as Icons from "@heroicons/react/24/outline/index.js";

export const CONFIGURATION = {
	base: {
		className: `
			relative text-gray-700 underline font-medium
			hover:text-gray-900
		`
	}
}

const Link = (
	{
		as = 'a',
		classNames = '',
		href = '#',
		trailingIconName = null,
		children,
		...props
	}
) => {
	const trailingItem = () => {
		if (trailingIconName) {
			const iconClassNames = `
				absolute top-[-2px] right-[-10px] size-2.5
			`

			const Icon = Icons[trailingIconName]

			return <Icon className={iconClassNames}/>
		}

		return null
	}

	const linkClassNames = [
		CONFIGURATION.base.className,
		trailingIconName ? 'mr-2' : '',
		classNames
	].join(' ')

	return (
		<Base as={as}
		      href={href}
		      classNames={linkClassNames}
					{...props}>
			{children}
			{trailingItem()}
		</Base>
	)
}

export default Link
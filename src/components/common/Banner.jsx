import React from 'react'
import Base from './Base.jsx'
import * as Icons from '@heroicons/react/24/outline/index.js'

export const CONFIGURATION = {
	base: {
		className: `
			flex flex-row items-start font-heading rounded-sm
		`
	},
	variant: {
		default: `
			bg-neutral-800 text-white
		`
	},
	size: {
		small: `
			px-4 py-3 text-xs gap-2
		`
	}
}

const Banner = (
	{
		as = 'section',
		iconName = 'InformationCircleIcon',
		classNames = '',
		variant = 'default',
		size = 'small',
		children,
		...props
	}
) => {
	const icon = () => {
		if (iconName) {
			const iconClassNames = `
				size-5
			`

			const Icon = Icons[iconName]

			return <Icon className={iconClassNames}/>
		}

		return null
	}

	const bannerClassNames = [
		CONFIGURATION.base.className,
		CONFIGURATION.variant[variant],
		CONFIGURATION.size[size],
		classNames
	].join(' ')

	return (
		<Base as={as}
		      classNames={bannerClassNames}
		      {...props}>
			{icon()}
			{children}
		</Base>
	)
}

export default Banner
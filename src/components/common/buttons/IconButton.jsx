import React from 'react'
import * as Icons from '@heroicons/react/24/outline'
import classNamesSanitizer from 'classnames'
import BaseButton from './BaseButton.jsx'

export const CONFIGURATION = {
	iconSize: {
		small: 'size-2.5',
		medium: 'size-3.5',
		large: 'size-4.5'
	}
}

const IconButton = (
	{
		iconName = "TvIcon",
		...props
	}
) => {
	const iconClassName =
		classNamesSanitizer(CONFIGURATION.iconSize[props.size] || CONFIGURATION.iconSize.medium)

	const Icon = Icons[iconName || 'TvIcon']

	const iconProps = {
		...props,
		squared: true
	}

	return (
		<BaseButton {...iconProps}>
			{ Icon && <Icon className={iconClassName} /> }
		</BaseButton>
	)
}

export default IconButton

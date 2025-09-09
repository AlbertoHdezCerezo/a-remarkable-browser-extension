import React from 'react'
import classNamesSanitizer from 'classnames'
import * as Icons from '@heroicons/react/24/outline'
import BaseButton from './BaseButton.jsx'

export const CONFIGURATION = {
	iconSize: {
		small: 'size-3',
		medium: 'size-4',
		large: 'size-5'
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

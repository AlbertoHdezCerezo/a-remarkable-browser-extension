import React from 'react'
import Base from './Base.jsx'
import IconButton from './buttons/IconButton.jsx'

const ActionBarIconButton = (
	{
		...props
	}
) => {
	const actionBarIconButtonProps = {
		variant: props.variant || 'invisible',
		...props
	}

	return (
		<IconButton {...actionBarIconButtonProps} />
	)
}

const ActionBarDivider = (
	{
		...props
	}
) => {
	const classNames = [
		`
			bg-gray-300
			group-data-[direction=horizontal]:w-[0.5px] group-data-[direction=horizontal]:align-self-stretch
			group-data-[direction=vertical]:h-[0.5px] group-data-[direction=vertical]:w-full
		`,
		props.classNames || ''
	].join(' ')

	const actionBarDividerProps = {
		...props,
		as: 'div',
		classNames: classNames,
	}

	return <Base {...actionBarDividerProps} />
}

export const CONFIGURATION = {
	base: {
		className: 'group flex'
	},
	direction: {
		horizontal: 'flex-row space-x-3',
		vertical: 'flex-col space-y-3'
	}
}

const ActionBar = (
	{
		children,
		direction = 'vertical',
		...props
	}
) => {
	const classNames = [
		CONFIGURATION.base.className,
		CONFIGURATION.direction[direction],
		props.classNames || '',
	].join(' ')

	const actionBarProps = {
		...props,
		as: 'div',
		classNames: classNames,
		'aria-label': 'Action Bar',
		'data-direction': direction,
	}

	return (
		<Base {...actionBarProps}>
			{children}
		</Base>
	)
}

export default ActionBar
export { ActionBarIconButton, ActionBarDivider }

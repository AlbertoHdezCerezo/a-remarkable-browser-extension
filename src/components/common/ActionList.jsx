import React from 'react'
import * as Icons from '@heroicons/react/24/outline'
import Base from "./Base.jsx";

const ACTION_LIST_ITEM_CONFIGURATION = {
	base: {
		className: `
			flex flex-row items-center gap-3 px-4 h-10 cursor-pointer
			text-sm
			hover:bg-gray-50 cursor-pointer
			active:bg-gray-500 active:text-white
		`
	},
}

const ActionListItem = (
	{
		as = 'li',
		leadingIconName = null,
		leadingSlot = null,
		trailingSlot = null,
		children,
		...props
	}
) => {
	const leadingItem = () => {
		if (leadingIconName) {
			const Icon = Icons[leadingIconName]
			return <Icon class="size-4"/>
		} else if (leadingSlot) {
			return leadingSlot
		}

		return null
	}

	const trailingItem = () => {
		if (trailingSlot) {
			return trailingSlot
		}

		return null
	}

	const actionListItemClassNames = [
		ACTION_LIST_ITEM_CONFIGURATION.base.className,
		props.className || '',
	].join(' ')

	return (
		<Base as={as} className={actionListItemClassNames}>
			{leadingItem()}
			{children}
			<div className="flex-grow"/>
			{trailingItem()}
		</Base>
	)
}

const ACTION_LIST_CONFIGURATION = {
	base: {
		className: `
			font-body
		`
	},
}

const ActionList = (
	{
		children,
		as = 'ul',
		divider = true,
		...props
	}
) => {
	const actionListClassNames = [
		ACTION_LIST_CONFIGURATION.base.className,
		divider ? 'divide-y divide-gray-400' : '',
		props.className || '',
	].join(' ')

	return (
		<Base as={as}
					className={actionListClassNames}>
			{children}
		</Base>
	)
}

export default ActionList
export { ActionListItem }

import React from 'react'
import * as Icons from '@heroicons/react/24/outline'
import ActionBar, {ActionBarIconButton} from "./ActionBar.jsx";

const ACTION_LIST_ITEM_CONFIGURATION = {
	base: {
		className: `
			flex flex-row items-center gap-3 px-4 py-2 cursor-pointer
			text-sm
			hover:bg-gray-50 cursor-pointer
			active:bg-gray-500 active:text-white
		`
	},
}

const ActionListItem = (
	{
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
		<li className={actionListItemClassNames}>
			{leadingItem()}
			{children}
			<div className="flex-grow"/>
			{trailingItem()}
		</li>
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
		<ul className={actionListClassNames}>
			{children}
		</ul>
	)
}

export default ActionList
export { ActionListItem }

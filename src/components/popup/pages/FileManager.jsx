import React from 'react'
import Header from '../../common/Header.jsx'
import ActionList, {ActionListItem} from "../../common/ActionList.jsx";
import ActionBar, {ActionBarIconButton} from "../../common/ActionBar.jsx";

const FileNavigator = (
	{
		...props
	}
) => {
	const trailingActionBar = () => {
		return <ActionBar direction="horizontal" classNames="!space-x-0">
			<ActionBarIconButton iconName="PencilIcon"/>
			<ActionBarIconButton iconName="ArrowRightIcon"/>
			<ActionBarIconButton iconName="TrashIcon"/>
		</ActionBar>
	}

	return <ActionList >
		<ActionListItem leadingIconName="FolderIcon"
		                trailingSlot={trailingActionBar()}>
			Apuntes de Universidad
		</ActionListItem>
		<ActionListItem leadingIconName="DocumentIcon"
		                trailingSlot={trailingActionBar()}>
			Sistemas Operativos - Apuntes.pdf
		</ActionListItem>
		<ActionListItem leadingIconName="DocumentIcon"
		                trailingSlot={trailingActionBar()}>
			Redes de Computadores - Apuntes.pdf
		</ActionListItem>
	</ActionList>
}

const FileManager = (
	{
		...props
	}
) => {
	return (
		<div className="space-y-8">
			<Header as="h1" size="small">File Manager</Header>

			<div className="space-y-4">
				<FileNavigator/>

				<div className="flex items-center justify-end">
					<p className="font-body pl-8 pt-2 text-xs text-gray-500 border-t-1 border-gray-400">
						last refresh <b className="text-gray-900">3 days</b> ago. <b className="text-gray-900">12 files</b>, 4.5 MB
					</p>
				</div>
			</div>
		</div>
	)
}

export default FileManager

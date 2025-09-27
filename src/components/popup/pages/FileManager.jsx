import React from 'react'
import Header from '../../common/Header.jsx'
import ActionList, {ActionListItem} from "../../common/ActionList.jsx";
import ActionBar, {ActionBarIconButton} from "../../common/ActionBar.jsx";
import Breadcrumbs, {BreadcrumbsItem} from "../../common/Breadcrumbs.jsx";

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

	return <div className="space-y-4">
		<Breadcrumbs>
			<BreadcrumbsItem href="#">root</BreadcrumbsItem>
			<BreadcrumbsItem href="#">apuntes</BreadcrumbsItem>
			<BreadcrumbsItem href="#" current={true}>universidad</BreadcrumbsItem>
		</Breadcrumbs>

		<ActionList>
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
	</div>
}

const FileManager = (
	{
		...props
	}
) => {
	return (
		<div className="space-y-6">
			<Header as="h1" size="small">File Manager</Header>

			<div className="space-y-4">
				<FileNavigator/>

				<div className="flex items-center justify-end">
					<p className="font-heading pl-8 pt-2 text-xs text-gray-500 border-t-1 border-gray-400">
						last refresh <b className="text-gray-900">3 days</b> ago. <b className="text-gray-900">12 files</b>, 4.5 MB
					</p>
				</div>
			</div>
		</div>
	)
}

export default FileManager

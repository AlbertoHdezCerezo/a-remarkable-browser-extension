import React from 'react'
import Header from '../../common/Header.jsx'
import ActionList, {ActionListItem} from '../../common/ActionList.jsx'
import ActionBar, {ActionBarIconButton} from '../../common/ActionBar.jsx'

const DownloadNavigator = (
	{
		...props
	}
) => {
	const trailingActionBar = () => {
		return <ActionBar direction="horizontal" classNames="!space-x-0">
			<ActionBarIconButton iconName="PauseIcon"/>
			<ActionBarIconButton iconName="StopIcon"/>
			<ActionBarIconButton iconName="InformationCircleIcon"/>
		</ActionBar>
	}

	return <div>
		<ActionList>
			<ActionListItem leadingIconName="ArrowDownTrayIcon"
			                trailingSlot={trailingActionBar()}>
				Apuntes de Universidad
			</ActionListItem>
			<ActionListItem leadingIconName="DocumentCheckIcon"
			                trailingSlot={trailingActionBar()}>
				Sistemas Operativos - Apuntes.pdf
			</ActionListItem>
			<ActionListItem leadingIconName="DocumentCheckIcon"
			                trailingSlot={trailingActionBar()}>
				Redes de Computadores - Apuntes.pdf
			</ActionListItem>
		</ActionList>
	</div>
}

const DownloadManager = (
	{
		...props
	}
) => {
	return (
		<div className="space-y-6">
			<Header as="h1" size="small">Download Manager</Header>

			<div className="space-y-4">
				<DownloadNavigator/>
			</div>
		</div>
	)
}

export default DownloadManager

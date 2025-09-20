import React from 'react'
import ActionBar, {ActionBarIconButton} from '../common/ActionBar.jsx'

const Sidebar = ({...props}) => {
	return (
		<div className="h-full flex flex-col items-center justify-between p-1.5">
			<ActionBar>
				<ActionBarIconButton iconName="FolderIcon" />
			</ActionBar>

			<ActionBar>
				<ActionBarIconButton iconName="Cog6ToothIcon" />
				<ActionBarIconButton iconName="PowerIcon" />
			</ActionBar>
		</div>
	)
}

const Dashboard = ({...props}) => {
	return (
		<div className="w-[60vh] h-[40vh] flex flex-row items-center justify-center overflow-hidden
										border-1 border-neutral-900 divide-x-1 divide-neutral-500">
			<div className="h-full ">
				<Sidebar />
			</div>

			<div className="h-full flex-grow flex flex-row items-center p-6">

			</div>
		</div>
	)
}

export default Dashboard

import React from 'react'

const Sidebar = ({...props}) => {
	return (
		<div className="h-full w-16 flex flex-col">
			a
		</div>
	)
}

const Dashboard = ({...props}) => {
	return (
		<div className="w-[60vh] h-[40vh] flex flex-row items-center justify-center overflow-hidden
										border-4 border-neutral-900 rounded-[30px]">
			<div className="h-full bg-neutral-900">
				<Sidebar />
			</div>
			<div className="h-full flex-grow flex flex-row items-center p-6 bg-white">

			</div>
		</div>
	)
}

export default Dashboard

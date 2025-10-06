import React from 'react'
import Base from '../../common/Base.jsx'
import Header from '../../common/Header.jsx'
import Button from '../../common/buttons/Button.jsx'
import * as Icons from "@heroicons/react/24/outline/index.js";

const DeviceConnected = (
	{
		...props
	}
) => {
	const Icon = Icons['CheckCircleIcon']

	return (
		<Base classNames="space-y-2 w-[420px]">
			<Icon className="size-12 -ml-1"></Icon>

			<Header as="h1" size="small">Device Connected</Header>

			<div className="space-y-6">
				<p className="font-heading text-sm text-gray-500">
					Your device has been successfully connected,
					the browser extension is ready to use.
				</p>

				<div className="w-full flex flex-row justify-end">
					<Button content="upload your first file"/>
				</div>
			</div>
		</Base>
	)
}

export default DeviceConnected

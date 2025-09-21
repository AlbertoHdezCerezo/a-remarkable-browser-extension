import React from 'react'
import ActionList, {ActionListItem} from '../../components/common/ActionList.jsx'
import ActionBar, {ActionBarIconButton} from '../../components/common/ActionBar.jsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/ActionList',
	component: ActionList,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	argTypes: {
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) => {
	const trailingActionBar = () => {
		return <ActionBar direction="horizontal" classNames="!space-x-0">
			<ActionBarIconButton iconName="PencilIcon"/>
			<ActionBarIconButton iconName="ArrowRightIcon"/>
			<ActionBarIconButton iconName="TrashIcon"/>
		</ActionBar>
	}

	return <div className="w-[500px]">
		<ActionList {...args} >
			<ActionListItem leadingIconName="FolderIcon"
			                trailingSlot={trailingActionBar()}>
				List Item 1
			</ActionListItem>
			<ActionListItem leadingIconName="DocumentIcon"
			                trailingSlot={trailingActionBar()}>
				List Item 2
			</ActionListItem>
			<ActionListItem leadingIconName="DocumentIcon"
			                trailingSlot={trailingActionBar()}>
				List Item 3
			</ActionListItem>
		</ActionList>
	</div>
}

export const Playground = Template.bind({})

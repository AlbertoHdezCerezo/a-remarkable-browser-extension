import {CONFIGURATION} from '../../components/common/buttons/BaseButton.jsx'
import {CONFIGURATION as ACTION_BAR_CONFIGURATION} from '../../components/common/ActionBar.jsx'
import ActionBar from '../../components/common/ActionBar.jsx'
import {ActionBarIconButton, ActionBarDivider} from '../../components/common/ActionBar.jsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/ActionBar',
	component: ActionBar,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	argTypes: {
		direction: {
			control: {
				type: 'radio',
			},
			options: Object.keys(ACTION_BAR_CONFIGURATION.direction),
		}
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) =>
	<ActionBar {...args} >
		<ActionBarIconButton iconName="HomeIcon" />
		<ActionBarIconButton iconName="BellIcon" />
		<ActionBarDivider />
		<ActionBarIconButton iconName="TvIcon" />
	</ActionBar>

export const Playground = Template.bind({})

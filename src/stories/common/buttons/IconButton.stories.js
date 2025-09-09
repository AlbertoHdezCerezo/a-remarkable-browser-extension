import * as Icons from '@heroicons/react/24/outline'
import {CONFIGURATION} from '../../../components/common/buttons/BaseButton.jsx'
import IconButton from '../../../components/common/buttons/IconButton.jsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/Buttons/IconButton',
	component: IconButton,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	argTypes: {
		variant: {
			control: {
				type: 'radio',
			},
			options: Object.keys(CONFIGURATION.variant),
		},
		size: {
			control: {
				type: 'radio',
			},
			options: Object.keys(CONFIGURATION.size),
		},
		inactive: {
			control: {
				type: 'boolean',
			},
		},
		squared: {
			control: {
				type: 'boolean',
			},
		},
		iconName: {
			control: { type: 'select' },
			options: Object.keys(Icons)
		}
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) => <IconButton {...args} />

export const Playground = Template.bind({})

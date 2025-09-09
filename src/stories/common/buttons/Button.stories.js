import {CONFIGURATION} from '../../../components/common/buttons/BaseButton.jsx'
import Button from '../../../components/common/buttons/Button.jsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/Buttons/Button',
	component: Button,
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
		content: {
			control: {
				type: 'text'
			}
		}
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) => <Button {...args} />

export const Playground = Template.bind({})

import Button, {CONFIGURATION} from '../../components/common/Button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/Button',
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
		}
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) => <Button {...args} />

export const Playground = Template.bind({})

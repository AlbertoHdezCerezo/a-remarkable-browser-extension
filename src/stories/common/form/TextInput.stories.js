import {CONFIGURATION} from '../../../components/common/form/BaseInput.jsx'
import TextInput from '../../../components/common/form/TextInput.jsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/Form/Text',
	component: TextInput,
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
		placeholder: {
			control: {
				type: 'text'
			}
		},
		id: {
			control: {
				type: 'text'
			}
		},
		name: {
			control: {
				type: 'text'
			}
		},
		value: {
			control: {
				type: 'text'
			}
		},
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) => <TextInput {...args} />

export const Playground = Template.bind({})

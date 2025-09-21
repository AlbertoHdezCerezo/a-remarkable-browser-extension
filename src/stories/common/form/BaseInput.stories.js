import {CONFIGURATION} from '../../../components/common/form/BaseInput.jsx'
import BaseInput from '../../../components/common/form/BaseInput.jsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/Form/BaseInput',
	component: BaseInput,
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
		type: {
			control: {
				type: 'radio',
			},
			options: ['text', 'password', 'email', 'number', 'tel', 'url']
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
		maxLength: {
			control: {
				type: 'number'
			}
		},
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) => <BaseInput {...args} />

export const Playground = Template.bind({})

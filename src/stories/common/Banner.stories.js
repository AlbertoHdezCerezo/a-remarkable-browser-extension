import * as Icons from '@heroicons/react/24/outline/index.js'
import Banner, {CONFIGURATION} from '../../components/common/Banner.jsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/Banner',
	component: Banner,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	argTypes: {
		iconName: {
			control: { type: 'select' },
			options: Object.keys(Icons)
		},
		variant: {
			control: { type: 'select' },
			options: Object.keys(CONFIGURATION.variant)
		},
		size: {
			control: { type: 'select' },
			options: Object.keys(CONFIGURATION.size)
		}
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) =>
	<Banner {...args}>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
	</Banner>

export const Playground = Template.bind({})

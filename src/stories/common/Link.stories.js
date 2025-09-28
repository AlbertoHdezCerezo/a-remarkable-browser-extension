import Link, {CONFIGURATION} from '../../components/common/Link.jsx'
import * as Icons from "@heroicons/react/24/outline/index.js";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/Link',
	component: Link,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	argTypes: {
		trailingIconName: {
			control: { type: 'select' },
			options: Object.keys(Icons)
		}
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) =>
	<p className="text-base text-gray-500">
		This is a <Link {...args} >link</Link> to a webpage.
	</p>

export const Playground = Template.bind({})

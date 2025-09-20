import Header, {CONFIGURATION} from '../../components/common/Header.jsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/Header',
	component: Header,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	argTypes: {
		size: {
			control: {
				type: 'radio',
			},
			options: Object.keys(CONFIGURATION.size),
		},
		as: {
			control: {
				type: 'radio',
			},
			options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
		}
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) =>
	<Header {...args} >
		Header {args.as} (size: {args.size})
	</Header>

export const Playground = Template.bind({})

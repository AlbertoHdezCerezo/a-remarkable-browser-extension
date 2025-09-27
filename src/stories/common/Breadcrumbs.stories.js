import Breadcrumbs, {BreadcrumbsItem, BREADCRUMBS_CONFIGURATION} from '../../components/common/Breadcrumbs.jsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/Breadcrumbs',
	component: Breadcrumbs,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	argTypes: {
		variant: {
			control: {
				type: 'radio',
			},
			options: Object.keys(BREADCRUMBS_CONFIGURATION.variant),
		},
		size: {
			control: {
				type: 'radio',
			},
			options: Object.keys(BREADCRUMBS_CONFIGURATION.size),
		}
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) => {
	return (
		<Breadcrumbs {...args}>
			<BreadcrumbsItem href="#">root</BreadcrumbsItem>
			<BreadcrumbsItem href="#">apuntes</BreadcrumbsItem>
			<BreadcrumbsItem href="#" current={true}>matemáticas</BreadcrumbsItem>
		</Breadcrumbs>
	)
}

export const Playground = Template.bind({})

import Dashboard from '../../components/popup/Dashboard.jsx'

const meta = {
	title: 'PopUp/Dashboard',
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	component: Dashboard
}

export default meta;

const Template = (args) => <Dashboard {...args} />

export const Playground = Template.bind({})

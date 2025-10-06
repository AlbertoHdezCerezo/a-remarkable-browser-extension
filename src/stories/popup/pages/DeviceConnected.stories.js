import DeviceConnected from '../../../components/popup/pages/DeviceConnected.jsx'

const meta = {
	title: 'PopUp/Pages/DeviceConnected',
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	component: DeviceConnected
}

export default meta

const Template = (args) => (
	<DeviceConnected {...args}/>
)

export const Playground = Template.bind({})

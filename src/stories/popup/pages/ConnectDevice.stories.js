import ConnectDevice from '../../../components/popup/pages/ConnectDevice.jsx'

const meta = {
	title: 'PopUp/Pages/ConnectDevice',
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	component: ConnectDevice
}

export default meta;

const Template = (args) => <ConnectDevice {...args} />

export const Playground = Template.bind({})

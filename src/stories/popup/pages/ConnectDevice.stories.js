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

const pairDeviceCallback = async (code) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (code === '123456') {
				resolve(true)
			} else {
				reject(new Error('Invalid pairing code'))
			}
		}, 5000)
	})
}

const Template = (args) => (
	<ConnectDevice
		pairDeviceCallback={pairDeviceCallback}
		{...args}/>
)

export const Playground = Template.bind({})

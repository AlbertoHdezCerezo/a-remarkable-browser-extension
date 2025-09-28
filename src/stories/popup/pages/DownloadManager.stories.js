import DownloadManager from '../../../components/popup/pages/DownloadManager.jsx'

const meta = {
	title: 'PopUp/Pages/DownloadManager',
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	component: DownloadManager
}

export default meta;

const Template = (args) => <DownloadManager {...args} />

export const Playground = Template.bind({})

import FileManager from '../../../components/popup/pages/FileManager.jsx'

const meta = {
	title: 'PopUp/Pages/FileManager',
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	component: FileManager
}

export default meta;

const Template = (args) => <FileManager {...args} />

export const Playground = Template.bind({})

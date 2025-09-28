import {useState} from 'react'
import CodeInput from '../../../components/common/form/CodeInput.jsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Common/Form/CodeInput',
	component: CodeInput,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	argTypes: {
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs']
}

export default meta;

const Template = (args) => {
	const [value, setValue] = useState('')

	return <div className="space-y-4">
		<CodeInput  code={value}
                setCode={setValue}
		            {...args} />

		<p className="font-heading text-gray-500">
			This is your code: <span className="text-gray-900 underline">{value}</span>
		</p>
	</div>
}

export const Playground = Template.bind({})

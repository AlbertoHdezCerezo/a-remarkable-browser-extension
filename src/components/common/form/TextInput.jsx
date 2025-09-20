import React from 'react'
import BaseInput from './BaseInput.jsx'

const TextInput = (
	{
		...props
	}
) => {
	return (
		<BaseInput {...props} type={'text'}/>
	)
}

export default TextInput

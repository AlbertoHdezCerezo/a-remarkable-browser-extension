import React from 'react'
import BaseButton from './BaseButton.jsx'

const Button = (
	{
		content = "I'm a button",
		...props
	}
) => {
	return (
		<BaseButton {...props}>
			{content}
		</BaseButton>
	)
}

export default Button

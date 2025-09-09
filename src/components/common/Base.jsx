import React from 'react'
import classNamesSanitizer from 'classnames'

const Base = (
	{
		as = 'div',
		classNames = '',
		...props
	}
) => {
	// Component tag element
	const Tag = as ?? 'div'

	// Set of classes attached to component tag element
	const baseClassNames = classNamesSanitizer(classNames)

	return (
		<Tag class={baseClassNames} {...props}></Tag>
	)
}

export default Base
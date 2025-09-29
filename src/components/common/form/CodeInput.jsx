import React, {useEffect, useRef} from 'react'
import Base from '../Base.jsx'
import TextInput from './TextInput.jsx'

const CodeInput = (
	{
		code,
		setCode,
		codeLength = 6,
		disabled = false,
		onChange = null,
		...props
	}
) => {
	const inputsWrapperRef = useRef(null)

	const codeInputs = () => {
		return [...inputsWrapperRef.current.querySelectorAll('input')]
	}

	const focusInput = (index, offset = null) => {
		const inputs = codeInputs()
		inputs[index < (inputs.length - 1) ? index : inputs.length - 1]?.focus()
		if (offset !== null) inputs[index]?.setSelectionRange(offset, offset)
	}

	const handlePaste = (event) => {
		event.preventDefault()

		const pastedText = event.clipboardData.getData("text").slice(0, codeLength)

		setCode(pastedText)
		focusInput(pastedText.length)
	}

	const handleTextInputChange = ({target}) => {
		if (disabled) return

		const inputs = codeInputs()

		const changedTextInputIndex = inputs.indexOf(target)

		const newCode =
			inputs
				.map((input, index) => {
					if (index === changedTextInputIndex) {
						return target.value
					} else {
						return input.value
					}
				})
				.join('')

		setCode(newCode)

		if (changedTextInputIndex < inputs.length - 1 && target.value !== '')
			focusInput(changedTextInputIndex + 1)
	}

	const handleKeyboardNavigation = ({code, target}) => {
		const inputValue = target.value
		const inputIndex = codeInputs().indexOf(target)

		switch (code) {
			case 'Backspace': {
				if (inputValue === '' && inputIndex > 0)
					focusInput(inputIndex - 1, 1)
				break
			}
			case 'ArrowLeft': {
				if (inputIndex > 0)
					focusInput(inputIndex - 1)
				break
			}
			case 'ArrowRight': {
				if (inputIndex < codeLength - 1)
					focusInput(inputIndex + 1)
				break
			}
		}
	}

	const refreshInputs = () => {
		codeInputs().forEach((input, index) => { input.value = code?.[index] || '' })
	}

	useEffect(refreshInputs, [code])

	const classNames = `
		flex flex-row gap-3 items-center
	`

	const textInputClassNames = `
		!w-10 !h-10 !p-0
		[&>input]:text-center [&>input]:text-large [&>input]:font-semibold
		[&>input]:font-heading [&>input]:uppercase
	`

	return (
		<Base classNames={classNames}
		      ref={inputsWrapperRef}>
			{
				Array
					.from({ length: codeLength })
					.map((_, index) => (
						<TextInput  key={index}
						            maxLength={1}
						            disabled={disabled}
						            classNames={textInputClassNames}
						            onPaste={handlePaste}
						            onChange={handleTextInputChange}
												onKeyDown={handleKeyboardNavigation}/>))
			}
		</Base>
	)
}

export default CodeInput
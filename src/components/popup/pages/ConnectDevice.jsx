import React from 'react'
import TextInput from "../../common/form/TextInput.jsx";

const PAIR_CODE_LENGTH = 6

const ConnectDevice = ({...props}) => {
	return (
		<div>
			<TextInput  maxLength={PAIR_CODE_LENGTH}
			            size="huge"
									classNames="tracking-[.25em] uppercase font-bold"/>
		</div>
	)
}

export default ConnectDevice

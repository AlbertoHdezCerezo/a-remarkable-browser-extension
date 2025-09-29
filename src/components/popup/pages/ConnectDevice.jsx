import React, {useEffect, useRef, useState} from 'react'
import Base from '../../common/Base.jsx'
import Link from '../../common/Link.jsx'
import Header from '../../common/Header.jsx'
import Banner from '../../common/Banner.jsx'
import CodeInput from '../../common/form/CodeInput.jsx'

const ConnectDevice = (
	{
		pairDeviceCallback = null,
		...props
	}
) => {
	const [pairing, setPairing] = useState(false)
	const [error, setError] = useState(null)
	const [code, setCode] = useState(null)

	const pairDevice = async () => {
		setPairing(true)

		const pairingCode = code

		try {
			if(!!pairDeviceCallback) await pairDeviceCallback(pairingCode)
		} catch (error) {
			setCode('')
			setError(error.message)
		} finally {
			setPairing(false)
		}
	}

	const canPair = () => { return !pairing && code && code.length === 6 }

	useEffect(() => {
		if (canPair()) pairDevice()
	}, [code])

	return (
		<Base classNames="space-y-2 w-[420px]">
			<Header as="h1" size="small">Connect Device</Header>

			<div className="space-y-6">
				<p className="font-heading text-sm text-gray-500">
					Request a pairing code via <Link href="https://my.remarkable.com/pair"
					      trailingIconName="ArrowTopRightOnSquareIcon"
								target="_blank">
						my.reMarkable
					</Link>, and insert it below to connect browser extension with your reMarkable device.
				</p>

				<div className="flex flex-row gap-6 items-center">
					<CodeInput  codeLength={6}
											code={code}
											setCode={setCode}
											disabled={pairing}/>

					{
						pairing &&
						<div className='h-4 w-4 rounded-full bg-gray-200 animate-ping'/>
					}
				</div>

				{
					error === null &&
					<Banner>
						<p>
							The token issued after pairing will be stored locally in your browser.
							To unpair your device visit <Link href="https://my.remarkable.com/device/browser"
							classNames="text-neutral-200 hover:text-white"
							trailingIconName="ArrowTopRightOnSquareIcon">my.reMarkable</Link>
						</p>
					</Banner>
				}

				{
					error !== null &&
					<Banner iconName="ExclamationTriangleIcon">
						<p>
							Pairing attempt failed. Your pairing code might
							be incorrect or expired. Please try again...
						</p>
					</Banner>
				}
			</div>
		</Base>
	)
}

export default ConnectDevice

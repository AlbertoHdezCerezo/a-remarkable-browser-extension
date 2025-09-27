import React from 'react'
import Base from './Base.jsx'

export const BREADCRUMBS_ITEM_CONFIGURATION = {
	base: {
		className: `
			group/breadcrumbs-item
			font-body text-xs
			[&>a]underline
		`
	}
}

const BreadcrumbsItem = (
	{
		as = 'li',
		href = '#',
		current = false,
		children,
		...props
	}
) => {
	const breadcrumbsItemClassName = [
		BREADCRUMBS_ITEM_CONFIGURATION.base.className,
		current ? 'text-neutral-900 font-semibold pointer-events-none' : 'text-neutral-500',
	].join(' ')

	return <Base as={as}
	             classNames={breadcrumbsItemClassName}
	             {...props}>
		<a  href={href}
				className="group-hover/breadcrumbs-item:underline">
			{children}
		</a>
	</Base>
}

export const BREADCRUMBS_CONFIGURATION = {
	base: {
		className: `
			flex flex-row items-center
			font-body text-xs
			[&>ol>li]:after:content-['/'] [&>ol>li]:after:mx-1
			[&>ol>li:last-child]:after:content-none [&>ol>li:last-child]:after:decoration-none
		`
	},
	variant: {
		default: `
		`
	},
	size: {
		medium: `
		`
	}
}

const Breadcrumbs = (
	{
		as = 'nav',
		size = 'medium',
		variant = 'default',
		children,
		...props
	}
) => {
	const className = [
		BREADCRUMBS_CONFIGURATION.base.className,
		BREADCRUMBS_CONFIGURATION.variant[variant],
		BREADCRUMBS_CONFIGURATION.size[size],
	].join(' ')

	return (
		<Base as={as}
		      classNames={className}
		      data-size={size}
		      data-variant={variant}>
			<ol className="contents">
				{children}
			</ol>
		</Base>
	)
}

export default Breadcrumbs
export { BreadcrumbsItem }

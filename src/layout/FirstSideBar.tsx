import { FC } from 'react';

interface ButtonElement {
	id: string;
	type: 'button';
	label: string;
	onClick: () => void;
}

interface LinkElement {
	id: string;
	type: 'link';
	label: string;
	href: string;
	target: '_blank' | '_self';
}

interface IconElement {
	id: string;
	type: 'icon';
	icon: string;
	label: string;
	onClick: () => void;
}

type Element = ButtonElement | LinkElement | IconElement; // Универсальный тип для элементов

const FirstSideBar: FC = () => {
	const elements: Element[] = [
		{
			id: 'btn-1',
			type: 'button',
			label: 'Button 1',
			onClick: () => alert('Button 1 clicked'),
		},
		{
			id: 'link-1',
			type: 'link',
			label: 'Link 1',
			href: '#',
			target: '_blank',
		},
		{
			id: 'icon-1',
			type: 'icon',
			icon: '🔍',
			label: 'Search',
			onClick: () => alert('Search clicked'),
		},
		{
			id: 'btn-2',
			type: 'button',
			label: 'Button 2',
			onClick: () => alert('Button 2 clicked'),
		},
		{ id: 'link-2', type: 'link', label: 'Link 2', href: '#', target: '_self' },
		{
			id: 'icon-2',
			type: 'icon',
			icon: '📈',
			label: 'Stats',
			onClick: () => alert('Stats clicked'),
		},
		{
			id: 'btn-3',
			type: 'button',
			label: 'Button 3',
			onClick: () => alert('Button 3 clicked'),
		},
		{
			id: 'link-3',
			type: 'link',
			label: 'Link 3',
			href: '#',
			target: '_blank',
		},
		{
			id: 'icon-3',
			type: 'icon',
			icon: '⚙️',
			label: 'Settings',
			onClick: () => alert('Settings clicked'),
		},
		{
			id: 'btn-4',
			type: 'button',
			label: 'Button 4',
			onClick: () => alert('Button 4 clicked'),
		},
	];

	return (
		<aside className='flex flex-col items-center bg-dark-primary border-r border-black h-full p-4'>
			<h2 className='text-xl font-bold mb-6'>1</h2>
			<div className='flex flex-col items-center justify-around w-1/2 gap-12'>
				{elements.map(element => (
					<div key={element.id}>
						{element.type === 'button' && (
							<button id={element.id} onClick={element.onClick}>
								{element.label}
							</button>
						)}
						{element.type === 'link' && (
							<a
								id={element.id}
								href={element.href}
								target={element.target}
								rel='noopener noreferrer'
								className='text-primary underline'
							>
								{element.label}
							</a>
						)}
						{element.type === 'icon' && (
							<div
								id={element.id}
								onClick={element.onClick}
								className='flex items-center cursor-pointer'
							>
								<span className='text-xl'>{element.icon}</span>{' '}
								<span className='ml-2'>{element.label}</span>
							</div>
						)}
					</div>
				))}
			</div>
		</aside>
	);
};

export default FirstSideBar;

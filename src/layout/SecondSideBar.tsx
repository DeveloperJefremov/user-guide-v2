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

type Element = ButtonElement | LinkElement | IconElement; // Общий тип для элементов

const SecondSideBar: FC = () => {
	const elements: Element[] = [
		{
			id: 'btn-5',
			type: 'button',
			label: 'Button 5',
			onClick: () => alert('Button 5 clicked'),
		},
		{
			id: 'link-4',
			type: 'link',
			label: 'Link 4',
			href: '#',
			target: '_blank',
		},
		{
			id: 'icon-4',
			type: 'icon',
			icon: '📅',
			label: 'Calendar',
			onClick: () => alert('Calendar clicked'),
		},
		{
			id: 'btn-6',
			type: 'button',
			label: 'Button 6',
			onClick: () => alert('Button 6 clicked'),
		},
		{ id: 'link-5', type: 'link', label: 'Link 5', href: '#', target: '_self' },
		{
			id: 'icon-5',
			type: 'icon',
			icon: '📋',
			label: 'Checklist',
			onClick: () => alert('Checklist clicked'),
		},
		{
			id: 'btn-7',
			type: 'button',
			label: 'Button 7',
			onClick: () => alert('Button 7 clicked'),
		},
		{
			id: 'link-6',
			type: 'link',
			label: 'Link 6',
			href: '#',
			target: '_blank',
		},
		{
			id: 'icon-6',
			type: 'icon',
			icon: '📞',
			label: 'Contact',
			onClick: () => alert('Contact clicked'),
		},
		{
			id: 'btn-8',
			type: 'button',
			label: 'Button 8',
			onClick: () => alert('Button 8 clicked'),
		},
	];

	return (
		<aside className='flex flex-col items-center bg-muted border-r border-black h-full p-4'>
			<h2 className='text-xl font-bold mb-6'>2</h2>
			<div className='flex flex-col items-center justify-around gap-12'>
				{elements.map(element => (
					<div key={element.id} className='w-full'>
						{element.type === 'button' && (
							<button type='button' id={element.id} onClick={element.onClick}>
								{element.label}
							</button>
						)}
						{element.type === 'link' && (
							<a
								id={element.id}
								href={element.href}
								target={element.target}
								rel='noopener noreferrer'
								className='w-full text-primary underline block text-center'
							>
								{element.label}
							</a>
						)}
						{element.type === 'icon' && (
							<div
								id={element.id}
								onClick={element.onClick}
								className='flex items-center justify-center cursor-pointer'
							>
								<span className='text-xl'>{element.icon}</span>
								<span className='ml-2'>{element.label}</span>
							</div>
						)}
					</div>
				))}
			</div>
		</aside>
	);
};

export default SecondSideBar;

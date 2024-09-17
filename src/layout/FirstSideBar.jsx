import styles from './FirstSideBar.module.css';
function FirstSideBar() {
	const elements = [
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
		<aside className={styles.FirstSideBar}>
			<h2>1 </h2>
			<div className={styles.FirstSideBar__elements}>
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
							>
								{element.label}
							</a>
						)}
						{element.type === 'icon' && (
							<div id={element.id} onClick={element.onClick}>
								<span className={styles['icon']}>{element.icon}</span>
								{element.label}
							</div>
						)}
					</div>
				))}
			</div>
		</aside>
	);
}

export default FirstSideBar;

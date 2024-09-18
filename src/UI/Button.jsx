import React from 'react';

const Button = ({ children, variant = 'default', size = 'md', ...props }) => {
	const variantMap = {
		grey: 'bg-gray-600 text-white hover:opacity-80',
		lightGrey: 'bg-gray-300 text-black hover:opacity-80',
		default: 'bg-blue-500 text-white hover:opacity-80',
	};

	const sizeMap = {
		icon: 'w-6 h-6 p-1',
		sm: 'h-10 px-2 py-1 rounded',
		md: 'h-12 px-4 py-2 rounded',
		lg: 'h-14 px-5 py-2.5 rounded',
	};

	return (
		<button
			type='button'
			className={`inline-flex items-center justify-center border border-transparent cursor-pointer transition-colors duration-200 rounded-lg ${variantMap[variant]} ${sizeMap[size]}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;

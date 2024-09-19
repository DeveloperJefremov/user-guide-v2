import { FC, ReactNode } from 'react';
import GuideSetsList from '../components/sets/GuideSetsList';

const MainContentHeader: FC<{ title: string; description: string }> = ({
	title,
	description,
}) => {
	return (
		<header className='flex flex-col items-center justify-center p-5 border-b border-gray-300'>
			<h1 className='mb-2 text-center text-2xl font-bold'>{title}</h1>
			<p className='text-center text-base mb-5 leading-relaxed'>
				{description}
			</p>
			{/* <Button
				size='lg'
				variant='lightGrey'
				className='absolute top-5 right-5'
			>
				Login as admin
			</Button> */}
		</header>
	);
};

const MainContentBody: FC<{ children: ReactNode }> = ({ children }) => {
	return <main className='w-11/12 mx-auto p-5'>{children}</main>;
};
const MainContentFooter: FC<{ info: string }> = ({ info }) => {
	return (
		<footer className='flex justify-center border-t border-gray-300 p-4'>
			<small className='pt-2 text-center'>{info}</small>
		</footer>
	);
};

const MainContent: FC = () => {
	return (
		<section className='grid grid-rows-[150px_1fr_50px] h-full overflow-y-auto bg-background p-5'>
			<MainContentHeader
				title='User Guide'
				description='User guides are a type of technical documentation that enables customers and end-users with step-by-step instructions on how to execute a task or process.'
			/>
			<MainContentBody>
				<GuideSetsList />
			</MainContentBody>
			<MainContentFooter info='2024 Your Company. All rights reserved.' />
		</section>
	);
};

export default MainContent;

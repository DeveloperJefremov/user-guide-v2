import React, { useState } from 'react';
import Button from '../../UI/Button';
import GuideStepsList from '../steps/GuideStepsList';

export default function GuideSet({
	isGuideModalOpen,
	onModeChange,
	mode,
	activeGuideSetId,
	onLaunchSet,
	guideSet,
	handleEditSet,
	handleDeleteSet,
	handleStepsIdListUpdate,
}) {
	const [isShownSet, setIsShownSet] = useState(false);

	if (!guideSet) return null;

	const displayHandler = () => {
		// Просто переключаем состояние без использования data-атрибута
		setIsShownSet(prevState => !prevState);
	};

	return (
		<section className='border border-black grid grid-rows-[100px_1fr] p-10 rounded-lg mb-5 bg-white'>
			<GuideSetHeader
				isShownSet={isShownSet}
				handleEditSet={handleEditSet}
				handleDeleteSet={handleDeleteSet}
				title={guideSet.setHeader}
				onDisplayChange={displayHandler}
			/>

			<div
				className={isShownSet ? 'opacity-100 max-h-full' : 'opacity-0 max-h-0'}
			>
				<GuideSetBody isShownSet={isShownSet}>
					<GuideStepsList
						isGuideModalOpen={isGuideModalOpen}
						guideSetId={guideSet.id}
						activeGuideSetId={activeGuideSetId}
						mode={mode}
						onModeChange={onModeChange}
						handleStepsIdListUpdate={handleStepsIdListUpdate}
					/>
				</GuideSetBody>

				<GuideSetFooter onLaunchSet={onLaunchSet} isShownSet={isShownSet} />
			</div>
		</section>
	);
}

const GuideSetHeader = ({
	isShownSet,
	handleDeleteSet,
	handleEditSet,
	title,
	onDisplayChange,
}) => {
	let displayButtonText = !isShownSet ? '+' : '-';

	return (
		<header className='flex justify-between items-center'>
			<h3>{title}</h3>
			<div className='flex gap-7 items-center pr-2.5'>
				<Button onClick={handleEditSet} variant='lightGrey' size='lg'>
					Edit: Tutorial
				</Button>
				<Button onClick={handleDeleteSet} variant='default' size='lg'>
					Delete: Tutorial
				</Button>

				<Button size='icon' variant='lightGrey' onClick={onDisplayChange}>
					{displayButtonText}
				</Button>
			</div>
		</header>
	);
};

const GuideSetBody = ({ children, isShownSet }) => {
	return (
		<main
			className={`transition-opacity duration-300 ${
				isShownSet ? 'opacity-100 max-h-full' : 'opacity-0 max-h-0'
			} overflow-hidden`}
		>
			{children}
		</main>
	);
};

const GuideSetFooter = ({ onLaunchSet, isShownSet }) => {
	return (
		<footer
			className={`${
				isShownSet ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0'
			} transition-all duration-300 overflow-hidden`}
		>
			{onLaunchSet && (
				<Button onClick={onLaunchSet} variant='default' size='lg'>
					Launch: Tutorial
				</Button>
			)}
		</footer>
	);
};

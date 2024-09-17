import React, { useState } from 'react';
import Button from '../../UI/Button';
import GuideStepsList from '../steps/GuideStepsList';
import styles from './GuideSet.module.css';

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
		<section className={styles.guideSet}>
			<GuideSetHeader
				isShownSet={isShownSet}
				handleEditSet={handleEditSet}
				handleDeleteSet={handleDeleteSet}
				title={guideSet.setHeader}
				onDisplayChange={displayHandler}
			/>

			<div className={isShownSet ? styles.expanded : styles.folded}>
				<GuideSetBody isShownSet={isShownSet}>
					<GuideStepsList
						isGuideModalOpen={isGuideModalOpen}
						guideSetId={guideSet.id} // Передаём id набора
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
		<header className={styles.guideSetHeader}>
			<h3>{title}</h3>
			<div className={styles.guideSetHeader__buttonContainer}>
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
	let cssClassList = `${styles.setBody} ${isShownSet ? styles.expanded : ''} ${
		!isShownSet ? styles.folded : ''
	}`;

	return <main className={cssClassList}>{children}</main>;
};

const GuideSetFooter = ({ onLaunchSet, isShownSet }) => {
	let cssClassList = `${styles.setFooter} ${
		isShownSet ? styles.expanded : ''
	} ${!isShownSet ? styles.folded : ''}`;

	return (
		<footer className={cssClassList}>
			{onLaunchSet && (
				<Button onClick={onLaunchSet} variant='default' size='lg'>
					Launch: Tutorial
				</Button>
			)}
		</footer>
	);
};

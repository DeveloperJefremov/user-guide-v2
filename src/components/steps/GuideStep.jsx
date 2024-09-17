import { useState } from 'react';
import Button from '../../UI/Button';

import styles from './GuideStep.module.css';

export default function GuideStep({
	step,

	handleEditStep,
	handleDeleteStep,
}) {
	const [isShownStep, setIsShownStep] = useState(false);
	// const [formData, setFormData] = useState({
	// 	title: step.title,
	// 	description: step.description,
	// 	pageUrl: step.pageUrl,
	// 	elementId: step.elementId,
	// 	imgChecked: step.imgChecked,
	// 	imgWidth: step.imgWidth,
	// 	imgHeight: step.imgHeight,
	// 	imageUrl: step.imageUrl,
	// });

	// const handleImgCheckboxChange = async event => {};

	const displayHandler = clickEvent => {
		const buttonClick = clickEvent.target.getAttribute('data-button-clicked');

		if (buttonClick === 'display') {
			setIsShownStep(prevState => !prevState);
		}
	};

	return (
		<section className={styles.step}>
			<GuideStepHeader
				handleDeleteStep={handleDeleteStep}
				handleEditStep={handleEditStep}
				isShownStep={isShownStep}
				onDisplayChange={displayHandler}
				step={step}
			/>
			<GuideStepBody isShownStep={isShownStep} step={step} />
			<GuideStepFooter isShownStep={isShownStep} />
		</section>
	);
}

const GuideStepHeader = ({
	handleDeleteStep,
	handleEditStep,
	isShownStep,
	onDisplayChange,
	step,
}) => {
	let displayButtonText = isShownStep ? '-' : '+';

	return (
		<header className={styles.stepHeader}>
			<div className={styles.stepHeader__text}>
				<h4>{step.title}</h4>
				<h5>Order: {step.order}</h5>
			</div>
			<div className={styles.stepHeader__buttonContainer}>
				<Button size='sm' variant='grey' onClick={handleEditStep}>
					Edit
				</Button>

				<Button
					size='sm'
					variant='default'
					data-button-clicked='delete'
					onClick={handleDeleteStep}
				>
					Delete
				</Button>
				<Button
					size='icon'
					variant='lightGrey'
					data-button-clicked='display'
					onClick={onDisplayChange}
				>
					{displayButtonText}
				</Button>
			</div>
		</header>
	);
};

const GuideStepBody = ({
	step,

	isShownStep,
}) => {
	let cssClassList = `${styles.stepBody} ${
		isShownStep ? styles.expanded : ''
	} ${!isShownStep ? styles.folded : ''}`;

	return (
		<section className={cssClassList}>
			<article className={styles.stepBodyContent}>
				<div className={styles.stepBodyContent__container}>
					<form className={styles.stepBodyContent__form}>
						{step.description && (
							<label htmlFor='description'>
								Description:
								<textarea
									id='description'
									className={styles.textarea}
									name='description'
									value={step.description}
									disabled
								/>
							</label>
						)}
						{step.pageUrl && (
							<label htmlFor='PageUrl'>
								PageUrl:
								<input
									id='pageUrl'
									className={styles.input}
									type='text'
									name='pageUrl'
									value={step.pageUrl}
									disabled
								/>
							</label>
						)}
						{step.elementId && (
							<label htmlFor='elementId'>
								Element ID:
								<input
									id='elementId'
									className={styles.input}
									type='text'
									name='elementId'
									value={step.elementId}
									disabled
								/>
							</label>
						)}
					</form>
					{step.imgChecked && step.imageUrl && (
						<fieldset className={styles.stepBodyContent__image}>
							<legend>Image Section</legend>
							<label htmlFor='imgWidth'>
								Image Width:
								<input
									id='imgWidth'
									type='number'
									name='imgWidth'
									min='1'
									value={step.imgWidth}
									className={styles.input}
									disabled
								/>
							</label>
							<label>
								Image Height:
								<input
									id='imgHeight'
									type='number'
									name='imgHeight'
									min='1'
									value={step.imgHeight}
									className={styles.input}
									disabled
								/>
							</label>
							<img
								className={styles.stepImagePreview}
								src={step.imageUrl}
								alt={step.title}
								width={step.imgWidth}
								height={step.imgHeight}
							/>
						</fieldset>
					)}
				</div>
			</article>
		</section>
	);
};

const GuideStepFooter = ({ isShownStep }) => {
	const cssClassList = `${styles.stepFooter} ${
		isShownStep ? styles.expanded : ''
	} ${!isShownStep ? styles.folded : ''}`;

	return <footer className={cssClassList}></footer>;
};

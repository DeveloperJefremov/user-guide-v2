import { useState } from 'react';
import Button from '../../UI/Button';

export default function GuideStep({ step, handleEditStep, handleDeleteStep }) {
	const [isShownStep, setIsShownStep] = useState(false);

	const displayHandler = () => {
		setIsShownStep(prevState => !prevState); // Переключение состояния показа
	};

	return (
		<section className='border p-5 my-3'>
			<GuideStepHeader
				handleDeleteStep={handleDeleteStep}
				handleEditStep={handleEditStep}
				isShownStep={isShownStep}
				onDisplayChange={displayHandler} // Передаем корректную функцию
				step={step}
			/>
			{isShownStep && <GuideStepBody isShownStep={isShownStep} step={step} />}{' '}
			{/* Показываем тело шага только если состояние isShownStep true */}
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
		<header className='flex justify-between items-center'>
			<div>
				<h4 className='font-bold'>{step.title}</h4>
				<h5 className='text-sm'>Order: {step.order}</h5>
			</div>
			<div className='flex items-center gap-4'>
				<Button size='sm' variant='grey' onClick={handleEditStep}>
					Edit
				</Button>
				<Button size='sm' variant='default' onClick={handleDeleteStep}>
					Delete
				</Button>
				<Button
					size='icon'
					variant='lightGrey'
					onClick={onDisplayChange} // Вызываем функцию изменения состояния
				>
					{displayButtonText} {/* Отображаем символ "+" или "-" */}
				</Button>
			</div>
		</header>
	);
};

const GuideStepBody = ({ step }) => {
	return (
		<section className='transition-all duration-300 max-h-screen opacity-100 flex justify-center items-start p-8'>
			<article className='flex justify-between gap-10 max-w-4xl w-full'>
				<form className='flex-1 flex flex-col'>
					{step.description && (
						<label htmlFor='description'>
							Description:
							<textarea
								id='description'
								className='border h-24 p-2 rounded mb-2 w-full resize-none'
								value={step.description}
								disabled
							/>
						</label>
					)}
					{step.pageUrl && (
						<label htmlFor='pageUrl'>
							PageUrl:
							<input
								id='pageUrl'
								className='border p-2 rounded mb-2 w-full'
								type='text'
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
								className='border p-2 rounded mb-2 w-full'
								type='text'
								value={step.elementId}
								disabled
							/>
						</label>
					)}
				</form>
				{step.imgChecked && step.imageUrl && (
					<fieldset className='flex flex-col items-center gap-4'>
						<legend>Image Section</legend>
						<label htmlFor='imgWidth'>
							Image Width:
							<input
								id='imgWidth'
								type='number'
								className='border p-2 rounded w-full'
								value={step.imgWidth}
								disabled
							/>
						</label>
						<label htmlFor='imgHeight'>
							Image Height:
							<input
								id='imgHeight'
								type='number'
								className='border p-2 rounded w-full'
								value={step.imgHeight}
								disabled
							/>
						</label>
						<img
							className='border rounded max-w-full'
							src={step.imageUrl}
							alt={step.title}
							width={step.imgWidth}
							height={step.imgHeight}
						/>
					</fieldset>
				)}
			</article>
		</section>
	);
};

const GuideStepFooter = ({ isShownStep }) => {
	return (
		<footer
			className={`transition-all duration-300 ${
				isShownStep ? 'opacity-100' : 'opacity-0'
			}`}
		></footer>
	);
};

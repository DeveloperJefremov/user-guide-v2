import { FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StepType } from '../../data/types';
import Button from '../../UI/Button';

interface GuideStepProps {
	step: StepType;
	handleEditStep: () => void;
	handleDeleteStep: () => void;
}

const GuideStep: FC<GuideStepProps> = ({
	step,
	handleEditStep,
	handleDeleteStep,
}) => {
	const [isShownStep, setIsShownStep] = useState<boolean>(false);

	const displayHandler = useCallback(() => {
		setIsShownStep(prevState => !prevState); // Переключение состояния показа
	}, []);

	return (
		<section className='border p-5 my-3'>
			<GuideStepHeader
				handleDeleteStep={handleDeleteStep}
				handleEditStep={handleEditStep}
				isShownStep={isShownStep}
				onDisplayChange={displayHandler}
				step={step}
			/>
			{isShownStep && <GuideStepBody step={step} />}
			<GuideStepFooter isShownStep={isShownStep} />
		</section>
	);
};

interface GuideStepHeaderProps {
	handleDeleteStep: () => void;
	handleEditStep: () => void;
	isShownStep: boolean;
	onDisplayChange: () => void;
	step: StepType;
}

const GuideStepHeader: FC<GuideStepHeaderProps> = ({
	handleDeleteStep,
	handleEditStep,
	isShownStep,
	onDisplayChange,
	step,
}) => {
	const displayButtonText = isShownStep ? '-' : '+';

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
				<Button size='icon' variant='lightGrey' onClick={onDisplayChange}>
					{displayButtonText}
				</Button>
			</div>
		</header>
	);
};

interface GuideStepBodyProps {
	step: StepType;
}

const GuideStepBody: FC<GuideStepBodyProps> = ({ step }) => {
	// Используем react-hook-form для управления полями, которые только отображаются
	const { register } = useForm<StepType>({
		defaultValues: step,
	});

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
								{...register('description')}
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
								{...register('pageUrl')}
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
								{...register('elementId')}
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
								{...register('imgWidth')}
								disabled
							/>
						</label>
						<label htmlFor='imgHeight'>
							Image Height:
							<input
								id='imgHeight'
								type='number'
								className='border p-2 rounded w-full'
								{...register('imgHeight')}
								disabled
							/>
						</label>
						<img
							className='border rounded max-w-full'
							src={step.imageUrl}
							alt={step.title}
							style={{
								width: `${step.imgWidth}px`,
								height: `${step.imgHeight}px`,
							}} // Используем прямое управление стилями для точного отображения размеров
						/>
					</fieldset>
				)}
			</article>
		</section>
	);
};

interface GuideStepFooterProps {
	isShownStep: boolean;
}

const GuideStepFooter: FC<GuideStepFooterProps> = ({ isShownStep }) => {
	return (
		<footer
			className={`transition-all duration-300 ${
				isShownStep ? 'opacity-100' : 'opacity-0'
			}`}
		></footer>
	);
};

export default GuideStep;

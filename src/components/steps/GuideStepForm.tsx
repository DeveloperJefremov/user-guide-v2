import { zodResolver } from '@hookform/resolvers/zod';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { StepType } from '../../data/types';
import Button from '../../UI/Button';

// Схема валидации с Zod
const guideStepSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	order: z.number().min(1, { message: 'Order is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	pageUrl: z.string().url({ message: 'Invalid URL format' }),
	elementId: z.string().min(1, { message: 'Element ID is required' }),
	imgChecked: z.boolean(),
	imgWidth: z
		.union([z.string(), z.number()])
		.optional()
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val)),
	imgHeight: z
		.union([z.string(), z.number()])
		.optional()
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val)),
	imageUrl: z
		.string()
		.url({ message: 'Invalid image URL' })
		.optional()
		.or(z.literal('')),
});

interface GuideStepFormProps {
	data: StepType;
	mode: 'create' | 'edit' | 'view';
	onSave: (step: StepType) => void;
	onCancel: () => void;
	stepsLength: number;
	isModalOpen: boolean;
	getEditFormDataKey: (guideSetId: string, stepId: string) => string;
	guideSetId: string;
}

const GuideStepForm = ({
	data,
	mode,
	isModalOpen,
	onSave,
	onCancel,
	getEditFormDataKey,
	guideSetId,
}: GuideStepFormProps) => {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm<StepType>({
		resolver: zodResolver(guideStepSchema),
		defaultValues: data,
	});

	const formValues = watch();
	const [localDataLoaded, setLocalDataLoaded] = useState(false); // Флаг для отслеживания загрузки данных из localStorage

	// Сброс формы при изменении data или открытии модального окна
	useEffect(() => {
		if (isModalOpen && mode === 'edit' && !localDataLoaded) {
			const editDataKey = getEditFormDataKey(guideSetId, data.id);
			const savedEditData = localStorage.getItem(editDataKey);

			if (savedEditData) {
				// console.log('Loading from localStorage:', savedEditData);
				reset(JSON.parse(savedEditData)); // Подгружаем данные из localStorage
				setLocalDataLoaded(true); // Флаг, что данные из localStorage загружены
			} else {
				// console.log('No data in localStorage, using passed data:', data);
				reset(data); // Если данных нет в localStorage, подгружаем переданные данные
				setLocalDataLoaded(true); // Ставим флаг, что данные загружены из пропсов
			}
		}
	}, [
		isModalOpen,
		mode,
		reset,
		data,
		getEditFormDataKey,
		guideSetId,
		localDataLoaded,
	]);

	useEffect(() => {
		if (isModalOpen && mode === 'edit' && localDataLoaded) {
			// Только когда данные из localStorage были загружены, сохраняем изменения
			const editDataKey = getEditFormDataKey(guideSetId, formValues.id);
			localStorage.setItem(editDataKey, JSON.stringify(formValues));
		} else if (mode === 'create') {
			localStorage.setItem('createFormData', JSON.stringify(formValues));
		}
	}, [
		formValues,
		mode,
		isModalOpen,
		guideSetId,
		getEditFormDataKey,
		localDataLoaded,
	]);

	// Логика сохранения шага
	const handleSave = (step: StepType) => {
		onSave(step);

		// Очищаем данные из localStorage после сохранения
		if (mode === 'create') {
			localStorage.removeItem('createFormData');
		} else if (mode === 'edit') {
			const editDataKey = getEditFormDataKey(guideSetId, step.id);
			localStorage.removeItem(editDataKey);
			setLocalDataLoaded(false); // Сбрасываем флаг после сохранения данных
		}
	};

	// Логика для отмены изменений и сброса формы
	const handleCancel = () => {
		reset(data); // Вернем форму к начальным данным
		onCancel();
		setLocalDataLoaded(false); // Сбрасываем флаг при отмене
	};

	// Логика для загрузки случайного изображения
	const handleImgCheckboxChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked;

		setValue('imgChecked', checked);
		if (checked) {
			try {
				const response = await fetch('https://dog.ceo/api/breeds/image/random');
				const result = await response.json();
				setValue('imageUrl', result.message); // Устанавливаем URL изображения
				setValue('imgWidth', 100); // Устанавливаем ширину по умолчанию
				setValue('imgHeight', 100); // Устанавливаем высоту по умолчанию
			} catch (error) {
				console.error('Ошибка при получении изображения:', error);
			}
		} else {
			// Сбрасываем поля, если чекбокс отключен
			setValue('imageUrl', '');
			setValue('imgWidth', 0);
			setValue('imgHeight', 0);
		}
	};

	return (
		<div className='flex flex-col gap-5 p-5'>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit(handleSave)}>
				{/* Поле Title */}
				<label htmlFor='title' className='block'>
					Title:
				</label>
				<input
					id='title'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					type='text'
					placeholder='Enter title'
					{...register('title')}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>
				{errors.title && <p className='text-red-500'>{errors.title.message}</p>}

				{/* Поле Order */}
				<label htmlFor='order' className='block'>
					Order:
				</label>
				<input
					id='order'
					placeholder='Enter order'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					type='number'
					{...register('order', {
						valueAsNumber: true,
					})}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>
				{errors.order && <p className='text-red-500'>{errors.order.message}</p>}

				{/* Поле Description */}
				<label htmlFor='description' className='block'>
					Description:
				</label>
				<textarea
					id='description'
					placeholder='Enter description'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none h-32'
					{...register('description')}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>
				{errors.description && (
					<p className='text-red-500'>{errors.description.message}</p>
				)}

				{/* Поле Page URL */}
				<label htmlFor='pageUrl' className='block'>
					Page URL:
				</label>
				<input
					id='pageUrl'
					placeholder='Enter page Url'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					{...register('pageUrl')}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>
				{errors.pageUrl && (
					<p className='text-red-500'>{errors.pageUrl.message}</p>
				)}

				{/* Поле Element ID */}
				<label htmlFor='elementId' className='block'>
					Element ID:
				</label>
				<input
					id='elementId'
					placeholder='Enter element Id'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					{...register('elementId')}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>
				{errors.elementId && (
					<p className='text-red-500'>{errors.elementId.message}</p>
				)}

				{/* Поле для изображения */}
				<fieldset className='flex flex-col'>
					<legend>Image Settings</legend>
					<label htmlFor='imgChecked' className='block'>
						Image:
					</label>
					<input
						id='imgChecked'
						type='checkbox'
						{...register('imgChecked')}
						disabled={mode !== 'create' && mode !== 'edit'}
						onChange={handleImgCheckboxChange}
					/>

					{formValues.imgChecked && (
						<>
							<label htmlFor='imgWidth' className='block'>
								Image Width:
							</label>
							<input
								id='imgWidth'
								type='number'
								placeholder='Enter image width'
								min='1'
								{...register('imgWidth', {
									valueAsNumber: true,
								})}
								disabled={mode !== 'create' && mode !== 'edit'}
								className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
							/>
							{errors.imgWidth && (
								<p className='text-red-500'>{errors.imgWidth.message}</p>
							)}

							<label htmlFor='imgHeight' className='block'>
								Image Height:
							</label>
							<input
								id='imgHeight'
								type='number'
								placeholder='Enter image height'
								min='1'
								{...register('imgHeight', {
									valueAsNumber: true,
								})}
								disabled={mode !== 'create' && mode !== 'edit'}
								className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
							/>
							{errors.imgHeight && (
								<p className='text-red-500'>{errors.imgHeight.message}</p>
							)}

							{formValues.imageUrl && (
								<img
									src={formValues.imageUrl}
									alt={formValues.title}
									style={{
										width: `${formValues.imgWidth}px`,
										height: `${formValues.imgHeight}px`,
									}}
									className='mt-4'
								/>
							)}
						</>
					)}
				</fieldset>

				{/* Кнопки сохранения/отмены */}
				<div className='flex justify-end gap-4 pt-5'>
					<Button variant='lightGrey' size='md' onClick={handleCancel}>
						Cancel
					</Button>
					<Button variant='default' size='md' type='submit'>
						Save
					</Button>
				</div>
			</form>
		</div>
	);
};

export default GuideStepForm;

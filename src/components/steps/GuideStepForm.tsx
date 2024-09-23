import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { ChangeEvent, useEffect } from 'react';
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
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val)), // Преобразуем строку в число
	imgHeight: z
		.union([z.string(), z.number()])
		.optional()
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val)), // Преобразуем строку в число
	imageUrl: z
		.string()
		.url({ message: 'Invalid image URL' })
		.optional()
		.or(z.literal('')),
});

interface GuideStepFormProps {
	data: StepType;
	mode: 'create' | 'edit' | 'view';
	// onChange: (updatedData: StepType) => void;
	onSave: (step: StepType) => void;
	onCancel: () => void;
	stepsLength: number;
}

const GuideStepForm = ({
	data,
	mode,
	// onChange,

	stepsLength,
	onSave,
	onCancel,
}: GuideStepFormProps) => {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		control,
		formState: { errors },
	} = useForm<StepType>({
		resolver: zodResolver(guideStepSchema),
		defaultValues: {
			...data,
			id: data.id ? data.id : String(stepsLength + 1),
		},
	});

	// const prevFormValues = useRef<StepType>(data);

	// Сброс формы при изменении data
	useEffect(() => {
		reset(data);
	}, [data, reset]);

	const formValues = watch();

	useEffect(() => {
		if (mode === 'create') {
			localStorage.setItem('createFormData', JSON.stringify(formValues));
		} else if (mode === 'edit') {
			localStorage.setItem(
				`editFormData_${formValues.id}`,
				JSON.stringify(formValues)
			);
		}
	}, [formValues]);

	// Автофокус на поле Title
	// useEffect(() => {
	// 	const firstField = document.getElementById('title');
	// 	if (firstField) {
	// 		firstField.focus();
	// 	}
	// }, []);

	// Избегаем бесконечного цикла обновления
	// useEffect(() => {
	// 	if (JSON.stringify(formValues) !== JSON.stringify(prevFormValues.current)) {
	// 		prevFormValues.current = formValues;
	// 		onChange(formValues);
	// 	}
	// }, [formValues, mode, data.id]);

	const handleSave = (step: StepType) => {
		onSave(step);
		// reset(data);
	};

	const keyDownHandler = (event: React.KeyboardEvent<HTMLFormElement>) => {
		const key = event.key;
		if (key === 'Enter') {
			event.preventDefault();
		}
	};

	const handleCancel = () => {
		reset(data);
		onCancel();
	};

	// Логика для загрузки случайной картинки
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

	// const handleFormChange = (data: StepType) => {

	// 	if (mode === 'create') {
	// 		localStorage.setItem ('createFormData', JSON.stringify(data));
	// 	} else if (mode === 'edit' ) {

	// 		localStorage.setItem(`editFormData_${data.id}`, JSON.stringify(data));
	// 	}

	// 	}
	// 	//rhf form

	// }

	return (
		<div className='flex flex-col gap-5 p-5'>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit(handleSave)}
				onKeyDown={keyDownHandler}
				// onChange={handleFormChange}
			>
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

			<DevTool control={control} />
		</div>
	);
};

export default GuideStepForm;

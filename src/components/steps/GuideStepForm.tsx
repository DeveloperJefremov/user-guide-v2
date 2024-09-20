import { ChangeEvent, FC, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { StepType } from '../../data/types';
import Button from '../../UI/Button';

interface GuideStepFormProps {
	data: StepType;
	mode: 'create' | 'edit' | 'view';
	onChange: (updatedData: StepType) => void;
	handleSaveStep: () => void;
	handleCancel: () => void;
}

const GuideStepForm: FC<GuideStepFormProps> = ({
	data,
	mode,
	onChange,
	handleSaveStep,
	handleCancel,
}) => {
	const { register, handleSubmit, watch, setValue, reset } = useForm<StepType>({
		defaultValues: data,
	});

	const prevFormValues = useRef<StepType>(data);

	// Сброс формы при изменении data
	useEffect(() => {
		reset(data);
	}, [data, reset]);

	const formValues = watch();

	// Избегаем бесконечного цикла обновления
	useEffect(() => {
		if (JSON.stringify(formValues) !== JSON.stringify(prevFormValues.current)) {
			prevFormValues.current = formValues;

			onChange(formValues);
		}
	}, [formValues, mode, data.id, onChange]);

	const onSubmit = () => {
		handleSaveStep();
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

	return (
		<div className='flex flex-col gap-5 p-5'>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
				{/* Поле Title */}
				<label htmlFor='title' className='block'>
					Title:
				</label>
				<input
					id='title'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					type='text'
					{...register('title')}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>

				{/* Поле Order */}
				<label htmlFor='order' className='block'>
					Order:
				</label>
				<input
					id='order'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					type='number'
					{...register('order')}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>

				{/* Поле Description */}
				<label htmlFor='description' className='block'>
					Description:
				</label>
				<textarea
					id='description'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none h-32'
					{...register('description')}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>

				{/* Поле Page URL */}
				<label htmlFor='pageUrl' className='block'>
					Page URL:
				</label>
				<input
					id='pageUrl'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					{...register('pageUrl')}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>

				{/* Поле Element ID */}
				<label htmlFor='elementId' className='block'>
					Element ID:
				</label>
				<input
					id='elementId'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					{...register('elementId')}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>

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
								min='1'
								{...register('imgWidth')}
								disabled={mode !== 'create' && mode !== 'edit'}
								className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
							/>

							<label htmlFor='imgHeight' className='block'>
								Image Height:
							</label>
							<input
								id='imgHeight'
								type='number'
								min='1'
								{...register('imgHeight')}
								disabled={mode !== 'create' && mode !== 'edit'}
								className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
							/>

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

import { DevTool } from '@hookform/devtools';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../UI/Button';

interface GuideSetHeaderFormProps {
	mode: 'create' | 'edit';
	title: string;
	currentSetId?: string | null | undefined;
	onTitleChange: (newTitle: string) => void;
	onSave: () => void;
	onCancel: () => void;
}

const GuideSetHeaderForm: FC<GuideSetHeaderFormProps> = ({
	mode,
	title,
	currentSetId,
	onTitleChange,
	onSave,
	onCancel,
}) => {
	const { register, handleSubmit, setValue, watch, control } = useForm();

	const watchedTitle = watch('title', '');

	// Подгрузка данных из localStorage при открытии формы
	useEffect(() => {
		if (mode === 'create') {
			const savedNewSetTitle = localStorage.getItem('newSetTitle');
			if (savedNewSetTitle) {
				setValue('title', savedNewSetTitle);
			}
		} else if (mode === 'edit' && currentSetId) {
			const savedEditSetTitle = localStorage.getItem(
				`editSetTitle_${currentSetId}`
			);
			if (savedEditSetTitle) {
				setValue('title', savedEditSetTitle);
			} else {
				setValue('title', title || ''); // Устанавливаем пустую строку, если нет данных
			}
		}
	}, [mode, setValue, currentSetId, title]);

	// Сохраняем данные в localStorage при изменении заголовка
	useEffect(() => {
		if (watchedTitle) {
			if (mode === 'create') {
				localStorage.setItem('newSetTitle', watchedTitle);
			} else if (mode === 'edit' && currentSetId) {
				localStorage.setItem(`editSetTitle_${currentSetId}`, watchedTitle);
			}
			onTitleChange(watchedTitle);
		}
	}, [watchedTitle, mode, currentSetId, onTitleChange]);

	return (
		<>
			<form
				onSubmit={handleSubmit(onSave)}
				className='p-5 bg-gray-100 rounded-lg shadow-md flex flex-col'
			>
				<label htmlFor='titleInput' className='text-lg mb-2'>
					{mode === 'edit'
						? 'Edit Tutorial Title'
						: 'Create New Tutorial Title'}
				</label>
				<input
					id='titleInput'
					{...register('title', { required: true })}
					className='p-3 text-base border border-gray-300 rounded focus:border-blue-500 mb-5'
					placeholder='Enter title'
				/>
				<div className='flex justify-end gap-3'>
					<Button onClick={onCancel} variant='lightGrey' size='lg'>
						Cancel
					</Button>
					<Button type='submit' variant='default' size='lg'>
						Save
					</Button>
				</div>
			</form>
			<DevTool control={control} />
		</>
	);
};

export default GuideSetHeaderForm;

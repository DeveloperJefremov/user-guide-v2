import React, { useEffect, useState } from 'react';
import Button from '../../UI/Button';

export default function GuideStepForm({
	data,
	mode,
	onChange,
	handleSaveStep,
	handleCancel,
}) {
	const initialData = {
		title: '',
		order: '',
		description: '',
		pageUrl: '',
		elementId: '',
		imgChecked: false,
		imgWidth: 0,
		imgHeight: 0,
		imageUrl: '',
	};

	const [formData, setFormData] = useState(
		mode === 'edit' ? data : initialData
	);

	useEffect(() => {
		if (mode === 'edit' || mode === 'create') {
			setFormData(data ?? initialData);
		}
	}, [data, mode]);

	const handleInputChange = e => {
		const { name, value, type, checked } = e.target;
		const updatedFormData = {
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		};
		setFormData(updatedFormData);
		onChange(updatedFormData);
	};

	const handleImgCheckboxChange = async e => {
		const checked = e.target.checked;
		let updatedData = { ...formData, imgChecked: checked };

		if (checked) {
			try {
				const response = await fetch('https://dog.ceo/api/breeds/image/random');
				const data = await response.json();
				if (data && data.message) {
					updatedData = {
						...updatedData,
						imageUrl: data.message,
						imgWidth: 100,
						imgHeight: 100,
					};
				}
			} catch (error) {
				console.error('Ошибка при получении изображения:', error);
			}
		} else {
			updatedData = {
				...updatedData,
				imageUrl: '',
				imgWidth: 0,
				imgHeight: 0,
			};
		}

		setFormData(updatedData);
		onChange(updatedData);
	};

	return (
		<div className='flex flex-col gap-5 p-5'>
			<form className='flex flex-col gap-4'>
				<label htmlFor='title' className='block'>
					Title:
				</label>
				<input
					id='title'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					type='text'
					name='title'
					value={formData.title}
					onChange={handleInputChange}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>

				<label htmlFor='order' className='block'>
					Order:
				</label>
				<input
					id='order'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					type='number'
					name='order'
					value={formData.order}
					onChange={handleInputChange}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>

				<label htmlFor='description' className='block'>
					Description:
				</label>
				<textarea
					id='description'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none h-32'
					name='description'
					value={formData.description}
					onChange={handleInputChange}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>

				<label htmlFor='pageUrl' className='block'>
					Page URL:
				</label>
				<input
					id='pageUrl'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					name='pageUrl'
					value={formData.pageUrl}
					onChange={handleInputChange}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>

				<label htmlFor='elementId' className='block'>
					Element ID:
				</label>
				<input
					id='elementId'
					className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
					type='text'
					name='elementId'
					value={formData.elementId}
					onChange={handleInputChange}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>
			</form>

			<fieldset className='flex flex-col'>
				<legend>Image Settings</legend>
				<label htmlFor='imgChecked' className='block'>
					Image:
				</label>
				<input
					id='imgChecked'
					name='imgChecked'
					type='checkbox'
					checked={formData.imgChecked}
					onChange={handleImgCheckboxChange}
					disabled={mode !== 'create' && mode !== 'edit'}
				/>

				{formData.imgChecked && formData.imageUrl && (
					<>
						<label htmlFor='imgWidth' className='block'>
							Image Width:
						</label>
						<input
							id='imgWidth'
							type='number'
							name='imgWidth'
							min='1'
							value={formData.imgWidth}
							onChange={handleInputChange}
							disabled={mode !== 'create' && mode !== 'edit'}
							className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
						/>

						<label htmlFor='imgHeight' className='block'>
							Image Height:
						</label>
						<input
							id='imgHeight'
							type='number'
							name='imgHeight'
							min='1'
							value={formData.imgHeight}
							onChange={handleInputChange}
							disabled={mode !== 'create' && mode !== 'edit'}
							className='resize-none border border-gray-300 rounded-md p-2 text-lg w-full focus:border-blue-500 focus:outline-none'
						/>
						<img
							className='mt-4'
							src={formData.imageUrl}
							alt={formData.title}
							style={{
								width: `${formData.imgWidth}px`,
								height: `${formData.imgHeight}px`,
							}}
						/>
					</>
				)}
			</fieldset>

			<div className='flex justify-end gap-4 pt-5'>
				<Button variant='lightGrey' size='md' onClick={handleCancel}>
					Cancel
				</Button>
				<Button variant='default' size='md' onClick={handleSaveStep}>
					Save
				</Button>
			</div>
		</div>
	);
}

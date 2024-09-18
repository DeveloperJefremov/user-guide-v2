import Button from '../../UI/Button';

const GuideSetHeaderForm = ({
	mode,
	title,
	onTitleChange,
	onSave,
	onCancel,
}) => {
	return (
		<form className='p-5 bg-gray-100 rounded-lg shadow-md flex flex-col'>
			<label htmlFor='titleInput' className='text-lg mb-2'>
				{mode === 'edit' ? 'Edit Tutorial Title' : 'Create New Tutorial Title'}
			</label>

			<input
				id='titleInput'
				type='text'
				value={title}
				onChange={e => onTitleChange(e.target.value)}
				className='p-3 text-base border border-gray-300 rounded focus:border-blue-500 mb-5'
				placeholder='Enter title'
			/>

			<div className='flex justify-end gap-3'>
				<Button onClick={onCancel} variant='lightGrey' size='lg'>
					Cancel
				</Button>
				<Button onClick={onSave} variant='default' size='lg'>
					Save
				</Button>
			</div>
		</form>
	);
};

export default GuideSetHeaderForm;

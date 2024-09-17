import Button from '../../UI/Button';
import styles from './GuideSetHeaderForm.module.css';

const GuideSetHeaderForm = ({
	mode,
	title,
	onTitleChange,
	onSave,
	onCancel,
}) => {
	return (
		<form className={styles.guideSetHeader}>
			<label htmlFor='titleInput' className={styles.guideSetHeader__label}>
				{mode === 'edit' ? 'Edit Tutorial Title' : 'Create New Tutorial Title'}
			</label>

			<input
				id='titleInput'
				type='text'
				value={title}
				onChange={e => onTitleChange(e.target.value)}
				className={styles.guideSetHeader__titleInput}
				placeholder='Enter title'
			/>

			<div className={styles.guideSetHeader__buttonContainer}>
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

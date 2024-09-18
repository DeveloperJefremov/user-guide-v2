import { Reorder } from 'framer-motion';
import localforage from 'localforage';
import { useEffect, useState } from 'react';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import GuideStep from './GuideStep';
import GuideStepForm from './GuideStepForm';

const initialFormData = {
	title: '',
	description: '',
	order: '',
	pageUrl: '',
	elementId: '',
	imgChecked: false,
	imgWidth: 0,
	imgHeight: 0,
	imageUrl: '',
};

export default function GuideStepsList({
	mode,
	onModeChange,
	guideSetId,
	activeGuideSetId,
	isGuideModalOpen,
	handleStepsIdListUpdate,
}) {
	const [steps, setSteps] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
	const [formData, setFormData] = useState(initialFormData);

	const getEditFormDataKey = (guideSetId, stepId) =>
		`editFormData_${guideSetId}_${stepId}`;

	// Загружаем шаги по guideSetId
	useEffect(() => {
		const loadSteps = async () => {
			const savedSteps = await localforage.getItem(`guideSteps_${guideSetId}`);
			if (savedSteps) {
				setSteps(savedSteps);
			} else {
				setSteps([]); // Если шагов нет, начинаем с пустого массива
			}
		};

		if (guideSetId) {
			loadSteps();
		}
	}, [guideSetId]);

	// Сохраняем шаги в LocalForage при изменении
	useEffect(() => {
		const saveStepsToLocalForage = async () => {
			await localforage.setItem(`guideSteps_${guideSetId}`, steps);
		};

		if (steps.length > 0) {
			saveStepsToLocalForage();
		}
	}, [steps, guideSetId]);

	// Загрузка данных из localStorage при открытии модального окна
	useEffect(() => {
		if (isModalOpen) {
			if (mode === 'create') {
				const savedCreateData = localStorage.getItem('createFormData');
				if (savedCreateData) {
					setFormData(JSON.parse(savedCreateData));
				} else {
					setFormData(initialFormData);
				}
			} else if (mode === 'edit') {
				const currentStep = steps[currentStepIndex];
				const editDataKey = getEditFormDataKey(guideSetId, currentStep.id);
				const savedEditData = localStorage.getItem(editDataKey);
				if (savedEditData) {
					setFormData(JSON.parse(savedEditData));
				} else {
					setFormData(currentStep);
				}
			}
		}
	}, [isModalOpen, mode, currentStepIndex, steps, guideSetId]);

	const clearLocalStorage = () => {
		if (mode === 'create') {
			localStorage.removeItem('createFormData');
		} else if (mode === 'edit') {
			const currentStep = steps[currentStepIndex];
			const editDataKey = getEditFormDataKey(guideSetId, currentStep.id);
			localStorage.removeItem(editDataKey);
		}
	};

	const handleCreateStep = () => {
		setFormData(initialFormData);
		onModeChange('create');
		setIsModalOpen(true);
	};

	const handleSaveStep = async () => {
		let updatedSteps;
		if (mode === 'create') {
			const newStep = { ...formData, id: String(steps.length + 1) };
			updatedSteps = [...steps, newStep];
			handleStepsIdListUpdate(guideSetId, newStep.id);
		} else {
			updatedSteps = steps.map((step, index) =>
				index === currentStepIndex ? { ...step, ...formData } : step
			);
		}

		setSteps(updatedSteps);
		await localforage.setItem(`guideSteps_${guideSetId}`, updatedSteps);
		setIsModalOpen(false);
		setFormData(initialFormData);
		clearLocalStorage();
	};

	const handleDeleteStep = async stepIndex => {
		const updatedSteps = steps.filter((_, index) => index !== stepIndex);
		setSteps(updatedSteps);
		await localforage.setItem(`guideSteps_${guideSetId}`, updatedSteps);
	};

	const handleFormChange = newFormData => {
		setFormData(newFormData);

		if (mode === 'create') {
			localStorage.setItem('createFormData', JSON.stringify(newFormData));
		} else if (mode === 'edit') {
			const currentStep = steps[currentStepIndex];
			const editDataKey = getEditFormDataKey(guideSetId, currentStep.id);
			localStorage.setItem(editDataKey, JSON.stringify(newFormData));
		}
	};

	const handleEditStep = stepIndex => {
		const selectedStep = steps[stepIndex];
		setFormData(selectedStep);
		setCurrentStepIndex(stepIndex);
		onModeChange('edit');
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		setFormData(initialFormData);
		setCurrentStepIndex(0);
		onModeChange('display');
		clearLocalStorage();
	};

	const handleNext = () => {
		if (currentStepIndex < steps.length - 1) {
			setCurrentStepIndex(prev => prev + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStepIndex > 0) {
			setCurrentStepIndex(prev => prev - 1);
		}
	};

	const highlightElement = elementId => {
		const element = document.getElementById(elementId);
		if (element) {
			element.classList.add(
				'outline',
				'outline-purple-700',
				'bg-blue-100',
				'z-50',
				'relative'
			);
			const rect = element.getBoundingClientRect();
			setModalPosition({
				top: rect.top + window.scrollY,
				left: rect.left + window.scrollX + rect.width + 30,
			});
		} else {
			console.warn(`Element with ID ${elementId} not found`);
		}
	};

	const removeHighlightElement = elementId => {
		const element = document.getElementById(elementId);
		if (element) {
			element.classList.remove(
				'outline',
				'outline-purple-700',
				'bg-blue-100',
				'z-50',
				'relative'
			);
		}
	};

	// Закрытие окна при клике на backdrop (серый фон) только для create/edit
	const handleBackdropClick = () => {
		if (mode === 'create') {
			localStorage.setItem('createFormData', JSON.stringify(formData));
		} else if (mode === 'edit') {
			const currentStep = steps[currentStepIndex];
			const editDataKey = getEditFormDataKey(guideSetId, currentStep.id);
			localStorage.setItem(editDataKey, JSON.stringify(formData));
		}
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (
			mode === 'execute' &&
			activeGuideSetId === guideSetId &&
			steps[currentStepIndex]?.elementId
		) {
			highlightElement(steps[currentStepIndex].elementId);
		}

		return () => {
			if (steps[currentStepIndex]?.elementId) {
				removeHighlightElement(steps[currentStepIndex].elementId);
			}
		};
	}, [currentStepIndex, mode, steps, activeGuideSetId, guideSetId]);

	return (
		<div className='flex flex-col pt-4'>
			<header className='flex flex-row-reverse justify-between items-center'>
				<section className='flex flex-col flex-shrink-0 p-2'>
					<h2>Create New Lesson</h2>
					<Button size='lg' variant='lightGrey' onClick={handleCreateStep}>
						Add: Lesson
					</Button>

					{isModalOpen && (
						<Modal onClick={handleCancel} onBackdropClick={handleBackdropClick}>
							<GuideStepForm
								data={formData}
								mode={mode}
								onChange={handleFormChange}
								handleSaveStep={handleSaveStep}
								handleCancel={handleCancel}
							/>
						</Modal>
					)}
				</section>

				<h2>Guide Steps List:</h2>
			</header>
			<ul className='pr-10'>
				<Reorder.Group
					values={steps}
					onReorder={steps => {
						const updatedSteps = steps.map((step, index) => {
							const newStep = {
								...step,
								order: index + 1,
							};
							return newStep;
						});

						setSteps(updatedSteps);
					}}
				>
					{steps.map((step, stepIndex) => (
						<Reorder.Item key={step.id} value={step}>
							<GuideStep
								step={step}
								handleEditStep={() => handleEditStep(stepIndex)}
								handleDeleteStep={() => handleDeleteStep(stepIndex)}
							/>
						</Reorder.Item>
					))}
				</Reorder.Group>
			</ul>

			{isGuideModalOpen &&
				mode === 'execute' &&
				activeGuideSetId === guideSetId &&
				steps[currentStepIndex] && (
					<Modal
						style={{
							position: 'absolute',
							top: `${modalPosition.top}px`,
							left: `${modalPosition.left}px`,
						}}
					>
						<h3>{steps[currentStepIndex]?.title}</h3>
						{steps[currentStepIndex]?.imageUrl && (
							<img
								src={steps[currentStepIndex].imageUrl}
								alt={steps[currentStepIndex].title}
								width={steps[currentStepIndex].imgWidth}
								height={steps[currentStepIndex].imgHeight}
							/>
						)}
						<p>{steps[currentStepIndex]?.description}</p>
						<p>Total Steps: {`${currentStepIndex + 1} of ${steps.length}`}</p>
						<Button onClick={handlePrevious} disabled={currentStepIndex === 0}>
							Previous
						</Button>
						<Button variant='lightGrey' onClick={handleCancel}>
							Close
						</Button>
						<Button
							onClick={handleNext}
							disabled={currentStepIndex === steps.length - 1}
						>
							Next
						</Button>
					</Modal>
				)}
		</div>
	);
}

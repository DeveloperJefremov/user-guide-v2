import { Reorder } from 'framer-motion';
import * as localforage from 'localforage';
import { FC, useCallback, useEffect, useState } from 'react';
import { ModeType, StepType } from '../../data/types';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import GuideStep from './GuideStep';
import GuideStepForm from './GuideStepForm';

interface GuideStepsListProps {
	mode: ModeType;
	onModeChange: (mode: ModeType) => void;
	guideSetId: string;
	activeGuideSetId: string | null;
	isGuideModalOpen: boolean;
	handleStepsIdListUpdate: (setId: string, stepId: string) => void;
}

const initialFormData: StepType = {
	id: '',
	title: '',
	description: '',
	order: 0,
	pageUrl: '',
	elementId: '',
	imgChecked: false,
	imgWidth: 0,
	imgHeight: 0,
	imageUrl: '',
};

const GuideStepsList: FC<GuideStepsListProps> = ({
	mode,
	onModeChange,
	guideSetId,
	activeGuideSetId,
	isGuideModalOpen,
	handleStepsIdListUpdate,
}) => {
	const [steps, setSteps] = useState<StepType[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
	const [modalPosition, setModalPosition] = useState<{
		top: number;
		left: number;
	}>({ top: 0, left: 0 });

	const [formData, setFormData] = useState<StepType>(initialFormData);

	const getEditFormDataKey = useCallback(
		(guideSetId: string, stepId: string) =>
			`editFormData_${guideSetId}_${stepId}`,
		[]
	);

	// Загружаем шаги по guideSetId
	useEffect(() => {
		const loadSteps = async () => {
			const savedSteps = await localforage.getItem<StepType[]>(
				`guideSteps_${guideSetId}`
			);
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
			try {
				if (mode === 'create') {
					const savedCreateData = localStorage.getItem('createFormData');
					if (savedCreateData) {
						setFormData(JSON.parse(savedCreateData));
					} else {
						setFormData(initialFormData);
					}
				} else if (mode === 'edit') {
					if (steps[currentStepIndex]) {
						const currentStep = steps[currentStepIndex];
						const editDataKey = getEditFormDataKey(guideSetId, currentStep.id);
						const savedEditData = localStorage.getItem(editDataKey);
						if (savedEditData) {
							setFormData(JSON.parse(savedEditData));
						} else {
							setFormData(currentStep);
						}
					} else {
						console.error('Current step not found!!!!');
					}
				}
			} catch (error) {
				console.error('Error parsing local storage data:', error);
				setFormData(initialFormData); // fallback to default
			}
		}
	}, [
		isModalOpen,
		mode,
		currentStepIndex,
		steps,
		guideSetId,
		getEditFormDataKey,
	]);

	const clearLocalStorage = useCallback(() => {
		if (mode === 'create') {
			localStorage.removeItem('createFormData');
		} else if (mode === 'edit') {
			if (steps[currentStepIndex]) {
				const currentStep = steps[currentStepIndex];
				const editDataKey = getEditFormDataKey(guideSetId, currentStep.id);
				localStorage.removeItem(editDataKey);
			}
		}
	}, [mode, steps, currentStepIndex, guideSetId, getEditFormDataKey]);

	const handleCreateStep = useCallback(() => {
		setFormData(initialFormData);
		onModeChange('create');
		setIsModalOpen(true);
	}, [onModeChange]);

	const handleSaveStep = useCallback(async () => {
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

		const sortedUpdatedSteps = updatedSteps.sort((a, b) => a.order - b.order);

		setSteps(sortedUpdatedSteps);
		await localforage.setItem(`guideSteps_${guideSetId}`, sortedUpdatedSteps);
		setIsModalOpen(false);
		setFormData(initialFormData);
		clearLocalStorage();
	}, [
		mode,
		formData,
		steps,
		currentStepIndex,
		guideSetId,
		handleStepsIdListUpdate,
		clearLocalStorage,
	]);

	const handleDeleteStep = async (stepIndex: number) => {
		const updatedSteps = steps.filter((_, index) => index !== stepIndex);
		setSteps(updatedSteps);
		await localforage.setItem(`guideSteps_${guideSetId}`, updatedSteps);
	};

	// const handleFormChange = useCallback(
	// 	(newFormData: StepType) => {
	// 		setFormData(newFormData);
	// 		if (mode === 'create') {
	// 			localStorage.setItem('createFormData', JSON.stringify(newFormData));
	// 		} else if (
	// 			mode === 'edit' &&
	// 			currentStepIndex !== null &&
	// 			steps[currentStepIndex]
	// 		) {
	// 			const currentStep = steps[currentStepIndex];
	// 			const editDataKey = getEditFormDataKey(guideSetId, currentStep.id);
	// 			localStorage.setItem(editDataKey, JSON.stringify(newFormData));
	// 		} else if (mode === 'edit' && !steps[currentStepIndex]) {
	// 			console.error('Current step not found.');
	// 		}
	// 	},
	// 	[mode, steps, currentStepIndex, guideSetId, getEditFormDataKey]
	// );

	const handleEditStep = (stepIndex: number) => {
		if (steps[stepIndex]) {
			const selectedStep = steps[stepIndex];
			setFormData(selectedStep);
			setCurrentStepIndex(stepIndex);
			onModeChange('edit');
			setIsModalOpen(true);
		} else {
			console.error('Selected step not found.');
		}
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

	const highlightElement = (elementId: string) => {
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

	const removeHighlightElement = (elementId: string) => {
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
			if (steps[currentStepIndex]) {
				const currentStep = steps[currentStepIndex];
				const editDataKey = getEditFormDataKey(guideSetId, currentStep.id);
				localStorage.setItem(editDataKey, JSON.stringify(formData));
			}
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

					{isModalOpen && (mode === 'create' || mode === 'edit') && (
						<Modal onClose={handleCancel} onBackdropClick={handleBackdropClick}>
							<GuideStepForm
								data={formData}
								mode={mode}
								// onChange={handleFormChange}
								// onSave={step => {
								// 	console.log('submitted -', step);
								// }}
								onSave={handleSaveStep}
								// onCancel={() => {
								// 	console.log('canceled');
								// }}
								onCancel={handleCancel}
							/>
						</Modal>
					)}
				</section>

				<h2>Guide Steps List:</h2>
			</header>
			<ul className='pr-10'>
				<Reorder.Group
					values={steps}
					onReorder={(newOrder: StepType[]) => {
						const updatedSteps = newOrder.map((step, index) => {
							const newStep = {
								...step,
								order: index + 1, // Присваиваем новое значение order
							};
							return newStep;
						});

						// Сортируем шаги и сохраняем их
						const sortedSteps = updatedSteps.sort((a, b) => a.order - b.order);
						setSteps(sortedSteps);
						localforage.setItem(`guideSteps_${guideSetId}`, sortedSteps);
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
						onBackdropClick={handleCancel} // Обработка клика на backdrop
						onClose={handleCancel} // Обработка закрытия модального окна
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
};

export default GuideStepsList;

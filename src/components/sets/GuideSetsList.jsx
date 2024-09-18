import { Reorder } from 'framer-motion';
import localforage from 'localforage';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import GuideSet from './GuideSet';
import GuideSetHeaderForm from './GuideSetHeaderForm';

export default function GuideSetsList() {
	const [guideSetsList, setGuideSetsList] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newSetTitle, setNewSetTitle] = useState('');
	const [mode, setMode] = useState('display');
	const [currentSetId, setCurrentSetId] = useState(null);
	const [activeGuideSetId, setActiveGuideSetId] = useState(null);
	const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

	// Загружаем данные из localStorage при открытии модального окна
	useEffect(() => {
		if (isModalOpen) {
			if (mode === 'create') {
				const savedNewSetTitle = localStorage.getItem('newSetTitle');
				if (savedNewSetTitle) {
					setNewSetTitle(savedNewSetTitle);
				}
			} else if (mode === 'edit' && currentSetId) {
				const savedEditSetTitle = localStorage.getItem(
					`editSetTitle_${currentSetId}`
				);
				if (savedEditSetTitle) {
					setNewSetTitle(savedEditSetTitle);
				}
			}
		}
	}, [isModalOpen, mode, currentSetId]);

	// Загружаем данные из LocalForage при монтировании
	useEffect(() => {
		const loadData = async () => {
			const savedGuideSets = await localforage.getItem('guideSets');
			if (savedGuideSets) {
				setGuideSetsList(savedGuideSets);
			} else {
				setGuideSetsList([]);
			}
		};

		loadData();
	}, []);

	// Функция для обновления stepsIdList
	const handleStepsIdListUpdate = (setId, stepId) => {
		const updatedGuideSetsList = guideSetsList.map(set => {
			if (set.id === setId) {
				return {
					...set,
					stepsIdList: [...set.stepsIdList, stepId],
				};
			}
			return set;
		});

		setGuideSetsList(updatedGuideSetsList);
	};

	// Сохраняем данные в LocalForage при изменении guideSetsList
	useEffect(() => {
		const saveDataToLocalForage = async () => {
			await localforage.setItem('guideSets', guideSetsList);
		};

		if (guideSetsList.length > 0) {
			saveDataToLocalForage();
		}
	}, [guideSetsList]);

	const handleTitleChange = newTitle => {
		setNewSetTitle(newTitle);

		// Сохраняем изменения в localStorage
		if (mode === 'create') {
			localStorage.setItem('newSetTitle', newTitle);
		} else if (mode === 'edit') {
			localStorage.setItem(`editSetTitle_${currentSetId}`, newTitle);
		}
	};

	const handleCreateSet = () => {
		setNewSetTitle('');
		setMode('create');
		setIsModalOpen(true);
	};

	const handleLaunchSet = setId => {
		setIsGuideModalOpen(true);
		setActiveGuideSetId(setId);
		setMode('execute');
	};

	const handleEditSet = id => {
		const selectedSet = guideSetsList.find(set => set.id === id);
		setNewSetTitle(selectedSet.setHeader);
		setCurrentSetId(id);
		setMode('edit');
		setIsModalOpen(true);
	};

	const handleDeleteSet = id => {
		const updatedGuideSetsList = guideSetsList.filter(
			guideSet => guideSet.id !== id
		);
		setGuideSetsList(updatedGuideSetsList);
	};

	const handleSaveNewSet = () => {
		if (newSetTitle.trim() === '') {
			alert('Title cannot be empty');
			return;
		}

		if (mode === 'create') {
			const newSet = {
				id: uuidv4(),
				setHeader: newSetTitle,
				setFooter: 'Footer for the new set',
				stepsIdList: [],
			};
			setGuideSetsList([...guideSetsList, newSet]);
			localStorage.removeItem('newSetTitle');
		} else if (mode === 'edit') {
			const updatedGuideSetsList = guideSetsList.map(guideSet => {
				if (guideSet.id === currentSetId) {
					return {
						...guideSet,
						setHeader: newSetTitle,
					};
				}
				return guideSet;
			});
			setGuideSetsList(updatedGuideSetsList);
			localStorage.removeItem(`editSetTitle_${currentSetId}`);
		}

		setIsModalOpen(false);
		setNewSetTitle('');
	};

	// Закрытие модального окна при нажатии на Backdrop (серый фон)
	const handleBackdropClick = () => {
		// Сохраняем данные только при клике на фон
		localStorage.setItem(
			mode === 'create' ? 'newSetTitle' : `editSetTitle_${currentSetId}`,
			newSetTitle
		);
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		setNewSetTitle('');
		// Удаляем данные из localStorage при нажатии кнопки Cancel
		if (mode === 'create') {
			localStorage.removeItem('newSetTitle');
		} else if (mode === 'edit') {
			localStorage.removeItem(`editSetTitle_${currentSetId}`);
		}
	};

	return (
		<section className='pt-4 flex flex-col justify-center'>
			<header className='flex flex-row-reverse justify-between items-center'>
				<section className='flex-shrink-0 p-3 flex flex-col'>
					<h2>Create New Set</h2>
					<Button onClick={handleCreateSet} variant='lightGrey' size='lg'>
						Add: Tutorial
					</Button>

					{isModalOpen && (
						<Modal onClick={handleCancel} onBackdropClick={handleBackdropClick}>
							<GuideSetHeaderForm
								mode={mode}
								title={newSetTitle}
								onTitleChange={handleTitleChange}
								onSave={handleSaveNewSet}
								onCancel={handleCancel}
							/>
						</Modal>
					)}
				</section>

				<h2>Guide Sets List:</h2>
			</header>

			<ul className='pl-0 pr-10'>
				<Reorder.Group values={guideSetsList} onReorder={setGuideSetsList}>
					{guideSetsList.map((guideSet, index) => (
						<Reorder.Item
							value={guideSet}
							className='list-none'
							key={guideSet.id}
						>
							<article key={guideSet.id || `set-${index}`}>
								<GuideSet
									handleEditSet={() => handleEditSet(guideSet.id)}
									handleDeleteSet={() => handleDeleteSet(guideSet.id)}
									mode={mode}
									isGuideModalOpen={isGuideModalOpen}
									onModeChange={newMode => setMode(newMode)}
									onLaunchSet={() => handleLaunchSet(guideSet.id)}
									activeGuideSetId={activeGuideSetId}
									setGuideSetsList={setGuideSetsList}
									guideSet={guideSet}
									handleStepsIdListUpdate={handleStepsIdListUpdate}
								/>
							</article>
						</Reorder.Item>
					))}
				</Reorder.Group>
			</ul>
		</section>
	);
}

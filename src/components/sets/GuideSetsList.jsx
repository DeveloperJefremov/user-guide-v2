import { Reorder } from 'framer-motion';
import localforage from 'localforage';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Импортируем uuid
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import GuideSet from './GuideSet';
import GuideSetHeaderForm from './GuideSetHeaderForm';
import styles from './GuideSetsList.module.css';

export default function GuideSetsList() {
	const [guideSetsList, setGuideSetsList] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newSetTitle, setNewSetTitle] = useState('');
	const [mode, setMode] = useState('display');
	const [currentSetId, setCurrentSetId] = useState(null);
	const [activeGuideSetId, setActiveGuideSetId] = useState(null);
	const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

	// Загружаем данные из LocalForage при монтировании
	useEffect(() => {
		const loadData = async () => {
			const savedGuideSets = await localforage.getItem('guideSets');
			if (savedGuideSets) {
				setGuideSetsList(savedGuideSets); // Устанавливаем данные из localforage
			} else {
				setGuideSetsList([]); // Начинаем с пустого массива, если данных нет
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
					stepsIdList: [...set.stepsIdList, stepId], // Добавляем шаг в список идентификаторов
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
		setNewSetTitle(selectedSet.setHeader); // Заполняем заголовок выбранного набора
		setCurrentSetId(id); // Запоминаем ID текущего набора
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
			// Создаем новый набор с уникальным UUID
			const newSet = {
				id: uuidv4(), // Генерация уникального UUID для нового набора
				setHeader: newSetTitle,
				setFooter: 'Footer for the new set',
				stepsIdList: [], // Пустой список для нового набора
			};
			setGuideSetsList([...guideSetsList, newSet]);
			localStorage.removeItem('newSetTitle'); // Удаляем данные из localStorage
		} else if (mode === 'edit') {
			// Обновляем существующий набор
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
			localStorage.removeItem(`editSetTitle_${currentSetId}`); // Удаляем данные из localStorage
		}

		setIsModalOpen(false);
		setNewSetTitle('');
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		setNewSetTitle('');
		if (mode === 'create') {
			localStorage.removeItem('newSetTitle');
		} else if (mode === 'edit') {
			localStorage.removeItem(`editSetTitle_${currentSetId}`);
		}
	};

	return (
		<section className={styles.guideSetsList}>
			<header className={styles.guideSetsList__header}>
				<section className={styles.guideSetsList__createSection}>
					<h2>Create New Set</h2>
					<Button onClick={handleCreateSet} variant='lightGrey' size='lg'>
						Add: Tutorial
					</Button>

					{isModalOpen && (
						<Modal onClick={handleCancel}>
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

			<ul className={styles.guideSetsList__setsList}>
				<Reorder.Group values={guideSetsList} onReorder={setGuideSetsList}>
					{guideSetsList.map((guideSet, index) => (
						<Reorder.Item
							value={guideSet}
							className={styles.fontList}
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

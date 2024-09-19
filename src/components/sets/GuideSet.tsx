import { ChangeEvent, FC, ReactNode, useCallback, useState } from 'react';
import { GuideSetType, ModeType } from '../../data/types';
import Button from '../../UI/Button';
import GuideStepsList from '../steps/GuideStepsList';

interface GuideSetProps {
	isGuideModalOpen: boolean;
	onModeChange: (mode: ModeType) => void;
	mode: ModeType;
	activeGuideSetId: string | null;
	onLaunchSet: () => void;
	guideSet: GuideSetType;
	handleEditSet: () => void;
	handleDeleteSet: () => void;
	handleStepsIdListUpdate: (setId: string, stepId: string) => void;
}

const GuideSet: FC<GuideSetProps> = ({
	isGuideModalOpen,
	onModeChange,
	mode,
	activeGuideSetId,
	onLaunchSet,
	guideSet,
	handleEditSet,
	handleDeleteSet,
	handleStepsIdListUpdate,
}) => {
	const [isShownSet, setIsShownSet] = useState(false);

	const displayHandler = useCallback(() => {
		setIsShownSet(prevState => !prevState);
	}, []);

	return (
		<section className='border border-black grid grid-rows-[100px_1fr] p-10 rounded-lg mb-5 bg-white'>
			<GuideSetHeader
				isShownSet={isShownSet}
				handleEditSet={handleEditSet}
				handleDeleteSet={handleDeleteSet}
				title={guideSet.setHeader}
				onDisplayChange={displayHandler}
			/>

			<div
				className={isShownSet ? 'opacity-100 max-h-full' : 'opacity-0 max-h-0'}
			>
				<GuideSetBody isShownSet={isShownSet}>
					<GuideStepsList
						isGuideModalOpen={isGuideModalOpen}
						guideSetId={guideSet.id}
						activeGuideSetId={activeGuideSetId}
						mode={mode}
						onModeChange={onModeChange}
						handleStepsIdListUpdate={handleStepsIdListUpdate}
					/>
				</GuideSetBody>

				<GuideSetFooter onLaunchSet={onLaunchSet} isShownSet={isShownSet} />
			</div>
		</section>
	);
};

interface GuideSetHeaderProps {
	isShownSet: boolean;
	handleEditSet: () => void;
	handleDeleteSet: () => void;
	title: string;
	onDisplayChange: () => void;
}

const GuideSetHeader: FC<GuideSetHeaderProps> = ({
	isShownSet,
	handleDeleteSet,
	handleEditSet,
	title,
	onDisplayChange,
}) => {
	let displayButtonText = !isShownSet ? '+' : '-';

	const [status, setStatus] = useState<string>('');
	const [isOn, setIsOn] = useState<boolean>(false);

	const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setStatus(e.target.value);
	};
	const handleToggleOnOff = () => {
		setIsOn(prev => !prev); // Переключение состояния
	};
	return (
		<header className='flex justify-between items-center'>
			<div className='flex justify-between items-center'>
				<h3>{title}</h3>

				<div className='flex items-center ml-8'>
					<select
						value={status}
						onChange={handleStatusChange}
						className='mr-4 border-2 border-clack    bg-primary-foreground text-black'
					>
						<option value='empty'></option>
						<option value='draft'>Draft</option>
						<option value='under review'>Under Review</option>
						<option value='completed'>Completed</option>
					</select>

					{status === 'completed' && (
						<div>
							<Button onClick={handleToggleOnOff} variant='lightGrey' size='lg'>
								{isOn ? 'Off' : 'On'}
							</Button>
						</div>
					)}
				</div>
			</div>
			<div className='flex gap-7 items-center pr-2.5'>
				<Button onClick={handleEditSet} variant='lightGrey' size='lg'>
					Edit: Tutorial
				</Button>
				<Button onClick={handleDeleteSet} variant='default' size='lg'>
					Delete: Tutorial
				</Button>

				<Button size='icon' variant='lightGrey' onClick={onDisplayChange}>
					{displayButtonText}
				</Button>
			</div>
		</header>
	);
};

interface GuideSetBodyProps {
	children: ReactNode;
	isShownSet: boolean;
}

const GuideSetBody: FC<GuideSetBodyProps> = ({ children, isShownSet }) => {
	return (
		<main
			className={`transition-opacity duration-300 ${
				isShownSet ? 'opacity-100 max-h-full' : 'opacity-0 max-h-0'
			} overflow-hidden`}
		>
			{children}
		</main>
	);
};

interface GuideSetFooterProps {
	onLaunchSet: () => void;
	isShownSet: boolean;
}

const GuideSetFooter: FC<GuideSetFooterProps> = ({
	onLaunchSet,
	isShownSet,
}) => {
	return (
		<footer
			className={`${
				isShownSet ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0'
			} transition-all duration-300 overflow-hidden`}
		>
			{onLaunchSet && (
				<Button onClick={onLaunchSet} variant='default' size='lg'>
					Launch: Tutorial
				</Button>
			)}
		</footer>
	);
};

export default GuideSet;

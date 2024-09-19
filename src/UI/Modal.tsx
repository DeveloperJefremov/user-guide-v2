import { CSSProperties, FC, ReactNode, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';

// Общий интерфейс для пропсов
interface ModalBaseProps {
	children: ReactNode;
	style?: CSSProperties;
	onClose?: () => void;
}

const Backdrop: FC<{ onClick: () => void }> = ({ onClick }) => {
	return (
		<div
			className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-20'
			onClick={onClick}
		></div>
	);
};

const ModalWindow: FC<ModalBaseProps> = ({ children, style, onClose }) => {
	const modalRef = useRef<HTMLDivElement | null>(null);

	// Перемещение фокуса на модальное окно при монтировании
	useEffect(() => {
		if (modalRef.current) {
			modalRef.current.focus();
		}
	}, []);

	// Закрытие модального окна при нажатии клавиши Escape
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && onClose) {
				onClose();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [onClose]);

	return (
		<div
			className={`bg-white w-11/12 md:w-1/4 p-4 rounded-lg shadow-lg z-30 overflow-auto ${
				!style
					? 'fixed top-44 left-1/2 transform -translate-x-1/2 w-11/12 md:w-1/4'
					: ''
			}`}
			style={style}
			onClick={e => e.stopPropagation()}
			ref={modalRef}
			tabIndex={-1}
			role='dialog'
			aria-modal='true'
		>
			<div>{children}</div>
		</div>
	);
};

interface ModalProps extends ModalBaseProps {
	onBackdropClick: () => void;
}

const portalElement = document.getElementById('overlays') as HTMLElement;

const Modal: FC<ModalProps> = ({
	onClose,
	children,
	style,
	onBackdropClick,
}) => {
	return (
		<>
			{ReactDOM.createPortal(
				<Backdrop onClick={onBackdropClick} />,
				portalElement
			)}
			{ReactDOM.createPortal(
				<ModalWindow style={style} onClose={onClose}>
					{children}
				</ModalWindow>,
				portalElement
			)}
		</>
	);
};

export default Modal;

import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const Backdrop = ({ onClick }) => {
	return (
		<div
			className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-20'
			onClick={onClick}
		></div>
	);
};

const ModalWindow = ({ children, style, onClose }) => {
	const modalRef = useRef();

	// Перемещение фокуса на модальное окно при монтировании
	useEffect(() => {
		modalRef.current.focus();
	}, []);

	// Закрытие модального окна при нажатии клавиши Escape
	useEffect(() => {
		const handleKeyDown = event => {
			if (event.key === 'Escape') {
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
			}`} // Если style нет, центрируем окно
			style={style} // Переданный стиль для динамического позиционирования
			onClick={e => e.stopPropagation()} // Остановка клика по окну, чтобы не закрывать его
			ref={modalRef}
			tabIndex={-1} // Делаем элемент фокусируемым
			role='dialog'
			aria-modal='true'
		>
			<div>{children}</div>
		</div>
	);
};

const portalElement = document.getElementById('overlays');

const Modal = ({ onClick, children, style }) => {
	return (
		<>
			{ReactDOM.createPortal(<Backdrop onClick={onClick} />, portalElement)}
			{ReactDOM.createPortal(
				<ModalWindow style={style} onClose={onClick}>
					{children}
				</ModalWindow>,
				portalElement
			)}
		</>
	);
};

export default Modal;

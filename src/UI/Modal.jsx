import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

const Backdrop = ({ onClick }) => {
	return <div className={styles.backdrop} onClick={onClick}></div>;
};

const ModalWindow = ({ children, style, onClose }) => {
	// Используем useRef для модального окна, чтобы поставить фокус на него при рендере
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
			className={styles.modal}
			style={style}
			onClick={e => e.stopPropagation()} // Остановка клика по окну, чтобы не закрывать его
			ref={modalRef}
			tabIndex={-1} // Делаем элемент фокусируемым
			role='dialog'
			aria-modal='true'
		>
			<div className={styles.content}>{children}</div>
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

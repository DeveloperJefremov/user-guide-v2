import GuideSetsList from '../components/sets/GuideSetsList';
import Button from '../UI/Button';

import styles from './MainContent.module.css';
const MainContentHeader = ({ title, description }) => {
	return (
		<header className={styles.mainHeader}>
			<h1 className={styles.mainHeader__title}>{title}</h1>
			<p className={styles.mainHeader__text}>{description}</p>
			{/* <Button
				size='lg'
				variant='lightGrey'
				className={styles.mainHeader__loginButton}
			>
				Login as admin
			</Button> */}
		</header>
	);
};

const MainContentBody = ({ children }) => {
	return <main className={styles.mainBody}>{children}</main>;
};

const MainContentFooter = ({ info }) => {
	return (
		<footer className={styles.mainFooter}>
			<small className={styles.mainFooter__info}>{info}</small>
		</footer>
	);
};

export default function MainContent() {
	return (
		<section className={styles.mainContent}>
			<MainContentHeader
				title='User Guide'
				description='User guides are a type of technical documentation that enables customers and end-users with step-by-step instructions on how to execute a task or process.'
			/>
			<MainContentBody>
				<GuideSetsList />
			</MainContentBody>
			<MainContentFooter info='2024 Your Company. All rights reserved.' />
		</section>
	);
}

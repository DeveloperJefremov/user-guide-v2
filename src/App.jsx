// import './App.css';
import './styles/global.css';

import FirstSideBar from './layout/FirstSideBar';
import MainContent from './layout/MainContent';
import SecondSideBar from './layout/SecondSideBar';

function App() {
	return (
		<div className='grid grid-rows-[100vh_100vh_1fr] grid-cols-[45px_200px_1fr] h-screen'>
			<FirstSideBar />
			<SecondSideBar />
			<MainContent />
		</div>
	);
}

export default App;

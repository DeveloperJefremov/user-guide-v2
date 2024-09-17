// const apiUrl = 'https://dog.ceo/api/breeds/image/random';
export const MockGuideSets = [
	{
		id: 1,
		setHeader: 'Set Header 1',
		setFooter: 'Set footer 1',
		setBody: [
			{
				id: '1',
				order: 1,
				title: 'Step 1: Introduction',
				description: 'This is the first step of the guide.',
				pageUrl: 'enter page url',
				elementId: 'btn-1',
				imgChecked: true,
				imgWidth: 200,
				imgHeight: 200,
				imageUrl: 'https://images.dog.ceo/breeds/labrador/n02099712_7866.jpg',
			},
			{
				id: '2',
				order: 2,
				title: 'Step 4: Execution',
				description: 'Execute the following commands to proceed.',
				pageUrl: 'enter page url',
				elementId: 'btn-2',
				imgChecked: false,
				imgWidth: 200,
				imgHeight: 200,
				imageUrl: 'https://images.dog.ceo/breeds/clumber/n02101556_5023.jpg',
			},
		],
	},
	{
		id: 2,
		setHeader: 'Set Header 2',
		setFooter: 'Set footer 2',
		setBody: [
			{
				id: '3',
				order: 1,
				title: 'Step 2: Setup',

				description: 'Setup your environment with the following instructions.',
				pageUrl: 'enter page url',
				elementId: 'link-1',
				imgChecked: false,
				imgWidth: 200,
				imgHeight: 200,
				imageUrl:
					'https://images.dog.ceo/breeds/spaniel-sussex/n02102480_6569.jpg',
			},
			{
				id: '4',
				order: 2,
				title: 'Step 5: Verification',

				description: 'Verify that everything is working as expected.',
				pageUrl: 'enter page url',
				elementId: 'link-2',
				imgChecked: true,
				imgWidth: 200,
				imgHeight: 200,
				imageUrl:
					'https://images.dog.ceo/breeds/spaniel-japanese/n02085782_230.jpg',
			},
		],
	},
];

export default MockGuideSets;

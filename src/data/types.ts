export interface GuideSetType {
	id: string;
	setHeader: string;
	setFooter: string;
	stepsIdList: string[];
}
export interface StepType {
	id: string;
	title: string;
	description: string;
	order: number;
	pageUrl: string;
	elementId: string;
	imgChecked: boolean;
	imgWidth: number;
	imgHeight: number;
	imageUrl: string;
}

export type ModeType = 'create' | 'edit' | 'display' | 'execute';

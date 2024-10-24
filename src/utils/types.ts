export type Field = {
	id: string;
	component: string;
	attributes: Attribute;

	index: number;
	getValue: () => string;
};

export type SavedUrl = {
	id: string;
	title: string;
	url: string;
};

export type InputType =
	| 'text'
	| 'password'
	| 'email'
	| 'number'
	| 'checkbox'
	| 'radio'
	| 'time'
	| 'file'
	| 'date'
	| 'datetime-local'
	| 'month'
	| 'week';

export type Attribute = {
	id?: string;
	name?: string;
	className?: string;
	disabled?: boolean;
	required?: boolean;
	autofocus?: boolean;
	form?: string;
	value?: string | number | readonly string[];
	placeholder?: string;
	autocomplete?: 'on' | 'off';
	aria?: {
		[key: string]: string;
	};
	data?: {
		[key: string]: string;
	};

	// Input
	type?: InputType;
	maxLength?: number;
	minLength?: number;
	pattern?: string;
	readOnly?: boolean;

	//Select
	multiple?: boolean;
	size?: number;

	//TextArea
	rows?: number;
	cols?: number;
	wrap?: 'soft' | 'hard';

	//Date - Number - Range
	min?: string;
	max?: string;
	step?: number;

	//Radio - Checkbox
	checked?: boolean;

	//File
	accept?: string;

	//Mine
	label?: string;
	errorMessage?: string;
	withLabel?: boolean;
	withPlaceholder?: boolean;
	withErrorMessage?: boolean;
	withMax?: boolean;
	options?: string[];
	prefix?: string;
};

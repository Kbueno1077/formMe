import type { Attribute } from './types';

const allowedInputTypes = ['input', 'textarea', 'select', 'radio', 'checkbox', 'website', 'list'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isInstanceOfType<T>(obj: any, type: Partial<Record<keyof T, string>>): obj is T {
	return (
		obj &&
		Object.keys(type).every(
			(key) => key in obj && typeof obj[key as keyof T] === type[key as keyof T]
		)
	);
}

const typeDescriptor: Partial<Record<keyof Attribute, string>> = {};

export const validateImportedJson = (jsonData: unknown) => {
	if (!Array.isArray(jsonData)) {
		return false;
	}

	jsonData.forEach((inputData) => {
		if (!allowedInputTypes.includes(inputData.component)) {
			return false;
		}

		if (typeof inputData.id !== 'string' || inputData.component === '') {
			return false;
		}

		if (typeof inputData.index !== 'number') {
			return false;
		}

		if (
			inputData.attributes &&
			!isInstanceOfType<Attribute>(inputData.attributes, typeDescriptor)
		) {
			return false;
		}
	});

	return true;
};

export const toastConfig = (message: string, type: string) => {
	const global = {
		message,
		timeout: 5000
	};

	if (type === 'success') {
		return { ...global, background: 'variant-filled-primary' };
	}
	if (type === 'warning') {
		return { ...global, background: 'variant-filled-warning' };
	}
	if (type === 'error') {
		return { ...global, background: 'variant-filled-error' };
	}
	if (type === 'info') {
		return { ...global, background: 'variant-filled-secondary' };
	}
	if (type === 'custom') {
		return {
			...global,
			background: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white',
			classes: 'border-4 border-purple-500'
		};
	}

	return { ...global };
};

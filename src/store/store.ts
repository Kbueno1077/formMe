import { db } from '$lib/firebase/firebase';
import { addDoc, collection } from 'firebase/firestore';
import randomstring from 'randomstring';
import { derived, get, writable, type Writable } from 'svelte/store';
import type { Attribute, Field, SavedUrl } from '../utils/types';

export const createdUrlsInSession: Writable<SavedUrl[]> = writable([]);
export const inputsStore: Writable<Field[]> = writable([]);
export const formTitle: Writable<string> = writable('');

export function updateFormTitle(newTitle: string) {
	formTitle.set(newTitle);
}

export async function storeInDB() {
	const title = get(formTitle);
	const inputs = get(inputsStore);

	if (!title) {
		return 'Title Error';
	}

	try {
		const formData = {
			title: title,
			inputs
		};

		const docRef = await addDoc(collection(db, 'forms'), formData);

		const currentUrl = window.location.href;
		const createdUrl = `${currentUrl}${docRef.id}`;

		createdUrlsInSession.update((urls) => [...urls, { url: createdUrl, id: docRef.id, title }]);

		return docRef.id;
	} catch (error) {
		console.error('Error saving form:', error);
		throw error;
	}
}

export function addInput(component: string, attributes: object) {
	const id = randomstring.generate(10);

	inputsStore.update((inputs: Field[]) => [
		...inputs,
		{
			id,
			component,
			attributes,
			index: inputs.length,
			getValue: function () {
				if (this.component === 'checkbox') {
					return (
						this.attributes.options
							?.map((option) =>
								(document.getElementById(`cb_${this.id}_${option}`) as HTMLInputElement)?.checked
									? option
									: ''
							)
							.join(', ') || ''
					);
				}

				if (this.component === 'radio') {
					return (
						this.attributes.options
							?.map((option) =>
								(document.getElementById(`rb_${this.id}_${option}`) as HTMLInputElement)?.checked
									? option
									: ''
							)
							.join(', ') || ''
					);
				}

				if (this.component === 'website') {
					const prefix = this.attributes?.prefix || '';
					const value = (document.getElementById(this.id) as HTMLInputElement)?.value || '';

					return `${prefix}${value}`;
				}

				if (this.component === 'list') {
					const list = this.attributes.options?.join(', ') || '';
					return list;
				}

				return (document.getElementById(this.id) as HTMLInputElement)?.value || '';
			}
		}
	]);
}

export function moveInput(id: string, moveDirection: 'up' | 'down') {
	inputsStore.update((inputs: Field[]) => {
		const inputIndex = inputs.findIndex((input: Field) => input.id === id);
		if (inputIndex === -1) return inputs;

		const newInputs = [...inputs];
		const [removedInput] = newInputs.splice(inputIndex, 1);
		const newIndex =
			moveDirection === 'up'
				? Math.max(0, inputIndex - 1)
				: Math.min(inputs.length - 1, inputIndex + 1);

		newInputs.splice(newIndex, 0, removedInput);
		return newInputs.map((input, index) => ({ ...input, index }));
	});
}

export function removeInput(id: string) {
	inputsStore.update((inputs: Field[]) => inputs.filter((input: Field) => input.id !== id));
}

export function getInputs() {
	return get(inputsStore);
}

export function updateInputAttributes(id: string, newAttributes: object) {
	inputsStore.update((inputs: Field[]) =>
		inputs.map((input: Field) =>
			input.id === id ? { ...input, attributes: { ...input.attributes, ...newAttributes } } : input
		)
	);
}

export function checkValues() {
	const inputs = get(inputsStore);
	inputs.forEach((input: Field) => {
		console.log(input.getValue());
	});
}

export function addOption(inputId: string, option: string) {
	inputsStore.update((inputs: Field[]) =>
		inputs.map((input: Field) =>
			input.id === inputId
				? {
						...input,
						attributes: {
							...input.attributes,
							options: [...(input.attributes.options || []), option]
						}
					}
				: input
		)
	);
}

export function removeOption(inputId: string, option: string) {
	inputsStore.update((inputs: Field[]) =>
		inputs.map((input: Field) =>
			input.id === inputId
				? {
						...input,
						attributes: {
							...input.attributes,
							options: (input.attributes.options || []).filter((opt: string) => opt !== option)
						}
					}
				: input
		)
	);
}

// Function to get attributes of a specific input by id
export function getInputAttributes(id: string) {
	return derived(
		inputsStore,
		($inputs) => $inputs.find((input: Field) => input.id === id)?.attributes || {}
	);
}

export function exportDataJSON() {
	const inputs = get(inputsStore);

	const dataToExport = inputs; // Adjust this to the specific data you want to export
	const json = JSON.stringify(dataToExport, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'data.json';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function importDataJson(newInputs: Field[]) {
	inputsStore.set(newInputs);
}

export function handleUpdateAttributes(target: string, attributesData: Attribute, e: Event) {
	const attributes = structuredClone(attributesData);

	const eventTarget = e.target as HTMLInputElement;
	const name = eventTarget.name;
	const value = eventTarget.type === 'checkbox' ? eventTarget.checked : eventTarget.value;

	if (name === 'withMax' && value === false) {
		const newAttributes = { ...attributes, max: null, [name]: value };
		updateInputAttributes(target, newAttributes);
		return;
	}

	if (name === 'withLabel' && value === false) {
		const newAttributes = { ...attributes, label: '', [name]: value };
		updateInputAttributes(target, newAttributes);
		return;
	}
	if (name === 'withPlaceholder' && value === false) {
		const newAttributes = { ...attributes, placeholder: '', [name]: value };
		updateInputAttributes(target, newAttributes);
		return;
	}
	if (name === 'withErrorMessage' && value === false) {
		const newAttributes = { ...attributes, errorMessage: '', [name]: value };
		updateInputAttributes(target, newAttributes);
		return;
	}

	if (name === 'placeholder' && !attributes.withPlaceholder) {
		return;
	}
	if (name === 'label' && !attributes.withLabel) {
		return;
	}
	if (name === 'errorMessage' && !attributes.withErrorMessage) {
		return;
	}

	if (name === 'max' && !attributes.withMax) {
		return;
	}

	const newAttributes = { ...attributes, [name]: value };
	updateInputAttributes(target, newAttributes);
}

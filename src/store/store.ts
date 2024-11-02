import { db } from '$lib/firebase/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import randomstring from 'randomstring';
import { derived, get, writable, type Writable } from 'svelte/store';
import type { Attribute, Field, InputValueType, SavedUrl } from '../utils/types';
import { createGetValue } from '../utils/getAutoValue';

export const createdUrlsInSession: Writable<SavedUrl[]> = writable([]);
export const inputsStore: Writable<Field[]> = writable([]);
export const inputsValueStore: Writable<InputValueType[]> = writable([]);
export const formTitle: Writable<string> = writable('');
export const emailStore = writable('');
export const isCheckedEmailStore = writable(false);

// DB
export async function storeInDB() {
	const title = get(formTitle);
	const emailValue = get(emailStore);
	const isCheckedEmailValue = get(isCheckedEmailStore);

	if (!title) {
		return 'Title Error';
	}

	const inputs = get(inputsStore);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const inputsWithoutGetValue = inputs.map(({ getValue, ...rest }) => rest);
	try {
		const formData = {
			title: title,
			inputs: inputsWithoutGetValue,
			createdAt: serverTimestamp(),
			email: isCheckedEmailValue ? emailValue : null
		};

		const docRef = await addDoc(collection(db, 'forms'), formData);

		const currentUrl = window.location.href;
		const createdUrl = `${currentUrl}${docRef.id}`;

		createdUrlsInSession.update((urls) => [...urls, { url: createdUrl, id: docRef.id, title }]);

		return docRef.id;
	} catch (error) {
		console.error('Error saving form:', error);
		return null;
	}
}

// TITLE
export function updateFormTitle(newTitle: string) {
	formTitle.set(newTitle);
}

// INPUTS HANDLERS
export function getInputs() {
	return get(inputsStore);
}

export function checkValues() {
	const inputs = get(inputsStore);

	inputs.forEach((input: Field) => {
		console.log(input.getValue());
	});
}

export function extractValues() {
	const inputs = get(inputsStore);

	const inputValues = inputs.map((input: Field) => {
		return {
			id: input.id,
			value: input.getValue(),
			label: input.attributes.label ?? 'NO_LABEL_PROVIDED',
			component: input.component
		};
	});

	return inputValues;
}

export function clearAllInputs() {
	inputsStore.set([]);
	inputsValueStore.set([]);
	formTitle.set('');
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
			getValue: createGetValue({ id, component, attributes, index: inputs.length } as Field)
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

export function updateInputAttributes(id: string, newAttributes: object) {
	inputsStore.update((inputs: Field[]) =>
		inputs.map((input: Field) =>
			input.id === id ? { ...input, attributes: { ...input.attributes, ...newAttributes } } : input
		)
	);
}

// + - Options
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

// JSON
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
	const addGetValueFunction = newInputs.map((input) => ({
		...input,
		getValue: createGetValue(input)
	}));

	inputsStore.set(addGetValueFunction);
}

export function importDataFirestore(newInputs: Field[]) {
	const addGetValueFunction = newInputs.map((input) => ({
		...input,
		getValue: createGetValue(input)
	}));

	inputsStore.set(addGetValueFunction);
}

export function importDataValuesFirestore(newInputs: InputValueType[]) {
	inputsValueStore.set(newInputs);
}

// ATTRIBUTES
export function getInputAttributes(id: string) {
	return derived(
		inputsStore,
		($inputs) => $inputs.find((input: Field) => input.id === id)?.attributes || {}
	);
}

export function getInputValue(id: string) {
	return derived(
		inputsValueStore,
		($inputsValue) => $inputsValue.find((input: InputValueType) => input.id === id) || {}
	);
}

export function handleUpdateAttributes(target: string, attributesData: Attribute, e: Event) {
	const attributes = JSON.parse(JSON.stringify(attributesData));

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

export function bindFirestoreValuesToInputs(inputValues: InputValueType[]) {
	inputValues.forEach((input: InputValueType) => {
		const element = document.getElementById(input.id);
		if (element) {
			(element as HTMLInputElement).value = input.value;
		}
	});
}

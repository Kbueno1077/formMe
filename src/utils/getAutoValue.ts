import type { Field } from './types';

export function createGetValue(input: Field) {
	return function () {
		if (input.component === 'checkbox') {
			const checkboxSelected =
				input.attributes.options
					?.map((option) =>
						(document.getElementById(`cb_${input.id}_${option}`) as HTMLInputElement)?.checked
							? option
							: ''
					)
					.join(', ') || '';

			return `${checkboxSelected}`;
		}

		if (input.component === 'radio') {
			const radioSelected = input.attributes.options?.map((option) =>
				(document.getElementById(`rb_${input.id}_${option}`) as HTMLInputElement)?.checked
					? option
					: ''
			);

			return radioSelected;
		}

		if (input.component === 'website') {
			// const prefix = input.attributes?.prefix || '';
			const value = (document.getElementById(input.id) as HTMLInputElement)?.value || '';

			return `${value}`;
		}

		if (input.component === 'list') {
			const list = input.attributes.options?.join(', ') || '';
			return `${list}`;
		}

		return `${(document.getElementById(input.id) as HTMLInputElement)?.value || ''}`;
	};
}

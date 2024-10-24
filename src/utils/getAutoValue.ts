import type { Field } from './types';

export function createGetValue(input: Field) {
	return function () {
		const label = input.attributes?.label || 'NO_LABEL_PROVIDED';

		if (input.component === 'checkbox') {
			const checkboxSelected =
				input.attributes.options
					?.map((option) =>
						(document.getElementById(`cb_${input.id}_${option}`) as HTMLInputElement)?.checked
							? option
							: ''
					)
					.join(', ') || '';

			return `${label}: ${checkboxSelected}`;
		}

		if (input.component === 'radio') {
			const radioSelected =
				input.attributes.options
					?.map((option) =>
						(document.getElementById(`rb_${input.id}_${option}`) as HTMLInputElement)?.checked
							? option
							: ''
					)
					.join(', ') || '';

			return `${label}: ${radioSelected}`;
		}

		if (input.component === 'website') {
			const prefix = input.attributes?.prefix || '';
			const value = (document.getElementById(input.id) as HTMLInputElement)?.value || '';

			return `${label}: ${prefix}${value}`;
		}

		if (input.component === 'list') {
			const list = input.attributes.options?.join(', ') || '';
			return `${label}: ${list}`;
		}

		return `${label}: ${(document.getElementById(input.id) as HTMLInputElement)?.value || ''}`;
	};
}

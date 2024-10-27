<script lang="ts">
	import { getInputAttributes, getInputValue } from '../../store/store';
	import type { Attribute, InputValueType } from '../../utils/types';

	interface Props {
		id: string;
		isSubmitted: boolean;
		[key: string]: any;
	}

	let { id, isSubmitted }: Props = $props();
	let attributes: Attribute | undefined = $state(undefined);
	let inputValue: InputValueType | undefined = $state(undefined);
	let hasError = $state(false);

	$effect(() => {
		const attributesStore = getInputAttributes(id);
		const valueStore = getInputValue(id);

		attributesStore.subscribe((value) => {
			attributes = value;
		});

		valueStore.subscribe((value: any) => {
			inputValue = value;
		});
	});

	function validateInput(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		const value = inputElement.value;

		if (attributes?.required && !value) {
			hasError = true;
			return;
		}

		if (attributes?.type === 'email') {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailPattern.test(value)) {
				hasError = true;
				return;
			}
		}

		hasError = false;
	}
</script>

<div class="form-control space-y-2">
	{#if attributes?.label}
		<label for={id} class="label text-xl font-bold">
			<span>{attributes.label}</span>
		</label>
	{/if}

	<input
		{...attributes}
		class={`input ${hasError ? 'input-error' : ''}`}
		aria-invalid={hasError}
		aria-describedby={hasError ? 'error-message' : undefined}
		{id}
		value={inputValue?.value ?? ''}
		oninput={validateInput}
		disabled={isSubmitted || attributes?.disabled}
	/>

	{#if hasError && attributes?.errorMessage}
		<span class="error-message" id="error-message">{attributes.errorMessage}</span>
	{/if}
</div>

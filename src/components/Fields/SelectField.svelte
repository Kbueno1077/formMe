<script lang="ts">
	import { getInputAttributes, getInputValue } from '../../store/store';
	import type { Attribute, InputValueType } from '../../utils/types';

	interface Props {
		id: string;
		isSubmitted: boolean;
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
		const selectElement = event.target as HTMLSelectElement;
		const value = selectElement.value;

		if (attributes?.required && !value) {
			hasError = true;
			return;
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

	<select
		{...attributes}
		class={`select ${hasError ? 'select-error' : ''}`}
		disabled={isSubmitted || attributes?.disabled || !attributes?.options}
		{id}
		value={inputValue?.value ?? ''}
		onchange={validateInput}
	>
		{#if attributes?.options}
			{#each attributes.options as option (option)}
				<option value={option}>{option}</option>
			{/each}
		{/if}
	</select>

	{#if hasError && attributes?.errorMessage}
		<span class="error-message" id="error-message">{attributes.errorMessage}</span>
	{/if}
</div>

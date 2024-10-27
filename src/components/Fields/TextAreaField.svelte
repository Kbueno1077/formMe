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
		const textareaElement = event.target as HTMLTextAreaElement;
		const value = textareaElement.value;

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

	<textarea
		{...attributes}
		class={`textarea ${hasError ? 'input-error' : ''}`}
		aria-invalid={hasError}
		aria-describedby={hasError ? 'error-message' : undefined}
		{id}
		value={inputValue?.value ?? ''}
		oninput={validateInput}
		disabled={isSubmitted || attributes?.disabled}
	></textarea>

	{#if hasError && attributes?.errorMessage}
		<span class="error-message" id="error-message">{attributes.errorMessage}</span>
	{/if}
</div>

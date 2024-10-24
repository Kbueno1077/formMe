<script lang="ts">
	import { getInputAttributes } from '../../store/store';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import type { Attribute } from '../../utils/types';

	interface Props {
		id: string;
	}

	let { id }: Props = $props();
	let attributes: Attribute | undefined = $state(undefined);
	let hasError = $state(false);

	const inputAttributesStore = derived(getInputAttributes(id), ($attributes) => {
		attributes = $attributes;
	});

	onMount(() => {
		const unsubscribe = inputAttributesStore.subscribe(() => {});
		return unsubscribe;
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
		class={`textarea ${hasError ? 'textarea-error' : ''}`}
		aria-invalid={hasError}
		aria-describedby={hasError ? 'error-message' : undefined}
		{id}
		oninput={validateInput}
	></textarea>

	{#if hasError && attributes?.errorMessage}
		<span class="error-message" id="error-message">{attributes.errorMessage}</span>
	{/if}
</div>

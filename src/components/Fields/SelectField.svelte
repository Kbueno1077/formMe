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
		class={`select ${hasError ? 'select-error' : ''}`}
		disabled={!attributes?.options}
		{id}
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

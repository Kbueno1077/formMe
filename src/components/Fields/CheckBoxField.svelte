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

	function validateInput() {
		const selectedOptions = document.querySelectorAll(`input[name="cbName_${id}"]:checked`);
		if (attributes?.required && selectedOptions.length === 0) {
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

	<div class="space-y-2">
		{#if attributes?.options}
			{#each attributes.options as option (option)}
				<div class="flex items-center space-x-2">
					<input
						class={`checkbox ${hasError ? 'checkbox-error' : ''}`}
						type="checkbox"
						id={`cb_${id}_${option}`}
						name={`cbName_${id}`}
						onchange={validateInput}
					/>
					<p class="font-bold">{option}</p>
				</div>
			{/each}
		{/if}
	</div>

	{#if hasError && attributes?.errorMessage}
		<span class="error-message" id="error-message">{attributes.errorMessage}</span>
	{/if}
</div>

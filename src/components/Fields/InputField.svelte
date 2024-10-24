<script lang="ts">
	import { getInputAttributes } from '../../store/store';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import type { Attribute } from '../../utils/types';

	interface Props {
		id: string;
		[key: string]: any;
	}

	let { id }: Props = $props();
	let attributes: Attribute | undefined = $state(undefined);

	const inputAttributesStore = derived(getInputAttributes(id), ($attributes) => {
		attributes = $attributes;
	});

	onMount(() => {
		const unsubscribe = inputAttributesStore.subscribe(() => {});
		return unsubscribe;
	});
</script>

<div class="form-control space-y-2">
	{#if attributes?.label}
		<label for={id} class="label text-xl font-bold">
			<span>{attributes.label}</span>
		</label>
	{/if}

	<input
		{...attributes}
		class={`input ${attributes?.errorMessage ? 'input-error' : ''}`}
		aria-invalid={!!attributes?.errorMessage}
		aria-describedby={attributes?.errorMessage ? 'error-message' : undefined}
		{id}
	/>

	{#if attributes?.errorMessage}
		<span class="error-message" id="error-message">{attributes.errorMessage}</span>
	{/if}
</div>

<script lang="ts">
	import { run } from 'svelte/legacy';

	import { InputChip } from '@skeletonlabs/skeleton';
	import { IconSquarePlus } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { addOption, getInputAttributes, removeOption } from '../../store/store';
	import type { Attribute } from '../../utils/types';

	interface Props {
		id: string;
	}

	let { id }: Props = $props();

	let attributes: Attribute = $state();
	let inputChip: InputChip = $state();
	let currentValue = $state('');

	let options;
	run(() => {
		options = attributes?.options ?? [];
	});

	const inputAttributesStore = derived(getInputAttributes(id), ($attributes) => {
		attributes = $attributes;
	});

	onMount(() => {
		const unsubscribe = inputAttributesStore.subscribe(() => {});
		return unsubscribe;
	});

	const handleAddOption = () => {
		if (currentValue && !options.includes(currentValue) && currentValue.trim() !== '') {
			addOption(id, currentValue);
			currentValue = '';
			if (inputChip) {
				inputChip.focus();
			}
		}
	};

	const handleRemoveOption = (chip: string) => {
		removeOption(id, chip);
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleAddOption();
		}
	};
</script>

<div class="form-control space-y-2">
	{#if attributes?.label}
		<label for={id} class="label text-xl font-bold">
			<span>{attributes.label}</span>
		</label>
	{/if}

	<div class="flex space-x-2">
		<InputChip
			bind:this={inputChip}
			bind:value={options}
			bind:input={currentValue}
			name={`listvalues_${id}`}
			placeholder={attributes?.placeholder ?? ''}
			{id}
			max={attributes?.max ? parseInt(attributes.max) : undefined}
			on:remove={(e) => handleRemoveOption(e.detail.chipValue)}
			on:keydown={handleKeydown}
		/>
		<button onclick={handleAddOption} class="btn-icon"><IconSquarePlus /></button>
	</div>

	{#if attributes?.errorMessage}
		<span class="error-message" id="error-message">{attributes.errorMessage}</span>
	{/if}
</div>

<script lang="ts">
	import { InputChip } from '@skeletonlabs/skeleton';
	import { IconSquarePlus } from '@tabler/icons-svelte';
	import { addOption, getInputAttributes, getInputValue, removeOption } from '../../store/store';
	import type { Attribute, InputValueType } from '../../utils/types';

	interface Props {
		id: string;
		isSubmitted: boolean;
	}

	//TODO: FIX VALUES, ADD, REMOVE
	let { id, isSubmitted }: Props = $props();

	let attributes: Attribute | undefined = $state(undefined);
	let inputValue: InputValueType | undefined = $state(undefined);
	let inputChip: InputChip | null = $state(null);
	let currentValue = $state('');
	let options: any[] | undefined = $state();

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

	// Update options when attributes change
	$effect(() => {
		options = attributes?.options ?? [];

		if (inputValue?.value) {
			options = inputValue.value.split(',').map((option: string) => option.trim());
		}
	});

	$effect(() => {
		console.log(options);
	});

	const handleAddOption = () => {
		if (currentValue && !options?.includes(currentValue) && currentValue.trim() !== '') {
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
			onremove={(e: any) => handleRemoveOption(e.detail.chipValue)}
			onkeydown={handleKeydown}
			disabled={isSubmitted || attributes?.disabled}
		/>
		<button
			onclick={handleAddOption}
			type="button"
			class="btn-icon"
			disabled={isSubmitted || attributes?.disabled}
		>
			<IconSquarePlus />
		</button>
	</div>

	{#if attributes?.errorMessage}
		<span class="error-message" id="error-message">{attributes.errorMessage}</span>
	{/if}
</div>

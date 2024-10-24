<script lang="ts">
	import { InputChip, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { IconAdjustmentsHorizontal, IconSquareX } from '@tabler/icons-svelte';
	import {
		addOption,
		handleUpdateAttributes,
		removeOption,
		updateInputAttributes
	} from '../../store/store';
	import type { Attribute } from '../../utils/types';

	interface Props {
		target?: string;
		attributes: Attribute;
	}

	let { target = 'Some', attributes }: Props = $props();

	let options = $derived(attributes.options ?? []);

	const popupFeatured: PopupSettings = {
		event: 'click',
		target: target,
		placement: 'bottom',
		closeQuery: ''
	};

	let optionName = $state('');

	function handleUpdate(e: Event) {
		handleUpdateAttributes(target, attributes, e);
	}

	const handleAddOption = () => {
		if (!options.includes(optionName) && optionName.trim() !== '') {
			addOption(target, optionName);
		}
		optionName = '';
	};

	const handleRemoveOption = (option: string) => {
		removeOption(target, option);
	};
</script>

<button class=" btn-icon" use:popup={popupFeatured}><IconAdjustmentsHorizontal /></button>
<div class="card z-50 w-72 p-4 shadow-xl" data-popup={target}>
	<div class="space-y-2">
		<div class="flex items-center justify-end gap-2">
			<span>Is Required *</span>
			<input class="checkbox" type="checkbox" />
		</div>

		<div class="flex items-center gap-2">
			<input
				class="input"
				type="text"
				name="label"
				placeholder="Label"
				disabled={!attributes.withLabel}
				value={attributes.label ?? ''}
				onchange={handleUpdate}
			/>
			<input
				class="checkbox"
				type="checkbox"
				name="withLabel"
				checked={attributes.withLabel ?? false}
				onchange={handleUpdate}
			/>
		</div>

		<div class="flex items-center gap-2">
			<input
				class="input"
				type="text"
				name="errorMessage"
				placeholder="Error Message"
				disabled={!attributes.withErrorMessage}
				value={attributes.errorMessage ?? ''}
				onchange={handleUpdate}
			/>
			<input
				class="checkbox"
				type="checkbox"
				name="withErrorMessage"
				checked={attributes.withErrorMessage ?? false}
				onchange={handleUpdate}
			/>
		</div>

		<div class="space-y-2">
			{#each options as option, index (option)}
				<div class="bg-surface-100-800-token flex items-center justify-between rounded-lg">
					<div class="flex items-center gap-2">
						<p class="font-bold text-primary-500">Option {index + 1}:</p>
						<p class="text-primary-700">{option}</p>
					</div>
					<button type="button" class="btn-icon" onclick={() => handleRemoveOption(option)}>
						<IconSquareX />
					</button>
				</div>
			{/each}
		</div>

		<div class="flex items-center gap-2">
			<input class="input" type="text" placeholder="Option" bind:value={optionName} />
		</div>

		<button
			type="button"
			class="variant-outline-primary btn btn-sm w-full"
			onclick={handleAddOption}>Add Option</button
		>
	</div>

	<div class="bg-surface-100-800-token arrow"></div>
</div>

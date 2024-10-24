<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { IconAdjustmentsHorizontal } from '@tabler/icons-svelte';
	import { handleUpdateAttributes } from '../../store/store';
	import type { Attribute } from '../../utils/types';

	interface Props {
		target?: string;
		attributes: Attribute;
	}

	let { target = 'Some', attributes }: Props = $props();

	const popupFeatured: PopupSettings = {
		event: 'click',
		target: target,
		placement: 'bottom'
	};

	function handleUpdate(e: Event) {
		handleUpdateAttributes(target, attributes, e);
	}
</script>

<button class=" btn-icon" use:popup={popupFeatured}><IconAdjustmentsHorizontal /></button>
<div class="card z-50 w-72 p-4 shadow-xl" data-popup={target}>
	<div class="space-y-2">
		<div class="flex items-center gap-2">
			<input
				class="input"
				type="number"
				name="max"
				placeholder="Max"
				disabled={!attributes.withMax}
				value={attributes.max ?? ''}
				onchange={handleUpdate}
			/>
			<input
				class="checkbox"
				type="checkbox"
				name="withMax"
				checked={attributes.withMax ?? false}
				onchange={handleUpdate}
			/>
		</div>

		<div class="flex items-center gap-2">
			<input
				class="input"
				type="text"
				name="placeholder"
				placeholder="Placeholder"
				disabled={!attributes.withPlaceholder}
				value={attributes.placeholder ?? ''}
				onchange={handleUpdate}
			/>
			<input
				class="checkbox"
				type="checkbox"
				name="withPlaceholder"
				checked={attributes.withPlaceholder ?? false}
				onchange={handleUpdate}
			/>
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
	</div>

	<div class="bg-surface-100-800-token arrow"></div>
</div>

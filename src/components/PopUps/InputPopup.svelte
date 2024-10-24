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

<button class="btn-icon" use:popup={popupFeatured}><IconAdjustmentsHorizontal /></button>
<div class="card z-50 w-72 p-4 shadow-xl" data-popup={target}>
	<div class="space-y-2">
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

		<div class="flex items-center justify-end gap-2">
			<span>Is Required *</span>
			<input
				class="checkbox"
				type="checkbox"
				name="required"
				checked={attributes.required ?? false}
				onchange={handleUpdate}
			/>
		</div>

		<div class="space-y-2">
			<h4 class="h4">Input Type</h4>
			<span class="flex items-center space-x-2">
				<input
					class="radio"
					type="radio"
					name="type"
					value="text"
					checked={attributes.type === 'text'}
					onchange={handleUpdate}
				/>
				<p>Text</p>
			</span>
			<span class="flex items-center space-x-2">
				<input
					class="radio"
					type="radio"
					name="type"
					value="email"
					checked={attributes.type === 'email'}
					onchange={handleUpdate}
				/>
				<p>Email</p>
			</span>
			<span class="flex items-center space-x-2">
				<input
					class="radio"
					type="radio"
					name="type"
					value="password"
					checked={attributes.type === 'password'}
					onchange={handleUpdate}
				/>
				<p>Password</p>
			</span>

			<span class="flex items-center space-x-2">
				<input
					class="radio"
					type="radio"
					name="type"
					value="number"
					checked={attributes.type === 'number'}
					onchange={handleUpdate}
				/>
				<p>Number</p>
			</span>

			<span class="flex items-center space-x-2">
				<input
					class="radio"
					type="radio"
					name="type"
					value="date"
					checked={attributes.type === 'date'}
					onchange={handleUpdate}
				/>
				<p>Date</p>
			</span>
		</div>
	</div>

	<div class="bg-surface-100-800-token arrow"></div>
</div>

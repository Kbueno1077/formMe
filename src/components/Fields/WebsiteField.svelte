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
		const inputElement = event.target as HTMLInputElement;
		const value = inputElement.value;

		if (attributes?.required && !value) {
			hasError = true;
			return;
		}

		if (attributes?.type === 'url') {
			try {
				new URL(value);
			} catch (_) {
				hasError = true;
				return;
			}
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

	<div
		class="input-group input-group-divider max-w-[250px] grid-cols-[auto_1fr_auto] sm:max-w-full"
	>
		<div class="input-group-shim">{attributes?.prefix ?? ''}</div>
		<input
			{...attributes}
			type="text"
			placeholder={attributes?.placeholder}
			class={`${hasError ? 'input-error' : ''}`}
			aria-invalid={hasError}
			aria-describedby={hasError ? 'error-message' : undefined}
			{id}
			value={inputValue?.value ?? ''}
			oninput={validateInput}
			disabled={isSubmitted || attributes?.disabled}
		/>
	</div>

	{#if hasError && attributes?.errorMessage}
		<span class="error-message" id="error-message">{attributes.errorMessage}</span>
	{/if}
</div>

<script lang="ts">
	import { getInputAttributes, getInputValue } from '../../store/store';
	import type { Attribute, InputValueType } from '../../utils/types';

	interface Props {
		id: string;
	}

	let { id }: Props = $props();
	let attributes: Attribute | undefined = $state(undefined);
	let inputValue: InputValueType | undefined = $state(undefined);
	let hasError = $state(false);
	let options: any[] | undefined = $state();
	let optionsChecked: any[] | undefined = $state();

	$effect(() => {
		const attributesStore = getInputAttributes(id);
		const valueStore = getInputValue(id);

		attributesStore.subscribe((value) => {
			attributes = value;
		});

		valueStore.subscribe((value: any) => {
			inputValue = value;
			console.log('🚀 ~ valueStore.subscribe ~ value:', value);
		});
	});

	$effect(() => {
		options = attributes?.options ?? [];

		if (inputValue?.value) {
			optionsChecked = inputValue.value.split(',').map((option: string) => option.trim());
		}
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
		{#if options}
			{#each options as option (option)}
				<div class="flex items-center space-x-2">
					<input
						{...attributes}
						class={`checkbox ${hasError ? 'checkbox-error' : ''}`}
						type="checkbox"
						id={`cb_${id}_${option}`}
						name={`cbName_${id}`}
						checked={inputValue && optionsChecked?.includes(option)}
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

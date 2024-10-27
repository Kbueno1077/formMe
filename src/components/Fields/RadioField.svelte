<script lang="ts">
	import { getInputAttributes, getInputValue } from '../../store/store';
	import type { Attribute, InputValueType } from '../../utils/types';

	interface Props {
		id: string;
		isSubmitted: boolean;
	}

	//TODO: FIX MARK GET SUBMITTED VALUE
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

	function validateInput() {
		const selectedOption = document.querySelector(`input[name="rbName_${id}"]:checked`);
		if (attributes?.required && !selectedOption) {
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
						{...attributes}
						class={`radio ${hasError ? 'radio-error' : ''}`}
						type="radio"
						id={`rb_${id}_${option}`}
						name={`rbName_${id}`}
						value={option}
						checked={inputValue && inputValue?.value === option}
						onchange={validateInput}
						disabled={isSubmitted || attributes?.disabled}
					/>
					<p>{option}</p>
				</div>
			{/each}
		{/if}
	</div>

	{#if hasError && attributes?.errorMessage}
		<span class="error-message" id="error-message">{attributes.errorMessage}</span>
	{/if}
</div>

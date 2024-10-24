<script lang="ts">
	import { onDestroy } from 'svelte';
	import { inputsStore, updateFormTitle } from '../../store/store';
	import type { Field } from '../../utils/types';
	import CheckBoxField from '../Fields/CheckBoxField.svelte';
	import InputField from '../Fields/InputField.svelte';
	import ListvaluesField from '../Fields/ListvaluesField.svelte';
	import RadioField from '../Fields/RadioField.svelte';
	import SelectField from '../Fields/SelectField.svelte';
	import TextAreaField from '../Fields/TextAreaField.svelte';
	import WebsiteField from '../Fields/WebsiteField.svelte';
	import TabTitle from '../TabTilte/TabTitle.svelte';
	import PreviewWrapper from '../Wrapper/PreviewWrapper.svelte';

	let inputs: Field[] = $state([]);
	let formTitle: string = '';

	const unsubscribe = inputsStore.subscribe((value) => (inputs = value));
	onDestroy(unsubscribe);

	function handleTitleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		formTitle = target.value;
		updateFormTitle(formTitle);
	}

	function getPopUpComponent(id: string, type: string) {
		switch (type) {
			case 'input':
				return InputField;
			case 'textarea':
				return TextAreaField;
			case 'select':
				return SelectField;
			case 'checkbox':
				return CheckBoxField;
			case 'radio':
				return RadioField;
			case 'website':
				return WebsiteField;
			case 'list':
				return ListvaluesField;
			default:
				return null;
		}
	}
</script>

<div class="container mx-auto mb-8 space-y-8 sm:p-4">
	<TabTitle
		title="Input Preview"
		description="Welcome to the Preview tab! Here you can personalize your form inputs to match your what your want"
	/>

	<div>
		<label for="tilteInput">Add a title to your form</label>
		<input
			id="tilteInput"
			class="input mt-2"
			type="text"
			placeholder="Form Title"
			oninput={handleTitleChange}
		/>
	</div>

	{#if inputs.length > 0}
		{#each inputs as input (input.id)}
			<PreviewWrapper type={input.component} id={input.id} attributes={input.attributes}>
				{@const SvelteComponent = getPopUpComponent(input.id, input.component)}
				<SvelteComponent id={input.id} />
			</PreviewWrapper>
		{/each}
	{:else}
		<div class="card variant-ghost-surface p-4">
			<p class="text-center">No inputs to preview. Please add them in the Components tab.</p>
		</div>
	{/if}
</div>

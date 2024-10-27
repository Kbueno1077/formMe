<script lang="ts">
	import { CodeBlock, getToastStore } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';
	import {
		checkValues,
		createdUrlsInSession,
		exportDataJSON,
		formTitle,
		inputsStore,
		storeInDB
	} from '../../store/store';
	import type { Field, SavedUrl } from '../../utils/types';
	import { toastConfig } from '../../utils/validation';
	import CheckBoxField from '../Fields/CheckBoxField.svelte';
	import InputField from '../Fields/InputField.svelte';
	import ListvaluesField from '../Fields/ListvaluesField.svelte';
	import RadioField from '../Fields/RadioField.svelte';
	import SelectField from '../Fields/SelectField.svelte';
	import TextAreaField from '../Fields/TextAreaField.svelte';
	import WebsiteField from '../Fields/WebsiteField.svelte';
	import TabTitle from '../TabTilte/TabTitle.svelte';

	let inputs: Field[] = $state([]);
	let title: string = $state('');
	let createdUrlSession: SavedUrl[] = $state([]);
	let creating = $state(false);

	const toastStore = getToastStore();

	const unsubscribe = inputsStore.subscribe((value: Field[]) => {
		inputs = value;
	});
	const unsubscribeFormTitle = formTitle.subscribe((value: string) => {
		title = value ?? '';
	});

	const unsubscribeCreatedUrls = createdUrlsInSession.subscribe((value: SavedUrl[]) => {
		createdUrlSession = value ?? '';
	});

	const unsubs = () => {
		unsubscribe();
		unsubscribeFormTitle();
		unsubscribeCreatedUrls();
	};

	const createForm = async () => {
		creating = true;
		const response = await storeInDB();

		if (response === 'Title Error') {
			toastStore.trigger(toastConfig('You must set a Title for this Form', 'error'));
		} else if (response) {
			toastStore.trigger(toastConfig('Your form has been created', 'success'));
		}

		creating = false;
	};

	onDestroy(unsubs);

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
		title="Form Result"
		description="Great job customizing your inputs! In this Form tab, you'll see the final result of your creative form. "
	/>
	<div class="card variant-ghost-surface p-4">
		<p class="text-center text-xl">
			<strong>Note:</strong> After creating the form take the url and save it to check on the filled
			one, share with the desired person, note that you must create 1 url for person
		</p>
	</div>

	{#if createdUrlSession.length > 0}
		<h2 class="text-2xl font-bold">Created URLs in this session:</h2>
		<ul class="list-disc space-y-4">
			{#each createdUrlSession as savedUrl (savedUrl.id)}
				<CodeBlock language={`URL for ${savedUrl.title}`} code={savedUrl.url}></CodeBlock>
			{/each}
		</ul>
	{/if}

	{#if inputs.length > 0}
		<div class="card card-hover block space-y-10 p-4">
			<h2 class="text-4xl font-bold">{title}</h2>

			{#each inputs as input (input.id)}
				{@const SvelteComponent = getPopUpComponent(input.id, input.component)}
				<SvelteComponent id={input.id} />
			{/each}
		</div>
	{:else}
		<div class="card variant-ghost-surface p-4">
			<p class="text-center">
				No inputs to show. Please add them in the Components tab and edit them in the Preview tab
			</p>
		</div>
	{/if}

	<div class="flex justify-end space-x-4">
		<button class="variant-filled-primary btn" onclick={checkValues}> Check Values </button>
		<button class="variant-filled-primary btn" onclick={exportDataJSON}> Export to JSON </button>
		<button class="variant-filled-primary btn" onclick={createForm} disabled={creating}>
			{#if creating}
				<div
					class="border-muted-300 h-7 w-7 animate-spin rounded-full border-4 border-t-primary-500"
				></div>
			{:else}
				<span> Create Form </span>
			{/if}
		</button>
	</div>
</div>

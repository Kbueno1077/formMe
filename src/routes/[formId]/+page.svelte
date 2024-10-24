<script lang="ts">
	import { page } from '$app/stores';
	import { db } from '$lib/firebase/firebase';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';
	import CheckBoxField from '../../components/Fields/CheckBoxField.svelte';
	import InputField from '../../components/Fields/InputField.svelte';
	import ListvaluesField from '../../components/Fields/ListvaluesField.svelte';
	import RadioField from '../../components/Fields/RadioField.svelte';
	import SelectField from '../../components/Fields/SelectField.svelte';
	import TextAreaField from '../../components/Fields/TextAreaField.svelte';
	import WebsiteField from '../../components/Fields/WebsiteField.svelte';
	import Loader from '../../components/Loader/Loader.svelte';
	import TabTitle from '../../components/TabTilte/TabTitle.svelte';
	import {
		bindFirestoreValuesToInputs,
		checkValues,
		extractValues,
		importDataFirestore,
		importDataValuesFirestore,
		inputsStore
	} from '../../store/store';

	let formId = $page.params.formId;

	let loading = $state(true);
	let title = $state('');
	let isSubmitted = $state(false);
	let error: any = $state(null);

	async function fetchFormData() {
		try {
			loading = true;
			error = null;

			console.log(formId);
			const formRef = doc(db, 'forms', formId);
			const formSnap = await getDoc(formRef);

			if (formSnap.exists()) {
				title = formSnap.get('title');
				importDataFirestore(formSnap.get('inputs'));
				isSubmitted = formSnap.get('submitted') ?? false;

				if (isSubmitted) {
					importDataValuesFirestore(formSnap.get('inputValues'));
				}
			} else {
				error = 'Form not found';
			}
		} catch (err) {
			console.error('Error fetching form:', err);
			error = 'Error loading form data';
		} finally {
			loading = false;
		}
	}

	async function markFormAsSubmitted() {
		try {
			const inputValues = extractValues();
			const formRef = doc(db, 'forms', formId);
			await updateDoc(formRef, { submitted: true, inputValues });

			console.log('Form marked as submitted');
		} catch (err) {
			console.error('Error updating form:', err);
			error = 'Error updating form data';
		}
	}

	$effect(() => {
		if (formId) fetchFormData();
	});

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

<div class="container mx-auto mb-8 space-y-10 sm:p-4">
	<TabTitle
		title={isSubmitted ? 'Submitted Form' : 'Fill and Submit Form'}
		description={isSubmitted
			? 'This is the filled and Submitted form'
			: 'Fill the form below and submit it to save your data'}
	/>

	<div class="card variant-ghost-surface p-4">
		<p class="mt-3 text-center text-xl">This Form has been submitted, Here is the content!</p>
	</div>

	{#if loading}
		<div class="flex w-full justify-center">
			<div>
				<Loader />
				<p class="mt-10 text-xl font-bold">Loading . . .</p>
			</div>
		</div>
	{/if}

	{#if error}
		<div class="card variant-ghost-surface p-4">
			<p class="text-center">{error}</p>
		</div>
	{/if}

	{#if $inputsStore.length > 0}
		<form onsubmit={markFormAsSubmitted} class="card card-hover block space-y-10 p-4">
			<h2 class="text-4xl font-bold">{title}</h2>

			{#each $inputsStore as input (input.id)}
				{@const SvelteComponent = getPopUpComponent(input.id, input.component)}
				<SvelteComponent id={input.id} />
			{/each}

			{#if !isSubmitted}
				<div class="flex justify-end space-x-4">
					<button type="submit" class="variant-filled-primary btn btn-lg"> Submit </button>
				</div>
			{/if}
		</form>
	{:else if !loading}
		<div class="card variant-ghost-surface p-4">
			<p class="text-center">
				No inputs to show. Please add them in the Components tab and edit them in the Preview tab
			</p>
		</div>
	{/if}
</div>

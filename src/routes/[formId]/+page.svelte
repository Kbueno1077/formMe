<script lang="ts">
	import { page } from '$app/stores';
	import { db } from '$lib/firebase/firebase';
	import { getToastStore } from '@skeletonlabs/skeleton';
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
		checkValues,
		extractValues,
		importDataFirestore,
		importDataValuesFirestore,
		inputsStore
	} from '../../store/store';
	import { toastConfig } from '../../utils/validation';
	import { goto } from '$app/navigation';

	const toastStore = getToastStore();

	let formId = $page.params.formId;

	let loading = $state(true);
	let title = $state('');
	let isSubmitted = $state(false);
	let email = $state('');

	async function fetchFormData() {
		try {
			loading = true;

			const formRef = doc(db, 'forms', formId);
			const formSnap = await getDoc(formRef);

			if (formSnap.exists()) {
				title = formSnap.get('title');
				importDataFirestore(formSnap.get('inputs'));
				isSubmitted = formSnap.get('submitted') ?? false;
				email = formSnap.get('email') ?? null;

				if (isSubmitted) {
					importDataValuesFirestore(formSnap.get('inputValues'));
				}
			} else {
				toastStore.trigger(toastConfig('Form not found', 'error'));
			}
		} catch (err) {
			console.error('Error fetching form:', err);
			toastStore.trigger(toastConfig('Error loading form data', 'error'));
		} finally {
			loading = false;
		}
	}

	async function markFormAsSubmitted() {
		try {
			const inputValues = extractValues();
			const formRef = doc(db, 'forms', formId);
			await updateDoc(formRef, { submitted: true, inputValues });

			toastStore.trigger(toastConfig('Your Form has been submitted', 'success'));

			if (email) {
				try {
					const response = await fetch('/api/send-email', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ to: email, formUrl: `${window.location.href}${formId}` })
					});

					if (!response.ok) {
						const result = await response.json();
						throw new Error(result.error || 'Failed to send email');
					}

					toastStore.trigger(toastConfig('Email sent successfully', 'success'));
				} catch (err: any) {
					console.error('Error sending email:', err);
					toastStore.trigger(toastConfig(`Error sending email: ${err.message}`, 'error'));
				}
			}

			goto(`/`);
		} catch (err: any) {
			console.error('Error updating form:', err);
			toastStore.trigger(toastConfig(`Error updating form data: ${err.message}`, 'error'));
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

	{#if isSubmitted && !loading}
		<div class="card variant-ghost-surface p-4">
			<p class="mt-3 text-center text-xl">This Form has been submitted, Here is the content!</p>
		</div>
	{/if}

	{#if loading}
		<div class="flex w-full justify-center">
			<div>
				<Loader />
				<p class="mt-10 text-xl font-bold">Loading . . .</p>
			</div>
		</div>
	{/if}

	{#if $inputsStore.length > 0}
		<form onsubmit={markFormAsSubmitted} class="card card-hover block space-y-10 p-4">
			<h2 class="text-4xl font-bold">{title}</h2>

			{#each $inputsStore as input (input.id)}
				{@const SvelteComponent = getPopUpComponent(input.id, input.component)}
				<SvelteComponent id={input.id} {isSubmitted} />
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

<script lang="ts">
	import { page } from '$app/stores';
	import { db } from '$lib/firebase/firebase';
	import { doc, getDoc } from 'firebase/firestore';
	import { SvelteComponent } from 'svelte';
	import CheckBoxField from '../../components/Fields/CheckBoxField.svelte';
	import InputField from '../../components/Fields/InputField.svelte';
	import ListvaluesField from '../../components/Fields/ListvaluesField.svelte';
	import RadioField from '../../components/Fields/RadioField.svelte';
	import SelectField from '../../components/Fields/SelectField.svelte';
	import TextAreaField from '../../components/Fields/TextAreaField.svelte';
	import WebsiteField from '../../components/Fields/WebsiteField.svelte';
	import TabTitle from '../../components/TabTilte/TabTitle.svelte';
	import type { Field } from '../../utils/types';

	let formId = $page.params.formId;

	let loading = $state(false);
	let title = $state('');
	let inputs: Field[] = $state([]);
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
				inputs = formSnap.get('inputs');
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

<div class="container mx-auto mb-8 space-y-8 sm:p-4">
	<TabTitle
		title="Form Result"
		description="Great job customizing your inputs! In this Form tab, you'll see the final result of your creative form:"
	/>

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

	<div class="flex justify-center space-x-4">
		<button class="variant-filled-primary btn"> Submit </button>
	</div>
</div>

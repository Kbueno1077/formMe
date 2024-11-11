<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { importDataJson } from '../../store/store';
	import basicTemplate1 from '../../utils/templates/BaiscForm1.json';
	import basicTemplate2 from '../../utils/templates/BasicForm2.json';
	import { toastConfig } from '../../utils/validation';
	import type { Field } from '../../utils/types';

	let selectedTemplate = $state();
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	const confirmModal = {
		type: 'confirm' as const,
		title: 'Confirmation',
		body: 'Are you sure you want to proceed, This will remove all progress you have on current work?',
		buttonTextConfirm: 'Yes, proceed',
		buttonTextCancel: 'Cancel',
		response: (r: boolean) => {
			if (r) {
				selectTemplate();
			}
		}
	};

	function triggerConfirm() {
		modalStore.trigger(confirmModal);
	}

	function selectTemplate() {
		importDataJson(selectedTemplate as Field[]);
		toastStore.trigger(toastConfig('You have selected a template, data is loaded', 'success'));
	}
</script>

<div class="template-selection">
	<h3 class="h3 mb-2">Start with a Template:</h3>
	<div class="flex gap-2">
		<button
			class="card card-hover block w-full max-w-[500px] p-4"
			onclick={() => {
				selectedTemplate = basicTemplate1.data;
				triggerConfirm();
			}}
		>
			<div class="flex flex-col items-start justify-start">
				<h3 class="text-2xl font-bold">{basicTemplate1.name}</h3>
				<p class="mt-2 text-start">{basicTemplate1.description}</p>
			</div>
		</button>
		<button
			class="card card-hover block w-full max-w-[500px] p-4"
			onclick={() => {
				selectedTemplate = basicTemplate2.data;
				triggerConfirm();
			}}
		>
			<div class="flex flex-col items-start justify-start">
				<h3 class="text-2xl font-bold">{basicTemplate2.name}</h3>
				<p class="mt-2 text-start">{basicTemplate2.description}</p>
			</div>
		</button>
	</div>
</div>

<style>
</style>

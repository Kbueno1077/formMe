<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import basicTemplate1 from '../../utils/templates/BaiscForm1.json';
	import { toastConfig } from '../../utils/validation';
	import { clearAllInputs } from '../../store/store';

	let selectedTemplate = $state();
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	const confirmModal = {
		type: 'confirm' as 'confirm',
		title: 'Confirmation',
		body: 'Are you sure you want to proceed, This will remove all progress you have on current work?',
		buttonTextConfirm: 'Yes, proceed',
		buttonTextCancel: 'Cancel',
		response: (r: boolean) => {
			if (r) {
				clearAll();
			}
		}
	};

	function triggerConfirm() {
		modalStore.trigger(confirmModal);
	}

	function clearAll() {
		clearAllInputs();
		toastStore.trigger(toastConfig('Preview cleared', 'success'));
	}
</script>

<div class="flex gap-2">
	<button
		class="variant-filled btn btn-sm"
		onclick={() => {
			selectedTemplate = basicTemplate1.data;
			triggerConfirm();
		}}
	>
		Clear all
	</button>
</div>

<style>
</style>

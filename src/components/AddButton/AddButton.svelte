<script>
	/** @type {{onAddClick: any}} */
	let { onAddClick } = $props();
</script>

<div class="flex w-full justify-end">
	<button type="button" class="variant-filled btn btn-sm" onclick={onAddClick}>Add +</button>
</div>

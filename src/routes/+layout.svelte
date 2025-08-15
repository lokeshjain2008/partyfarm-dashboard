<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initializeAuthListener, authStore } from '$lib/stores/auth.js';
	
	let { children } = $props();

	// Initialize auth on app startup
	onMount(async () => {
		// Initialize the auth listener
		initializeAuthListener();
		
		// Initialize the auth store
		await authStore.initialize();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

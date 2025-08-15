<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { setAuthContext, initializeAuthListener } from '$lib/contexts/auth.svelte.js';
	
	// Use runes for props
	let { children } = $props();

	// Set up auth context for the entire app
	const authContext = setAuthContext();

	// Initialize auth on app startup
	onMount(async () => {
		// Initialize the auth listener
		initializeAuthListener(authContext);
		
		// Initialize the auth context
		await authContext.initialize();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

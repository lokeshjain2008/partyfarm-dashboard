<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase.js';
	import { authStore } from '$lib/stores/auth.js';

	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			// Handle the OAuth callback
			const { data, error: authError } = await supabase.auth.getSession();

			if (authError) {
				console.error('Auth callback error:', authError);
				error = authError.message;
				loading = false;
				return;
			}

			if (data.session) {
				// Initialize auth store with the new session
				await authStore.initialize();

				// Redirect to dashboard or intended page
				const redirectTo = $page.url.searchParams.get('redirectTo') || '/';
				await goto(redirectTo, { replaceState: true });
			} else {
				// No session found, redirect to login
				await goto('/login', { replaceState: true });
			}
		} catch (err) {
			console.error('Callback processing error:', err);
			error = 'An unexpected error occurred during authentication.';
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Authenticating... - PartyFarm</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			{#if loading}
				<div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
				<h2 class="mt-6 text-3xl font-extrabold text-gray-900">Authenticating...</h2>
				<p class="mt-2 text-sm text-gray-600">Please wait while we complete your sign-in.</p>
			{:else if error}
				<div class="rounded-md bg-red-50 p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">Authentication Error</h3>
							<div class="mt-2 text-sm text-red-700">
								<p>{error}</p>
							</div>
							<div class="mt-4">
								<div class="-mx-2 -my-1.5 flex">
									<button
										type="button"
										class="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
										on:click={() => goto('/login')}
									>
										Try Again
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
	import { getAuthContext } from '$lib/contexts/auth.svelte.js';

	// Get auth context
	const auth = getAuthContext();
</script>

<div class="auth-status">
	{#if auth.loading}
		<div class="flex items-center space-x-2">
			<div class="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
			<span class="text-sm text-gray-600">Loading...</span>
		</div>
	{:else if auth.isAuthenticated}
		<div class="flex items-center space-x-2">
			<div class="h-2 w-2 rounded-full bg-green-500"></div>
			<span class="text-sm text-gray-700">
				Signed in as {auth.user?.email}
				{#if auth.user?.role}
					<span class="text-xs text-gray-500">({auth.user.role})</span>
				{/if}
			</span>
		</div>
	{:else}
		<div class="flex items-center space-x-2">
			<div class="h-2 w-2 rounded-full bg-red-500"></div>
			<span class="text-sm text-gray-700">Not signed in</span>
		</div>
	{/if}
</div>

<style>
	.auth-status {
		@apply p-2 rounded-md bg-gray-50 border;
	}
</style>
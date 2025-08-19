<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { getAuthContext } from '$lib/contexts/auth.svelte.js';
	import AuthStatus from '$lib/components/AuthStatus.svelte';

	const auth = getAuthContext();
</script>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold text-gray-900 mb-6">PartyFarm Dashboard</h1>
		
		<div class="mb-6">
			<AuthStatus />
		</div>

		{#if !auth.isAuthenticated}
			<div class="bg-white p-6 rounded-lg shadow">
				<h2 class="text-xl font-semibold mb-4">Welcome to PartyFarm</h2>
				<p class="text-gray-600 mb-4">
					Please sign in to access the booking management platform.
				</p>
				<Button href="/login" color="primary">
					Sign In
				</Button>
			</div>
		{:else}
			<div class="bg-white p-6 rounded-lg shadow">
				<h2 class="text-xl font-semibold mb-4">Dashboard</h2>
				<p class="text-gray-600 mb-4">
					Welcome back! You are signed in as {auth.user?.email}
				</p>
				{#if auth.isPending}
					<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<h3 class="text-yellow-800 font-medium">Account Pending Approval</h3>
						<p class="text-yellow-700 text-sm mt-1">
							Your account is pending admin approval. You'll receive access once approved.
						</p>
					</div>
				{:else if auth.isActive}
					<div class="bg-green-50 border border-green-200 rounded-lg p-4">
						<h3 class="text-green-800 font-medium">Account Active</h3>
						<p class="text-green-700 text-sm mt-1">
							Your account is active. Role: {auth.userRole}
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

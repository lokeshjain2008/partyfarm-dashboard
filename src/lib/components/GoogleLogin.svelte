<script lang="ts">
	import { Button, Card, Alert } from 'flowbite-svelte';
	import { GoogleSolid, ArrowLeftOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { signInWithGoogle } from '$lib/auth.js';
	import { getAuthContext } from '$lib/contexts/auth.svelte';

	// Props
	let { onBack }: {
		onBack: () => void;
	} = $props();

	// State
	let loading = $state(false);
	let error = $state<string | null>(null);

	// Get auth context
	const auth = getAuthContext();

	async function handleGoogleLogin() {
		try {
			loading = true;
			error = null;

			const { user, session, error: authError } = await signInWithGoogle();

			if (authError) {
				error = authError.message;
				return;
			}

			if (user && session) {
				// Auth context will be updated automatically via the auth listener
				// The user will be redirected by the OAuth flow
			}
		} catch (err) {
			console.error('Google login error:', err);
			error = 'An unexpected error occurred. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<Card class="w-full max-w-md mx-auto">
	<div class="space-y-6">
		<!-- Header with back button -->
		<div class="flex items-center space-x-3">
			<Button
				onclick={onBack}
				disabled={loading}
				size="sm"
				color="alternative"
				class="p-2"
			>
				<ArrowLeftOutline class="w-4 h-4" />
			</Button>
			<div>
				<h2 class="text-xl font-bold text-gray-900">Sign in with Google</h2>
				<p class="text-sm text-gray-600">Use your Google account to continue</p>
			</div>
		</div>

		<!-- Error Alert -->
		{#if error}
			<Alert color="red" class="mb-4">
				<div class="flex items-center">
					<ExclamationCircleSolid class="w-4 h-4 mr-2" />
					<span class="font-medium">Error:</span> {error}
				</div>
			</Alert>
		{/if}

		<!-- Google Login Button -->
		<div class="space-y-4">
			<Button
				onclick={handleGoogleLogin}
				disabled={loading}
				class="w-full flex items-center justify-center space-x-3 py-3"
				color="alternative"
			>
				{#if loading}
					<div class="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
				{:else}
					<GoogleSolid class="w-5 h-5 text-red-500" />
				{/if}
				<span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
			</Button>

			<div class="text-center">
				<p class="text-xs text-gray-500">
					You'll be redirected to Google to complete the sign-in process
				</p>
			</div>
		</div>

		<!-- Info -->
		<div class="bg-blue-50 p-4 rounded-lg">
			<div class="flex">
				<div class="ml-3">
					<h3 class="text-sm font-medium text-blue-800">
						New to PartyFarm?
					</h3>
					<div class="mt-2 text-sm text-blue-700">
						<p>
							Your account will be created automatically. An admin will review and approve your access.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</Card>
<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import { GoogleSolid, PhoneSolid } from 'flowbite-svelte-icons';

	// Props
	let { onGoogleLogin, onPhoneLogin, loading = false }: {
		onGoogleLogin: () => void;
		onPhoneLogin: () => void;
		loading?: boolean;
	} = $props();
</script>

<Card class="w-full max-w-md mx-auto">
	<div class="space-y-6">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-gray-900">Welcome to PartyFarm</h2>
			<p class="mt-2 text-sm text-gray-600">Choose your preferred login method</p>
		</div>

		<div class="space-y-4">
			<!-- Google Login Button -->
			<Button
				onclick={onGoogleLogin}
				disabled={loading}
				class="w-full flex items-center justify-center space-x-3 py-3"
				color="alternative"
			>
				<GoogleSolid class="w-5 h-5 text-red-500" />
				<span>Continue with Google</span>
			</Button>

			<!-- Divider -->
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-2 bg-white text-gray-500">or</span>
				</div>
			</div>

			<!-- Phone Login Button -->
			<Button
				onclick={onPhoneLogin}
				disabled={loading}
				class="w-full flex items-center justify-center space-x-3 py-3"
				color="primary"
			>
				<PhoneSolid class="w-5 h-5" />
				<span>Continue with Phone</span>
			</Button>
		</div>

		<div class="text-center">
			<p class="text-xs text-gray-500">
				By continuing, you agree to our Terms of Service and Privacy Policy
			</p>
		</div>
	</div>
</Card>
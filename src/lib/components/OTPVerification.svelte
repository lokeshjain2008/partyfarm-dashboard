<script lang="ts">
	import { Button, Card, Alert, Input, Label } from 'flowbite-svelte';
	import { ArrowLeftOutline, ExclamationCircleSolid, CheckCircleSolid } from 'flowbite-svelte-icons';
	import { verifyPhoneOTP, sendPhoneOTP, isValidOTP } from '$lib/auth.js';
	import { getAuthContext } from '$lib/contexts/auth.svelte.js';

	// Props
	let { phone, onBack }: {
		phone: string;
		onBack: () => void;
	} = $props();

	// State
	let otp = $state('');
	let loading = $state(false);
	let resending = $state(false);
	let error = $state<string | null>(null);
	let resendCooldown = $state(0);
	let validationError = $state<string | null>(null);

	// Get auth context
	const auth = getAuthContext();

	// Reactive validation
	$effect(() => {
		if (otp && !isValidOTP(otp)) {
			validationError = 'OTP must be 6 digits';
		} else {
			validationError = null;
		}
	});

	// Start resend cooldown
	function startResendCooldown() {
		resendCooldown = 60; // 60 seconds
		const interval = setInterval(() => {
			resendCooldown--;
			if (resendCooldown <= 0) {
				clearInterval(interval);
			}
		}, 1000);
	}

	// Start cooldown on component mount
	$effect(() => {
		startResendCooldown();
	});

	function handleOTPInput(event: Event) {
		const target = event.target as HTMLInputElement;
		let value = target.value;
		
		// Remove all non-digit characters
		value = value.replace(/\D/g, '');
		
		// Limit to 6 digits
		if (value.length > 6) {
			value = value.slice(0, 6);
		}
		
		otp = value;
	}

	async function handleVerifyOTP() {
		try {
			loading = true;
			error = null;

			if (!isValidOTP(otp)) {
				error = 'Please enter a valid 6-digit OTP';
				return;
			}

			const { user, session, error: verifyError } = await verifyPhoneOTP(phone, otp);

			if (verifyError) {
				error = verifyError.message;
				return;
			}

			if (user && session) {
				// Auth context will be updated automatically via the auth listener
				// User will be redirected to appropriate dashboard
			}
		} catch (err) {
			console.error('OTP verification error:', err);
			error = 'An unexpected error occurred. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function handleResendOTP() {
		try {
			resending = true;
			error = null;

			const { error: resendError } = await sendPhoneOTP(phone);

			if (resendError) {
				error = resendError.message;
				return;
			}

			// Reset OTP and start cooldown
			otp = '';
			startResendCooldown();
		} catch (err) {
			console.error('Resend OTP error:', err);
			error = 'Failed to resend OTP. Please try again.';
		} finally {
			resending = false;
		}
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (!validationError && otp) {
			handleVerifyOTP();
		}
	}

	// Check if form is valid
	let canSubmit = $derived(otp && !validationError && !loading);
	let canResend = $derived(resendCooldown <= 0 && !resending && !loading);

	// Format phone for display
	let displayPhone = $derived(phone.replace('+91', '').replace(/(\d{5})(\d{5})/, '$1 $2'));
</script>

<Card class="w-full max-w-md mx-auto">
	<div class="space-y-6">
		<!-- Header with back button -->
		<div class="flex items-center space-x-3">
			<Button
				onclick={onBack}
				disabled={loading || resending}
				size="sm"
				color="alternative"
				class="p-2"
			>
				<ArrowLeftOutline class="w-4 h-4" />
			</Button>
			<div>
				<h2 class="text-xl font-bold text-gray-900">Verify Phone Number</h2>
				<p class="text-sm text-gray-600">
					Enter the 6-digit code sent to +91 {displayPhone}
				</p>
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

		<!-- OTP Form -->
		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<Label for="otp" class="mb-2">Verification Code</Label>
				<Input
					id="otp"
					type="text"
					inputmode="numeric"
					placeholder="Enter 6-digit code"
					bind:value={otp}
					oninput={handleOTPInput}
					disabled={loading || resending}
					class="text-center text-lg tracking-widest"
					color={validationError ? 'red' : undefined}
					maxlength={6}
				/>
				{#if validationError}
					<p class="mt-1 text-sm text-red-600">{validationError}</p>
				{/if}
			</div>

			<Button
				type="submit"
				disabled={!canSubmit}
				class="w-full flex items-center justify-center space-x-3 py-3"
				color="primary"
			>
				{#if loading}
					<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
				{:else}
					<CheckCircleSolid class="w-5 h-5" />
				{/if}
				<span>{loading ? 'Verifying...' : 'Verify Code'}</span>
			</Button>
		</form>

		<!-- Resend OTP -->
		<div class="text-center">
			<p class="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
			{#if canResend}
				<Button
					onclick={handleResendOTP}
					disabled={resending}
					color="alternative"
					size="sm"
				>
					{#if resending}
						<div class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
					{/if}
					{resending ? 'Sending...' : 'Resend Code'}
				</Button>
			{:else}
				<p class="text-sm text-gray-500">
					Resend code in {resendCooldown} seconds
				</p>
			{/if}
		</div>

		<!-- Info -->
		<div class="bg-yellow-50 p-4 rounded-lg">
			<div class="flex">
				<div class="ml-3">
					<h3 class="text-sm font-medium text-yellow-800">
						Code not arriving?
					</h3>
					<div class="mt-2 text-sm text-yellow-700">
						<p>
							Check your SMS messages. The code may take up to 2 minutes to arrive.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</Card>
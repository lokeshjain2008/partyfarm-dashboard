<script lang="ts">
	import { Button, Card, Alert, Input, Label } from 'flowbite-svelte';
	import { PhoneSolid, ArrowLeftOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { sendPhoneOTP, formatPhoneNumber, isValidPhoneNumber } from '$lib/auth.js';

	// Props
	let { onBack, onOTPSent }: {
		onBack: () => void;
		onOTPSent: (phone: string) => void;
	} = $props();

	// State
	let phone = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let validationError = $state<string | null>(null);

	// Reactive validation
	$effect(() => {
		if (phone && !isValidPhoneNumber(phone)) {
			validationError = 'Please enter a valid 10-digit phone number';
		} else {
			validationError = null;
		}
	});

	function handlePhoneInput(event: Event) {
		const target = event.target as HTMLInputElement;
		let value = target.value;
		
		// Remove all non-digit characters
		value = value.replace(/\D/g, '');
		
		// Limit to 10 digits
		if (value.length > 10) {
			value = value.slice(0, 10);
		}
		
		// Format as XXX-XXX-XXXX for display
		if (value.length >= 6) {
			value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
		} else if (value.length >= 3) {
			value = `${value.slice(0, 3)}-${value.slice(3)}`;
		}
		
		phone = value;
	}

	async function handleSendOTP() {
		try {
			loading = true;
			error = null;

			// Clean and validate phone number
			const cleanPhone = phone.replace(/\D/g, '');
			
			if (!isValidPhoneNumber(cleanPhone)) {
				error = 'Please enter a valid 10-digit phone number';
				return;
			}

			const formattedPhone = formatPhoneNumber(cleanPhone);
			const { error: otpError } = await sendPhoneOTP(formattedPhone);

			if (otpError) {
				error = otpError.message;
				return;
			}

			// Success - move to OTP verification
			onOTPSent(formattedPhone);
		} catch (err) {
			console.error('Phone OTP error:', err);
			error = 'An unexpected error occurred. Please try again.';
		} finally {
			loading = false;
		}
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (!validationError && phone) {
			handleSendOTP();
		}
	}

	// Check if form is valid
	let canSubmit = $derived(phone && !validationError && !loading);
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
				<h2 class="text-xl font-bold text-gray-900">Sign in with Phone</h2>
				<p class="text-sm text-gray-600">We'll send you a verification code</p>
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

		<!-- Phone Form -->
		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<Label for="phone" class="mb-2">Phone Number</Label>
				<div class="relative">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<PhoneSolid class="w-4 h-4 text-gray-500" />
					</div>
					<Input
						id="phone"
						type="tel"
						placeholder="Enter your phone number"
						bind:value={phone}
						oninput={handlePhoneInput}
						disabled={loading}
						class="pl-10"
						color={validationError ? 'red' : undefined}
					/>
				</div>
				{#if validationError}
					<p class="mt-1 text-sm text-red-600">{validationError}</p>
				{/if}
				<p class="mt-1 text-xs text-gray-500">
					Enter your 10-digit mobile number (Indian numbers only)
				</p>
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
					<PhoneSolid class="w-5 h-5" />
				{/if}
				<span>{loading ? 'Sending OTP...' : 'Send Verification Code'}</span>
			</Button>
		</form>

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
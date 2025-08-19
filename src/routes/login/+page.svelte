<script lang="ts">
	import { goto } from '$app/navigation';
	import { getAuthContext } from '$lib/contexts/auth.svelte.js';
	import AuthChoice from '$lib/components/AuthChoice.svelte';
	import GoogleLogin from '$lib/components/GoogleLogin.svelte';
	import PhoneLogin from '$lib/components/PhoneLogin.svelte';
	import OTPVerification from '$lib/components/OTPVerification.svelte';

	// Auth context
	const auth = getAuthContext();

	// State for managing the login flow
	let currentView = $state<'choice' | 'google' | 'phone' | 'otp'>('choice');
	let phoneNumber = $state<string>('');

	// Redirect if already authenticated
	$effect(() => {
		if (auth.isAuthenticated && !auth.loading) {
			// Redirect based on user role
			if (auth.isInHouseUser) {
				goto('/inhouse');
			} else if (auth.isFarmhouseUser) {
				goto('/farmhouse');
			} else {
				goto('/profile'); // Fallback for users without roles
			}
		}
	});

	// Navigation handlers
	function handleGoogleLogin() {
		currentView = 'google';
	}

	function handlePhoneLogin() {
		currentView = 'phone';
	}

	function handleOTPSent(phone: string) {
		phoneNumber = phone;
		currentView = 'otp';
	}

	function handleBack() {
		if (currentView === 'otp') {
			currentView = 'phone';
		} else {
			currentView = 'choice';
		}
	}
</script>

<svelte:head>
	<title>Login - PartyFarm</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<div class="text-center">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">PartyFarm</h1>
			<p class="text-gray-600">Booking Management Platform</p>
		</div>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		{#if currentView === 'choice'}
			<AuthChoice
				onGoogleLogin={handleGoogleLogin}
				onPhoneLogin={handlePhoneLogin}
				loading={auth.loading}
			/>
		{:else if currentView === 'google'}
			<GoogleLogin onBack={handleBack} />
		{:else if currentView === 'phone'}
			<PhoneLogin onBack={handleBack} onOTPSent={handleOTPSent} />
		{:else if currentView === 'otp'}
			<OTPVerification phone={phoneNumber} onBack={handleBack} />
		{/if}
	</div>

	<!-- Loading overlay -->
	{#if auth.loading}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white p-6 rounded-lg shadow-lg">
				<div class="flex items-center space-x-3">
					<div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
					<span class="text-gray-700">Loading...</span>
				</div>
			</div>
		</div>
	{/if}
</div>
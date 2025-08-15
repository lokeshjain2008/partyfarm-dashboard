import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/';

  if (code) {
    // The OAuth code will be handled by the client-side Supabase auth
    // We just need to pass it through to the client
    return {
      code,
      next
    };
  }

  // If no code, redirect to login
  throw redirect(303, '/login');
};
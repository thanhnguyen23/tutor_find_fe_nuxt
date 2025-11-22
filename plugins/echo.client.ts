import Echo from 'laravel-echo';
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import Pusher from 'pusher-js';

export default defineNuxtPlugin(() => {
	if (process.client && typeof window !== 'undefined') {
		const config = useRuntimeConfig();
		const authCookie = useAuthCookie();

		// Set up Pusher
		(window as any).Pusher = Pusher;

		// Get token from auth cookie
		const token = authCookie.getToken();

		(window as any).Echo = new Echo({
			broadcaster: 'pusher',
			key: config.public.pusherAppKey,
			cluster: config.public.pusherAppCluster,
			forceTLS: true,          // Pusher Cloud bắt buộc
			encrypted: true,
			disableStats: true,
			authEndpoint: `${config.public.apiUrl}/broadcasting/auth`,
			auth: {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		});
	}
});

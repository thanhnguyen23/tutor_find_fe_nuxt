export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const body = await readBody(event)

	try {
		const response = await $fetch(`${config.public.apiUrl}/api/auth/register`, {
			method: 'POST',
			body: body
		})

		if (response?.token) {
			setCookie(event, 'token', response.token, {
				maxAge: 60 * 60 * 24 * 7, // 1 week
				path: '/',
				// httpOnly: false // Allow client-side access for useApi
			})
		}

		return response
	} catch (error) {
		return error;
	}
})

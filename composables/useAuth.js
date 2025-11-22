import { useUserStore } from '~/stores/user'
import { useApi } from '~/composables/useApi'

export const useAuth = () => {
	const userStore = useUserStore()
	const { api } = useApi()

	const isAuthenticated = () => {
		return !!userStore.getUserData && Object.keys(userStore.getUserData || {}).length > 0
	}

	const verifyToken = async () => {
		try {
			const authCookie = useAuthCookie()
			const { getToken } = authCookie

			if (!getToken()) {
				return
			}

			const response = await api.apiPost('verify-token')
			if (response?.user) {
				userStore.setUserData(response.user)
				return response.user
			}
			userStore.clearAuth()
			return null
		} catch (error) {
			userStore.clearAuth()
			throw error
		}
	}

	const login = async (payload) => {
		try {
			const response = await $fetch('/api/login', {
				method: 'POST',
				body: payload
			})
			
			if (response?.user) {
				userStore.setAuth({
					user: response.user,
					token: response.token,
				})
			} else {
				await verifyToken()
			}
			return response
		} catch (error) {
			throw error
		}
	}

	const register = async (payload) => {
		try {
			const response = await $fetch('/api/register', {
				method: 'POST',
				body: payload
			})
			
			if (response?.user) {
				userStore.setAuth({
					user: response.user,
					token: response.token,
				})
			} else {
				await verifyToken()
			}
			return response
		} catch (error) {
			throw error
		}
	}

	const sendRegisterOtp = async (payload) => {
		try {
			const response = await api.apiPost('auth/register/otp', payload)
			return response
		} catch (error) {
			throw error
		}
	}

	const verifyRegisterOtp = async (payload) => {
		try {
			const response = await api.apiPost('auth/register/verify', payload)
			return response
		} catch (error) {
			throw error
		}
	}

	const logout = async () => {
		try {
			await api.apiPost('auth/logout')
		} finally {
			userStore.clearAuth()
		}
	}

	return {
		isAuthenticated,
		verifyToken,
		login,
		register,
		sendRegisterOtp,
		verifyRegisterOtp,
		logout,
	}
}

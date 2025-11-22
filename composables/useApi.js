import axios from 'axios';
import { useAuthCookie } from '~/composables/useAuthCookie'

export const useApi = () => {
	const config = useRuntimeConfig();
	const BASE_URL = config.public.apiUrl;
	const authCookie = useAuthCookie();

	// Get auth token from storage
	const getAuthToken = () => {
		return useCookie('token').value;
	};

	// Helper to create fetch options
	const createFetchOptions = (method, data = null, customHeaders = {}) => {
		const token = getAuthToken();
		const headers = {
			'Accept': 'application/json',
			...customHeaders
		};

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		const options = {
			baseURL: BASE_URL,
			method,
			headers,
		};

		if (data) {
			options.body = data;
		}

		return options;
	};

	// Handle response
	const handleResponse = (response) => {
		return response;
	};

	// Handle error
	const handleError = (error) => {
		if (error.response?.status === 401) {
			clearAuth();
		}
		
		if (error?.data) {
			return error.data;
		} else if (error?.response?._data) {
			return error.response._data;
		}

		return error;
	};

	// API methods
	const api = {
		/**
		 * GET request to /api/{url}
		 */
		async apiGet(url, params = {}) {
			try {
				const options = createFetchOptions('GET');
				options.params = params;
				const response = await $fetch(`/api/${url}`, options);
				return handleResponse(response);
			} catch (error) {
				throw handleError(error);
			}
		},

		/**
		 * POST request to /api/{url}
		 */
		async apiPost(url, data = {}) {
			try {
				const options = createFetchOptions('POST', data);
				const response = await $fetch(`/api/${url}`, options);
				return handleResponse(response);
			} catch (error) {
				throw handleError(error);
			}
		},

		/**
		 * PUT request to /api/{url}
		 */
		async apiPut(url, data = {}) {
			try {
				const options = createFetchOptions('PUT', data);
				const response = await $fetch(`/api/${url}`, options);
				return handleResponse(response);
			} catch (error) {
				throw handleError(error);
			}
		},

		/**
		 * DELETE request to /api/{url}
		 */
		async apiDelete(url) {
			try {
				const options = createFetchOptions('DELETE');
				const response = await $fetch(`/api/${url}`, options);
				return handleResponse(response);
			} catch (error) {
				throw handleError(error);
			}
		},

		/**
		 * POST FormData to /api/{url}
		 */
		async apiPostFormData(url, formData) {
			try {
				// Don't set Content-Type for FormData, let browser handle it
				const options = createFetchOptions('POST', formData);
				const response = await $fetch(`/api/${url}`, options);
				return handleResponse(response);
			} catch (error) {
				throw handleError(error);
			}
		},

		/**
		 * PUT FormData to /api/{url}
		 */
		async apiPutFormData(url, formData) {
			try {
				const options = createFetchOptions('PUT', formData);
				const response = await $fetch(`/api/${url}`, options);
				return handleResponse(response);
			} catch (error) {
				throw handleError(error);
			}
		},

		/**
		 * Direct GET request (without /api prefix)
		 */
		async get(url, params = {}) {
			try {
				const options = createFetchOptions('GET');
				options.baseURL = ''; // Reset baseURL for direct URL
				options.params = params;
				const response = await $fetch(url, options);
				return handleResponse(response);
			} catch (error) {
				throw handleError(error);
			}
		},

		/**
		 * Direct POST request (without /api prefix)
		 */
		async post(url, data = {}) {
			try {
				const options = createFetchOptions('POST', data);
				options.baseURL = ''; // Reset baseURL for direct URL
				const response = await $fetch(url, options);
				return handleResponse(response);
			} catch (error) {
				throw handleError(error);
			}
		},
	};

	/**
	 * Set or remove authentication token
	 * This manually updates the token in cookie
	 */
	const setAuthToken = (token) => {
		authCookie.setToken(token || null);
	};

	/**
	 * Clear authentication
	 */
	const clearAuth = () => {
		authCookie.removeToken();
	};

	/**
	 * Get current token
	 */
	const getToken = () => {
		return getAuthToken();
	};

	return { api, setAuthToken, clearAuth, getToken };
};


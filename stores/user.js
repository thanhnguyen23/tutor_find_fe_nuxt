import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => {
		return {
			token: '',
			userData: {},
		};
	},

	getters: {
		// Lấy userData trực tiếp từ state
		getUserData: (state) => state.userData,

		// Lấy token từ state (cookie được sync vào state qua actions)
		getToken: (state) => state.token,

		isAuthenticated(state) {
			if (state.token) return true;

			if (process.client) {
				try {
					const { hasToken } = useAuthCookie();
					return hasToken();
				} catch {
					return false;
				}
			}
			return false;
		},
	},

	actions: {
		setUserData(payload) {
			this.userData = payload || {};
		},

		setToken(payload) {
			this.token = payload || '';
			const { setToken } = useAuthCookie();
			setToken(payload || null);
		},

		setAuth(payload) {
			this.setToken(payload.token || '');
			this.setUserData(payload.user || {});
		},

		clearAuth() {
			this.setToken('');
			this.setUserData({});
			const { removeToken } = useAuthCookie();
			removeToken();
		},
	},
});

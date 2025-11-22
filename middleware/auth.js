export default defineNuxtRouteMiddleware(async (to, from) => {
	const userStore = useUserStore();
	const { verifyToken } = useAuth();
	const { getToken } = useAuthCookie();

	const token = getToken();

	if (!token) {
		return navigateTo({
			path: '/auth/login',
			query: { redirect: to.fullPath }
		});
	}

	// if (!userStore.getUserData || Object.keys(userStore.getUserData).length === 0) {
	// 	try {
	// 		await verifyToken();

	// 		// if (!userStore.getUserData) {
	// 		// 	userStore.clearAuth();
	// 		// 	return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } });
	// 		// }
	// 		// await userStore.setUserData(userStore.getUserData);
	// 	} catch (err) {
	// 		userStore.clearAuth();
	// 		return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } });
	// 	}
	// }
});


import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
	state: () => ({
		showNotification: {
			show: false,
			message: '',
			type: 'error',
		},
		notificationQueue: [], // Array to hold multiple notifications
		hiddenNotificationPreview: false,
		unreadData: {
			messages: 0,
			pending_booking: 0,
			notifications: 0,
			schedule: 0,
			recheduled_bookings: 0,
		},
	}),

	getters: {
		getShowNotification: (state) => state.showNotification,
		getNotificationQueue: (state) => state.notificationQueue,
		isNotificationPreviewHidden: (state) => state.hiddenNotificationPreview,
		getUnreadData: (state) => state.unreadData,
	},

	actions: {
		setShowNotification(payload) {
			this.showNotification = payload;
		},

		addNotificationToQueue(payload) {
			this.notificationQueue.push(payload);
		},

		removeNotificationFromQueue(id) {
			this.notificationQueue = this.notificationQueue.filter(n => n.id !== id);
		},

		setHiddenNotificationPreview(payload) {
			this.hiddenNotificationPreview = payload;
		},

		setUnreadData(payload) {
			this.unreadData = payload || {
				messages: 0,
				pending_booking: 0,
				notifications: 0,
				schedule: 0,
				recheduled_bookings: 0,
			};
		},
	},
});


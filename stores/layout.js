import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
	state: () => ({
		hiddenFooter: false,
	}),

	getters: {
		isFooterHidden: (state) => state.hiddenFooter,
	},

	actions: {
		setHiddenFooter(payload) {
			this.hiddenFooter = payload;
		},
	},
});

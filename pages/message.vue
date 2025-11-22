<template>
	<base-loading v-if="isLoading" />

	<div class="chat-app">
		<!-- Sidebar -->
		<div class="sidebar" v-show="!isMobile || showSidebar">
			<div class="sidebar-header">
				<div class="sidebar-header_title">
					Tin nhắn
				</div>
				<div class="sidebar-header_action">
					<button class="btn-icon">
						<svg class="icon-md" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
							viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
							stroke-linecap="round" stroke-linejoin="round">
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
					</button>
					<button class="btn-icon">
						<svg class="icon-md" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
							viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
							stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="3"></circle>
							<path
								d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
							</path>
						</svg>
					</button>
				</div>
			</div>

			<div class="sidebar-navs">
				<button class="nav-pill" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">Tất
					cả</button>
				<button class="nav-pill" :class="{ active: activeTab === 'unread' }" @click="activeTab = 'unread'">Chưa
					đọc</button>
			</div>

			<div class="conversation-list">
				<div v-for="conv in filteredConversations" :key="conv.id"
					:class="['conversation-item', { selected: selectedConversation && selectedConversation.id === conv.id }]"
					@click="selectConversation(conv)">
					<div class="avatar-container">
						<template v-if="conv.type === 'private'">
							<img v-if="conv.avatar" :src="conv.avatar" class="avatar" />
							<div v-else class="avatar">
								{{ getFirstCharacterOfLastName(conv.name) }}
							</div>
							<div v-if="conv.is_online" class="online-indicator"></div>
						</template>
						<template v-else>
							<div class="avatar group-avatar">
								<svg class="icon-md" viewBox="0 0 24 24" fill="currentColor"
									xmlns="http://www.w3.org/2000/svg">
									<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
									<circle cx="9" cy="7" r="4"></circle>
									<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
									<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
								</svg>
							</div>
						</template>
					</div>
					<div class="conv-info">
						<div class="conv-header">
							<span class="conv-name">{{ conv.name }}</span>
							<span class="conv-date">{{ conv.last_message ?
								formatRelativeTime(conv.last_message.created_at) : ''
							}}</span>
						</div>
						<div class="conv-preview">
							<span class="conv-last-msg">{{ conv.last_message?.content || 'Chưa có tin nhắn' }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Chat Main Area -->
		<div class="chat-main" v-show="!isMobile || !showSidebar">
			<template v-if="selectedConversation">
				<div class="chat-header">
					<div class="header-left">
						<button v-if="isMobile" class="btn-back" @click="backToSidebar">
							<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
								stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
								<path d="M15 18l-6-6 6-6" />
							</svg>
						</button>
						<div class="header-avatar-wrapper">
							<img v-if="selectedConversation.avatar" :src="selectedConversation.avatar"
								class="header-avatar" />
							<div v-else class="header-avatar">
								{{ getFirstCharacterOfLastName(selectedConversation.name) }}
							</div>
						</div>
						<div class="header-details">
							<div class="header-name">{{ selectedConversation.name }}</div>
						</div>
					</div>
				</div>

				<div class="message-list">
					<div class="message-container">
						<template v-for="item in groupedMessages" :key="item.id">
							<!-- Date Separator -->
							<div v-if="item.type === 'date'" class="date-separator">
								<span>{{ formatTime(item.content) }}</span>
							</div>

							<!-- Message Bubble -->
							<div v-else class="message-row" :class="{ me: item.data.is_sent }">
								<div class="message-wrapper">
									<div class="message-meta" v-if="!item.data.is_sent">
										<span class="msg-sender-name">{{ selectedConversation.name }}</span>
										<span class="msg-time">{{ formatTime(item.data.created_at) }}</span>
									</div>
									<div class="msg-bubble">
										<div class="msg-content">{{ item.data.content }}</div>
									</div>
									<div class="message-meta-me" v-if="item.data.is_sent">
										<span class="msg-time">{{ formatTime(item.data.created_at) }}</span>
									</div>
								</div>
							</div>
						</template>
					</div>
				</div>

				<div class="message-input-area">
					<div class="input-wrapper">
						<button class="btn-attach">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
								fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
								stroke-linejoin="round">
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
								<circle cx="8.5" cy="8.5" r="1.5"></circle>
								<polyline points="21 15 16 10 5 21"></polyline>
							</svg>
						</button>
						<input type="text" v-model="newMessage" @keyup.enter="sendMessage"
							placeholder="Soạn tin nhắn..." />
						<button class="btn-send" @click="sendMessage" v-if="newMessage.trim()">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
								fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
								stroke-linejoin="round">
								<line x1="12" y1="19" x2="12" y2="5"></line>
								<polyline points="5 12 12 5 19 12"></polyline>
							</svg>
						</button>
					</div>
				</div>
			</template>
			<div v-else class="empty-state">
				<div class="empty-content">
					<h3>Chọn một cuộc trò chuyện</h3>
					<p>Bắt đầu trò chuyện với gia sư hoặc học viên của bạn</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
// Auto-imported: ref, computed, onMounted, onUnmounted, watch

definePageMeta({
	layout: 'default',
	middleware: 'auth'
});

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const layoutStore = useLayoutStore();
const { api } = useApi();
const { getFirstCharacterOfLastName, formatRelativeTime, formatTime } = useHelper();

const search = ref('');
const conversations = ref([]);
const selectedConversation = ref(null);
const newMessage = ref('');
const currentUserUid = ref(userStore.getUserData?.uid || '');
const isLoading = ref(false);

// Mobile sidebar/chat detail state
const showSidebar = ref(false);
const isMobile = ref(false);

// const = (dateString) => {
// 	const date = new Date(dateString);
// 	const today = new Date();
// 	const yesterday = new Date(today);
// 	yesterday.setDate(yesterday.getDate() - 1);

// 	if (date.toDateString() === today.toDateString()) {
// 		return 'Hôm nay';
// 	} else if (date.toDateString() === yesterday.toDateString()) {
// 		return 'Hôm qua';
// 	} else {
// 		// Format: Thứ Hai, 20/11
// 		const options = { weekday: 'long', day: 'numeric', month: 'numeric' };
// 		return date.toLocaleDateString('vi-VN', options);
// 	}
// };

const groupedMessages = computed(() => {
	if (!selectedConversation.value?.messages) return [];

	const groups = [];
	let lastDate = null;

	selectedConversation.value.messages.forEach(msg => {
		const date = new Date(msg.created_at).toDateString();
		if (date !== lastDate) {
			groups.push({ type: 'date', content: msg.created_at, id: `date-${date}` });
			lastDate = date;
		}
		groups.push({ type: 'message', data: msg, id: msg.id });
	});

	return groups;
});

function handleResize() {
	if (process.client) {
		isMobile.value = window.innerWidth <= 1024;
		if (isMobile.value) {
			// Nếu đang ở mobile, mặc định chỉ hiện sidebar
			if (!showSidebar.value && !selectedConversation.value) {
				showSidebar.value = true;
			}
		} else {
			// Desktop: luôn hiện cả 2
			showSidebar.value = false;
		}
	}
}

const activeTab = ref('all'); // 'all' | 'unread'

const filteredConversations = computed(() => {
	let result = conversations.value;

	// Filter by tab
	if (activeTab.value === 'unread') {
		result = result.filter(c => c.unread_count > 0);
	}

	// Filter by search
	if (search.value) {
		result = result.filter(c => c.name.toLowerCase().includes(search.value.toLowerCase()));
	}

	return result;
});

function selectConversation(conv) {
	selectedConversation.value = conversations.value.find(c => c.id === conv.id);

	if (isMobile.value) {
		showSidebar.value = false;
	}
}

function backToSidebar() {
	selectedConversation.value = null;
	if (isMobile.value) {
		showSidebar.value = true;
	}
}

const sendMessage = async () => {
	if (!newMessage.value.trim() || !selectedConversation.value) return;

	// Chỉ private chat mới có receiver_id
	if (selectedConversation.value.type !== 'private') {
		return;
	}

	try {
		// Gửi tin nhắn qua API
		const response = await api.apiPost('send-message', {
			receiver_id: selectedConversation.value.other_user.uid,
			content: newMessage.value,
		});
		const msg = response.message;

		const conv = conversations.value.find(c => c.id === selectedConversation.value.id);
		if (conv) {
			conv.messages.push({
				...msg,
				is_sent: true,
			});
			conv.last_message = msg;
		}

		newMessage.value = '';
	} catch (e) {
		console.error('Send message error:', e);
	}
};

const listenForMessages = () => {
	if (!process.client) return;

	const channelName = `chat.${currentUserUid.value}`;

	if (window.Echo) {
		window.Echo.private(channelName)
			.listen('.message.sent', (e) => {
				// Tìm conversation theo conversation_id hoặc sender_id (cho private chat)
				const updateConversations = conversations.value.find(c => {
					// Nếu có conversation_id trong event, dùng nó
					if (e.conversation_id) {
						return c.id === e.conversation_id;
					}
					// Fallback: tìm theo sender_id cho private chat
					return c.type === 'private' && c.other_user?.uid === e.sender_id;
				});

				if (updateConversations) {
					updateConversations.messages.push({
						...e.message,
						is_sent: false,
					});

					// Update last message
					if (e.last_message) {
						updateConversations.last_message = e.last_message;
					}
				}
			});
	}
};

const listenForPresence = () => {
	if (!process.client) return;

	if (window.Echo) {
		window.Echo.join('chat.presence')
			.here((users) => {
				updateOnlineStatus(users);
			})
			.joining((user) => {
				console.log('User joined:', user);
				updateUserOnlineStatus(user.id, true);
			})
			.leaving((user) => {
				console.log('User left:', user);
				updateUserOnlineStatus(user.id, false);
			});
	}
};

const updateOnlineStatus = (users) => {
	// Update online status for all users in the channel
	users.forEach(user => {
		updateUserOnlineStatus(user.id, true);
	});
};

const updateUserOnlineStatus = (userId, is_online) => {
	// Update the selected conversation's online status (only for private chat)
	if (selectedConversation.value &&
		selectedConversation.value.type === 'private' &&
		selectedConversation.value.other_user?.uid == userId) {
		selectedConversation.value.is_online = is_online;
	}

	// Update conversation list online status (only for private chat)
	const conversation = conversations.value.find(c =>
		c.type === 'private' && c.other_user?.uid == userId
	);
	if (conversation) {
		conversation.is_online = is_online;
	}
};

const getAllContactedUsers = async () => {
	isLoading.value = true;
	try {
		const response = await api.apiGet('contacted-users');
		conversations.value = (response.data || []).map(conv => {
			// Xử lý theo type của conversation
			if (conv.type === 'private') {
				return {
					...conv,
					name: conv.other_user?.full_name,
					avatar: conv.other_user?.avatar,
					archived: false,
				};
			} else if (conv.type === 'group') {
				return {
					...conv,
					name: conv.name,
					avatar: null,
					archived: false,
				};
			}
			return conv;
		});

		if (conversations.value.length > 0) {
			selectConversation(conversations.value[0]);
		}
	} catch (e) {
		console.error('Get all contacted users error:', e);
	} finally {
		isLoading.value = false;
	}
};

onMounted(async () => {
	if (process.client) {
		// Initialize mobile state
		isMobile.value = window.innerWidth <= 1024;
		showSidebar.value = isMobile.value;

		// Add resize listener
		window.addEventListener('resize', handleResize);
	}

	await getAllContactedUsers();

	// Start listening for presence events
	listenForPresence();
	listenForMessages();

	notificationStore.setHiddenNotificationPreview(true);
	layoutStore.setHiddenFooter(true);
});

onUnmounted(() => {
	if (process.client) {
		window.removeEventListener('resize', handleResize);
	}
	notificationStore.setHiddenNotificationPreview(false);
	layoutStore.setHiddenFooter(false);
});
</script>

<style scoped>
.chat-app {
	display: flex;
	height: calc(100vh - (var(--height-header) + 1px));
	position: relative;
	overflow: hidden;
	background: white;
	font-family: 'Inter', sans-serif;
}

/* Sidebar */
.sidebar {
	width: 400px;
	background: white;
	border-right: 1px solid #ebebeb;
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 2;
}

.sidebar-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.5rem 1.5rem 1rem;
}

.sidebar-header_title {
	font-size: 1.5rem;
	font-weight: 700;
	color: #222;
}

.sidebar-header_action {
	display: flex;
	gap: 0.5rem;
}

.btn-icon {
	background: #f7f7f7;
	border: none;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: #222;
	transition: background 0.2s;
}

.btn-icon:hover {
	background: #e5e5e5;
}

.sidebar-navs {
	display: flex;
	gap: 0.5rem;
	padding: 0 1.5rem 1rem;
}

.nav-pill {
	padding: 0.5rem 1rem;
	border-radius: 20px;
	border: 1px solid transparent;
	background: transparent;
	font-size: 0.9rem;
	font-weight: 600;
	color: #717171;
	cursor: pointer;
	transition: all 0.2s;
}

.nav-pill.active {
	background: #222;
	color: white;
}

.nav-pill:hover:not(.active) {
	background: #f7f7f7;
}

.sidebar-search {
	padding: 0 1.5rem 1rem;
}

.conversation-list {
	flex: 1;
	overflow-y: auto;
	padding: 0 0.5rem;
}

.conversation-item {
	display: flex;
	gap: 1rem;
	padding: 1rem;
	margin: 0 0.5rem;
	border-radius: 12px;
	cursor: pointer;
	transition: background 0.2s;
}

.conversation-item:hover {
	background: #f7f7f7;
}

.conversation-item.selected {
	background: #f0f0f0;
}

.avatar-container {
	position: relative;
	flex-shrink: 0;
}

.avatar {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	object-fit: cover;
	background: #e5e5e5;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.2rem;
	font-weight: 600;
	color: #717171;
}

.group-avatar {
	background: #222;
	color: white;
}

.online-indicator {
	position: absolute;
	bottom: 2px;
	right: 2px;
	width: 12px;
	height: 12px;
	background: #10b981;
	border-radius: 50%;
	border: 2px solid white;
}

.conv-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-width: 0;
}

.conv-header {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	margin-bottom: 0.25rem;
}

.conv-name {
	font-weight: 600;
	color: #222;
	font-size: 1rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.conv-date {
	font-size: 0.75rem;
	color: #717171;
	flex-shrink: 0;
	margin-left: 0.5rem;
}

.conv-preview {
	display: flex;
	align-items: center;
}

.conv-last-msg {
	color: #717171;
	font-size: 0.9rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.conv-subtitle {
	font-size: 0.75rem;
	color: #717171;
	margin-top: 0.25rem;
}

/* Chat Main */
.chat-main {
	flex: 1;
	display: flex;
	flex-direction: column;
	background: white;
	position: relative;
	z-index: 1;
}

.chat-header {
	height: 80px;
	padding: 0 2rem;
	display: flex;
	align-items: center;
	border-bottom: 1px solid #ebebeb;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.header-avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	object-fit: cover;
	background: #e5e5e5;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	color: #717171;
}

.header-name {
	font-weight: 600;
	font-size: 1.1rem;
	color: #222;
}

/* Message List */
.message-list {
	flex: 1;
	overflow-y: auto;
	padding: 2rem;
	display: flex;
	flex-direction: column;
}

.message-container {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.date-separator {
	display: flex;
	justify-content: center;
	margin: 1rem 0;
}

.date-separator span {
	font-size: 0.75rem;
	font-weight: 700;
	color: #222;
}

.message-row {
	display: flex;
	width: 100%;

}

.message-row.me {
	justify-content: flex-end;
}

.message-wrapper {
	max-width: 70%;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.message-meta {
	display: flex;
	align-items: baseline;
	gap: 0.5rem;
	font-size: 0.75rem;
	margin-bottom: 0.25rem;
}

.msg-sender-name {
	font-weight: 700;
	color: #222;
}

.msg-sender-role {
	color: #717171;
}

.msg-time {
	color: #717171;
}

.message-meta-me {
	text-align: right;
	font-size: 0.75rem;
	color: #717171;
	margin-top: 0.25rem;
}

.message-row .msg-bubble {
	background: #f0f0f0;
	padding: 1rem;
	border-radius: 0.8rem 0.8rem 0.8rem 0rem;
}

.message-row.me .msg-bubble {
	background: #f0f0f0;
	padding: 1rem;
	border-radius: 0.8rem 0.8rem 0rem 0.8rem;
}

.msg-content {
	font-size: 1rem;
	line-height: 1.5;
	color: #222;
	white-space: pre-wrap;
}

/* Input Area */
.message-input-area {
	padding: 1.5rem 2rem;
	background: white;
}

.input-wrapper {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	border: 1px solid #b0b0b0;
	border-radius: 24px;
	padding: 0.5rem 1rem;
	transition: border-color 0.2s;
}

.input-wrapper:focus-within {
	border-color: #222;
	box-shadow: 0 0 0 1px #222;
}

.input-wrapper input {
	flex: 1;
	border: none;
	outline: none;
	font-size: 1rem;
	padding: 0.5rem;
	background: transparent;
}

.btn-attach,
.btn-send {
	background: transparent;
	border: none;
	padding: 0.5rem;
	cursor: pointer;
	color: #222;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
}

.btn-attach:hover,
.btn-send:hover {
	background: #f7f7f7;
}

.btn-send {
	background: #222;
	color: white;
}

.btn-send:hover {
	background: black;
}

/* Empty State */
.empty-state {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #717171;
}

.empty-content {
	text-align: center;
}

.empty-content h3 {
	font-size: 1.2rem;
	font-weight: 600;
	color: #222;
	margin-bottom: 0.5rem;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
	.sidebar {
		width: 100%;
		border-right: none;
	}

	.chat-main {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
	}

	.btn-back {
		background: transparent;
		border: none;
		padding: 0.5rem;
		margin-right: 0.5rem;
		cursor: pointer;
	}
}
</style>

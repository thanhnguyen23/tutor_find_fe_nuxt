<template>
	<div class="profile-editor-page">
		<div class="container">
			<div class="profile-grid">
				<!-- Left Column: Avatar -->
				<div class="left-col">
					<div class="avatar-wrapper">
						<div class="avatar-circle"
							:style="{ backgroundImage: `url(${profileData.avatar || '/images/default-avatar.png'})` }">
							<span v-if="!profileData.avatar" class="avatar-placeholder">{{ initials }}</span>
						</div>
						<button class="btn-add-photo" @click="triggerFileInput">
							<i class="fas fa-camera"></i> Thêm
						</button>
						<input type="file" ref="fileInput" class="hidden" @change="handleAvatarChange" accept="image/*">
					</div>
				</div>

				<!-- Right Column: Details -->
				<div class="right-col">
					<h1 class="page-title">Hồ sơ của tôi</h1>
					<p class="page-subtitle">Quản lý thông tin hồ sơ của bạn để học viên có thể hiểu rõ hơn về bạn.</p>

					<div class="sections-list">
						<!-- Personal Info -->
						<div class="section-item" @click="openModal('personal')">
							<div class="section-icon"><i class="fas fa-user"></i></div>
							<div class="section-content">
								<div class="section-label">Thông tin cá nhân</div>
								<div class="section-value">{{ personalInfoSummary }}</div>
							</div>
							<div class="section-arrow"><i class="fas fa-chevron-right"></i></div>
						</div>

						<!-- Education -->
						<div class="section-item" @click="openModal('education')">
							<div class="section-icon"><i class="fas fa-graduation-cap"></i></div>
							<div class="section-content">
								<div class="section-label">Học vấn</div>
								<div class="section-value">{{ educationSummary }}</div>
							</div>
							<div class="section-arrow"><i class="fas fa-chevron-right"></i></div>
						</div>

						<!-- Experience -->
						<div class="section-item" @click="openModal('experience')">
							<div class="section-icon"><i class="fas fa-briefcase"></i></div>
							<div class="section-content">
								<div class="section-label">Kinh nghiệm</div>
								<div class="section-value">{{ experienceSummary }}</div>
							</div>
							<div class="section-arrow"><i class="fas fa-chevron-right"></i></div>
						</div>

						<!-- Subjects -->
						<div class="section-item" @click="openModal('subjects')">
							<div class="section-icon"><i class="fas fa-book"></i></div>
							<div class="section-content">
								<div class="section-label">Môn học giảng dạy</div>
								<div class="section-value">{{ subjectsSummary }}</div>
							</div>
							<div class="section-arrow"><i class="fas fa-chevron-right"></i></div>
						</div>

						<!-- Languages -->
						<div class="section-item" @click="openModal('languages')">
							<div class="section-icon"><i class="fas fa-language"></i></div>
							<div class="section-content">
								<div class="section-label">Ngôn ngữ</div>
								<div class="section-value">{{ languagesSummary }}</div>
							</div>
							<div class="section-arrow"><i class="fas fa-chevron-right"></i></div>
						</div>

						<!-- Schedule -->
						<div class="section-item" @click="openModal('schedule')">
							<div class="section-icon"><i class="far fa-calendar-alt"></i></div>
							<div class="section-content">
								<div class="section-label">Lịch trình hàng tuần</div>
								<div class="section-value">{{ scheduleSummary }}</div>
							</div>
							<div class="section-arrow"><i class="fas fa-chevron-right"></i></div>
						</div>
					</div>

					<!-- About Me Section -->
					<div class="about-me-section">
						<h3>Giới thiệu bản thân</h3>
						<div class="about-me-preview">
							{{ profileData.bio || 'Viết nội dung thú vị và ấn tượng...' }}
						</div>
						<button class="btn-link" @click="openModal('personal')">Chỉnh sửa giới thiệu</button>
					</div>

					<div class="page-actions">
						<button class="btn-lg btn-black" @click="submitProfile">Hoàn tất hồ sơ</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Modals -->
		<!-- Personal Info Modal -->
		<BaseModal :is-open="activeModal === 'personal'" title="Thông tin cá nhân" description="Cập nhật thông tin cơ bản của bạn để học viên dễ dàng nhận diện." @close="closeModal">
			<div class="modal-form">
				<div class="row-2">
					<base-input v-model="profileData.firstName" label="Tên" placeholder="Nhập tên" />
					<base-input v-model="profileData.lastName" label="Họ" placeholder="Nhập họ" />
				</div>
				<base-input v-model="profileData.headline" label="Tiêu đề hồ sơ"
					placeholder="VD: Gia sư Tiếng Anh IELTS 8.0" />
				<base-input v-model="profileData.bio" type="textarea" label="Giới thiệu bản thân" :rows="5"
					placeholder="Chia sẻ về kinh nghiệm và phương pháp giảng dạy..." />
				<div class="row-2">
					<base-input v-model="profileData.phone" label="Số điện thoại" placeholder="Nhập số điện thoại" />
					<base-input v-model="profileData.address" label="Địa chỉ" placeholder="Quận/Huyện, Thành phố" />
				</div>
				<div class="modal-footer">
					<button class="btn-lg btn-black" @click="savePersonal">Lưu</button>
				</div>
			</div>
		</BaseModal>

		<!-- Education Modal -->
		<BaseModal :is-open="activeModal === 'education'" title="Học vấn" description="Thêm thông tin về quá trình học tập và bằng cấp của bạn." @close="closeModal" size="large">
			<div class="modal-list-view" v-if="!isEditingItem">
				<div v-if="profileData.education.length === 0" class="empty-state">
					Chưa có thông tin học vấn.
				</div>
				<div v-else class="item-list">
					<div v-for="(edu, index) in profileData.education" :key="index" class="list-card">
						<div class="list-card-content">
							<h4>{{ edu.school }}</h4>
							<p>{{ edu.degree }} - {{ edu.field }}</p>
							<span class="meta">{{ edu.startYear }} - {{ edu.endYear }}</span>
						</div>
						<div class="list-card-actions">
							<button class="btn-icon" @click="editItem('education', index)"><i
									class="fas fa-pen"></i></button>
							<button class="btn-icon text-red" @click="deleteItem('education', index)"><i
									class="fas fa-trash"></i></button>
						</div>
					</div>
				</div>
				<div class="add-btn-wrapper">
					<button class="btn-link" @click="startAddItem('education')">+ Thêm học vấn</button>
				</div>
			</div>
			<div class="modal-form" v-else>
				<base-input v-model="tempItem.school" label="Trường học" placeholder="VD: Đại học Bách Khoa" />
				<base-input v-model="tempItem.degree" label="Bằng cấp" placeholder="VD: Cử nhân" />
				<base-input v-model="tempItem.field" label="Chuyên ngành" placeholder="VD: Công nghệ thông tin" />
				<div class="row-2">
					<base-input v-model="tempItem.startYear" label="Năm bắt đầu" type="number" />
					<base-input v-model="tempItem.endYear" label="Năm kết thúc" type="number" />
				</div>
				<div class="modal-footer">
					<button class="btn-md btn-white" @click="cancelEdit">Hủy</button>
					<button class="btn-md btn-black" @click="saveItem('education')">Lưu</button>
				</div>
			</div>
		</BaseModal>

		<!-- Experience Modal -->
		<BaseModal :is-open="activeModal === 'experience'" title="Kinh nghiệm" description="Chia sẻ kinh nghiệm giảng dạy hoặc làm việc liên quan." @close="closeModal" size="large">
			<div class="modal-list-view" v-if="!isEditingItem">
				<div v-if="profileData.experience.length === 0" class="empty-state">
					Chưa có kinh nghiệm làm việc.
				</div>
				<div v-else class="item-list">
					<div v-for="(exp, index) in profileData.experience" :key="index" class="list-card">
						<div class="list-card-content">
							<h4>{{ exp.position }}</h4>
							<p>{{ exp.company }}</p>
							<span class="meta">{{ exp.startDate }} - {{ exp.endDate }}</span>
						</div>
						<div class="list-card-actions">
							<button class="btn-icon" @click="editItem('experience', index)"><i
									class="fas fa-pen"></i></button>
							<button class="btn-icon text-red" @click="deleteItem('experience', index)"><i
									class="fas fa-trash"></i></button>
						</div>
					</div>
				</div>
				<div class="add-btn-wrapper">
					<button class="btn-link" @click="startAddItem('experience')">+ Thêm kinh nghiệm</button>
				</div>
			</div>
			<div class="modal-form" v-else>
				<base-input v-model="tempItem.position" label="Chức vụ" placeholder="VD: Gia sư Toán" />
				<base-input v-model="tempItem.company" label="Nơi làm việc" placeholder="VD: Trung tâm ABC" />
				<div class="row-2">
					<base-input v-model="tempItem.startDate" label="Từ tháng/năm" placeholder="01/2020" />
					<base-input v-model="tempItem.endDate" label="Đến tháng/năm" placeholder="Hiện tại" />
				</div>
				<base-input v-model="tempItem.description" type="textarea" label="Mô tả" :rows="3" />
				<div class="modal-footer">
					<button class="btn-md btn-white" @click="cancelEdit">Hủy</button>
					<button class="btn-md btn-black" @click="saveItem('experience')">Lưu</button>
				</div>
			</div>
		</BaseModal>

		<!-- Subjects Modal -->
		<BaseModal :is-open="activeModal === 'subjects'" title="Môn học giảng dạy" description="Liệt kê các môn học bạn có thể giảng dạy cùng với mức học phí." @close="closeModal" size="large">
			<div class="modal-list-view" v-if="!isEditingItem">
				<div v-if="profileData.subjects.length === 0" class="empty-state">
					Chưa có môn học nào.
				</div>
				<div v-else class="item-list">
					<div v-for="(subj, index) in profileData.subjects" :key="index" class="list-card">
						<div class="list-card-content">
							<h4>{{ subj.name }}</h4>
							<p>{{ getLevelName(subj.level) }} - {{ formatCurrency(subj.price) }}/giờ</p>
						</div>
						<div class="list-card-actions">
							<button class="btn-icon" @click="editItem('subjects', index)"><i
									class="fas fa-pen"></i></button>
							<button class="btn-icon text-red" @click="deleteItem('subjects', index)"><i
									class="fas fa-trash"></i></button>
						</div>
					</div>
				</div>
				<div class="add-btn-wrapper">
					<button class="btn-link" @click="startAddItem('subjects')">+ Thêm môn học</button>
				</div>
			</div>
			<div class="modal-form" v-else>
				<base-input v-model="tempItem.name" label="Tên môn học" placeholder="VD: Toán lớp 10" />
				<div class="row-2">
					<div class="form-group">
						<label class="form-label">Trình độ</label>
						<select v-model="tempItem.level" class="form-control">
							<option v-for="opt in levelOptions" :key="opt.value" :value="opt.value">{{ opt.name }}
							</option>
						</select>
					</div>
					<base-input v-model="tempItem.price" label="Học phí (VNĐ/giờ)" type="number" />
				</div>
				<div class="modal-footer">
					<button class="btn-md btn-white" @click="cancelEdit">Hủy</button>
					<button class="btn-md btn-black" @click="saveItem('subjects')">Lưu</button>
				</div>
			</div>
		</BaseModal>

		<!-- Languages Modal -->
		<BaseModal :is-open="activeModal === 'languages'" title="Ngôn ngữ" description="Chọn các ngôn ngữ bạn có thể sử dụng để giảng dạy." @close="closeModal" size="medium">
			<div class="languages-grid">
				<div v-for="lang in availableLanguages" :key="lang.id" class="language-card"
					:class="{ selected: profileData.languages.includes(lang.id) }" @click="toggleLanguage(lang.id)">
					<span class="lang-name">{{ lang.name }}</span>
					<div class="check-icon" v-if="profileData.languages.includes(lang.id)">
						<i class="fas fa-check"></i>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn-lg btn-black" @click="closeModal">Xong</button>
			</div>
		</BaseModal>

		<!-- Schedule Modal -->
		<BaseModal :is-open="activeModal === 'schedule'" title="Lịch trình hàng tuần" description="Thiết lập thời gian rảnh của bạn để học viên có thể đặt lịch." @close="closeModal" size="xl">
			<div class="schedule-container">
				<div class="schedule-header">
					<div class="time-col-header"></div>
					<div v-for="day in daysOfWeek" :key="day.id" class="day-col-header">{{ day.name }}</div>
				</div>
				<div class="schedule-body">
					<div v-for="slot in timeSlots" :key="slot.id" class="schedule-row">
						<div class="time-label">{{ slot.name }}</div>
						<div v-for="day in daysOfWeek" :key="day.id" class="slot-cell"
							:class="{ active: isSlotSelected(day.id, slot.id) }" @click="toggleSlot(day.id, slot.id)">
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn-lg btn-black" @click="closeModal">Lưu lịch trình</button>
			</div>
		</BaseModal>

	</div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import BaseModal from '~/components/common/BaseModal.vue';
import BaseInput from '~/components/common/BaseInput.vue';

definePageMeta({
	layout: 'default', // Or 'empty' if you want to build the header yourself
});

// State
const activeModal = ref(null);
const fileInput = ref(null);
const isEditingItem = ref(false);
const editingIndex = ref(-1);
const tempItem = ref({});

const profileData = reactive({
	avatar: null,
	firstName: 'Thanh',
	lastName: 'Nguyen',
	headline: 'Gia sư Công nghệ thông tin',
	bio: 'Tôi là một gia sư nhiệt huyết với 5 năm kinh nghiệm...',
	phone: '0123456789',
	address: 'Hà Nội, Việt Nam',
	education: [
		{ school: 'FPT University', degree: 'Cử nhân', field: 'Kỹ thuật phần mềm', startYear: '2018', endYear: '2022' }
	],
	experience: [],
	subjects: [
		{ name: 'Lập trình Web', level: 'university', price: '300000' }
	],
	languages: ['vi', 'en'],
	schedule: []
});

// Options
const levelOptions = [
	{ value: 'primary', name: 'Tiểu học' },
	{ value: 'secondary', name: 'Trung học cơ sở' },
	{ value: 'highschool', name: 'Trung học phổ thông' },
	{ value: 'university', name: 'Đại học' },
	{ value: 'other', name: 'Khác' },
];

const availableLanguages = [
	{ id: 'vi', name: 'Tiếng Việt' },
	{ id: 'en', name: 'Tiếng Anh' },
	{ id: 'fr', name: 'Tiếng Pháp' },
	{ id: 'zh', name: 'Tiếng Trung' },
	{ id: 'jp', name: 'Tiếng Nhật' },
	{ id: 'kr', name: 'Tiếng Hàn' },
];

const daysOfWeek = [
	{ id: 'mon', name: 'T2' },
	{ id: 'tue', name: 'T3' },
	{ id: 'wed', name: 'T4' },
	{ id: 'thu', name: 'T5' },
	{ id: 'fri', name: 'T6' },
	{ id: 'sat', name: 'T7' },
	{ id: 'sun', name: 'CN' },
];

const timeSlots = Array.from({ length: 15 }, (_, i) => {
	const hour = i + 7; // 7:00 to 21:00
	return { id: `${hour}`, name: `${hour}:00` };
});

// Computed Summaries
const initials = computed(() => {
	const f = profileData.firstName ? profileData.firstName[0] : '';
	const l = profileData.lastName ? profileData.lastName[0] : '';
	return (l + f).toUpperCase();
});

const personalInfoSummary = computed(() => {
	return `${profileData.lastName} ${profileData.firstName}`;
});

const educationSummary = computed(() => {
	if (profileData.education.length === 0) return 'Chưa có thông tin';
	return profileData.education[0].school;
});

const experienceSummary = computed(() => {
	if (profileData.experience.length === 0) return 'Chưa có thông tin';
	return profileData.experience[0].position;
});

const subjectsSummary = computed(() => {
	if (profileData.subjects.length === 0) return 'Chưa có môn học';
	return profileData.subjects.map(s => s.name).join(', ');
});

const languagesSummary = computed(() => {
	if (profileData.languages.length === 0) return 'Chưa chọn ngôn ngữ';
	return profileData.languages.map(l => availableLanguages.find(al => al.id === l)?.name).join(', ');
});

const scheduleSummary = computed(() => {
	if (profileData.schedule.length === 0) return 'Chưa có lịch trình';
	return `${profileData.schedule.length} khung giờ đã chọn`;
});

// Methods
const openModal = (modalName) => {
	activeModal.value = modalName;
	isEditingItem.value = false;
	editingIndex.value = -1;
	tempItem.value = {};
};

const closeModal = () => {
	activeModal.value = null;
	isEditingItem.value = false;
};

const triggerFileInput = () => {
	fileInput.value.click();
};

const handleAvatarChange = (event) => {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			profileData.avatar = e.target.result;
		};
		reader.readAsDataURL(file);
	}
};

const savePersonal = () => {
	closeModal();
};

// Generic Item Methods (Education, Experience, Subjects)
const startAddItem = (type) => {
	isEditingItem.value = true;
	editingIndex.value = -1;
	// Initialize temp item based on type
	if (type === 'education') tempItem.value = { school: '', degree: '', field: '', startYear: '', endYear: '' };
	if (type === 'experience') tempItem.value = { position: '', company: '', startDate: '', endDate: '', description: '' };
	if (type === 'subjects') tempItem.value = { name: '', level: 'primary', price: '' };
};

const editItem = (type, index) => {
	isEditingItem.value = true;
	editingIndex.value = index;
	tempItem.value = { ...profileData[type][index] };
};

const saveItem = (type) => {
	if (editingIndex.value === -1) {
		profileData[type].push({ ...tempItem.value });
	} else {
		profileData[type][editingIndex.value] = { ...tempItem.value };
	}
	isEditingItem.value = false;
};

const deleteItem = (type, index) => {
	if (confirm('Bạn có chắc chắn muốn xóa?')) {
		profileData[type].splice(index, 1);
	}
};

const cancelEdit = () => {
	isEditingItem.value = false;
};

// Helpers
const getLevelName = (val) => levelOptions.find(o => o.value === val)?.name || val;
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN').format(val);

// Language Methods
const toggleLanguage = (id) => {
	const idx = profileData.languages.indexOf(id);
	if (idx === -1) profileData.languages.push(id);
	else profileData.languages.splice(idx, 1);
};

// Schedule Methods
const toggleSlot = (dayId, slotId) => {
	const idx = profileData.schedule.findIndex(s => s.day === dayId && s.slot === slotId);
	if (idx === -1) profileData.schedule.push({ day: dayId, slot: slotId });
	else profileData.schedule.splice(idx, 1);
};

const isSlotSelected = (dayId, slotId) => {
	return profileData.schedule.some(s => s.day === dayId && s.slot === slotId);
};

const submitProfile = () => {
	console.log('Submitting profile:', profileData);
	alert('Hồ sơ đã được lưu thành công!');
};

</script>

<style scoped>
.profile-editor-page {
	min-height: 100vh;
	background: #fff;
	padding: 2rem 0;
	font-family: 'Inter', sans-serif;
}

.profile-grid {
	display: grid;
	grid-template-columns: 300px 1fr;
	gap: 4rem;
}

/* Left Column */
.left-col {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.avatar-wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.avatar-circle {
	width: 240px;
	height: 240px;
	border-radius: 50%;
	background-color: #222;
	background-size: cover;
	background-position: center;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 4rem;
	font-weight: 600;
}

.btn-add-photo {
	background: white;
	border: 1px solid #ddd;
	padding: 0.5rem 1rem;
	border-radius: 20px;
	font-weight: 600;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	transition: all 0.2s;
}

.btn-add-photo:hover {
	background: #f7f7f7;
	transform: scale(1.05);
}

/* Form Elements */
.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.form-label {
	font-weight: 500;
	color: #1f2937;
	font-size: 0.9rem;
}

.form-control {
	width: 100%;
	padding: 0.75rem 1rem;
	border: 2px solid #e5e7eb;
	border-radius: 14px;
	font-weight: 500;
	font-family: "Inter", sans-serif;
	background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
	color: #374151;
	font-size: 0.9rem;
	line-height: 1.5;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	transition: all 0.2s;
	appearance: none;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right 1rem center;
	background-size: 1rem;
}

.form-control:focus {
	outline: none;
	border-color: #222;
	background-color: #ffffff;
}

.hidden {
	display: none;
}

/* Right Column */
.page-title {
	font-size: 2rem;
	font-weight: 800;
	margin-bottom: 0.5rem;
	color: #222;
}

.page-subtitle {
	color: #717171;
	margin-bottom: 2rem;
	font-size: 1rem;
}

.sections-list {
	display: flex;
	flex-direction: column;
	border-top: 1px solid #ebebeb;
}

.section-item {
	display: flex;
	align-items: center;
	padding: 1.5rem 0;
	border-bottom: 1px solid #ebebeb;
	cursor: pointer;
	transition: background 0.2s;
}

.section-item:hover {
	background: #f9f9f9;
	padding-left: 1rem;
	padding-right: 1rem;
	margin-left: -1rem;
	margin-right: -1rem;
	border-radius: 8px;
}

.section-icon {
	width: 40px;
	font-size: 1.2rem;
	color: #222;
}

.section-content {
	flex: 1;
}

.section-label {
	font-weight: 600;
	color: #222;
	margin-bottom: 0.25rem;
}

.section-value {
	color: #717171;
	font-size: 0.95rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 400px;
}

.section-arrow {
	color: #222;
}

/* About Me */
.about-me-section {
	margin-top: 3rem;
}

.about-me-section h3 {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 1rem;
}

.about-me-preview {
	color: #717171;
	line-height: 1.6;
	margin-bottom: 1rem;
	padding: 1.5rem;
	border: 1px dashed #ddd;
	border-radius: 8px;
}

.page-actions {
	margin-top: 3rem;
	display: flex;
	justify-content: flex-end;
	padding-top: 2rem;
	border-top: 1px solid #ebebeb;
}

/* Modal Styles */
.modal-form {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding: 1rem 0;
}

.row-2 {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

.modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 1rem;
	margin-top: 1rem;
	padding-top: 1rem;
	border-top: 1px solid #ebebeb;
}

/* List View in Modal */
.modal-list-view {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.empty-state {
	text-align: center;
	padding: 2rem;
	color: #717171;
	background: #f9f9f9;
	border-radius: 8px;
}

.list-card {
	border: 1px solid #ebebeb;
	border-radius: 12px;
	padding: 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.list-card-content h4 {
	font-weight: 700;
	margin-bottom: 0.25rem;
}

.list-card-content p {
	color: #4b5563;
	font-size: 0.9rem;
}

.list-card-content .meta {
	color: #9ca3af;
	font-size: 0.85rem;
}

.list-card-actions {
	display: flex;
	gap: 0.5rem;
}

.btn-icon {
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
	border-radius: 50%;
	transition: background 0.2s;
}

.btn-icon:hover {
	background: #f3f4f6;
}

.text-red {
	color: #ef4444;
}

.add-btn-wrapper {
	margin-top: 1rem;
}

/* Languages Grid */
.languages-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	gap: 1rem;
	padding: 1rem 0;
}

.language-card {
	border: 1px solid #ebebeb;
	border-radius: 8px;
	padding: 1rem;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	transition: all 0.2s;
}

.language-card:hover {
	border-color: #222;
}

.language-card.selected {
	background: #222;
	color: white;
	border-color: #222;
}

/* Schedule Grid */
.schedule-container {
	overflow-x: auto;
	padding-bottom: 1rem;
}

.schedule-header {
	display: grid;
	grid-template-columns: 80px repeat(7, 1fr);
	min-width: 600px;
	margin-bottom: 0.5rem;
}

.day-col-header {
	text-align: center;
	font-weight: 700;
}

.schedule-body {
	min-width: 600px;
	max-height: 50vh;
	overflow-y: auto;
}

.schedule-row {
	display: grid;
	grid-template-columns: 80px repeat(7, 1fr);
	border-bottom: 1px solid #f3f4f6;
}

.time-label {
	padding: 0.5rem;
	font-size: 0.85rem;
	color: #717171;
	border-right: 1px solid #f3f4f6;
	display: flex;
	align-items: center;
	justify-content: center;
}

.slot-cell {
	border-right: 1px solid #f3f4f6;
	height: 40px;
	cursor: pointer;
	transition: background 0.2s;
}

.slot-cell:hover {
	background: #f9f9f9;
}

.slot-cell.active {
	background: #222;
}

/* Responsive */
@media (max-width: 768px) {
	.profile-grid {
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.left-col {
		margin-bottom: 2rem;
	}

	.avatar-circle {
		width: 160px;
		height: 160px;
		font-size: 3rem;
	}

	.row-2 {
		grid-template-columns: 1fr;
	}
}
</style>

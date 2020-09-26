<template>
	<div>
		<h1>Dashboard</h1>
		<h3 v-if="!user">Getting user information</h3>
		<h3 v-if="user">Welcome {{ user.username }}</h3>
		<button
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 mb-5"
			@click="showForm = !showForm"
		>
			Add note
		</button>
		<div class="w-full max-w-lg mx-auto" v-if="showForm">
			<form
				@submit.prevent="addNote"
				class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
			>
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="note">
						Note Title
					</label>
					<input
						v-model="newNote.title"
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="note"
						type="text"
						aria-describedby="Enter note description"
						placeholder="Note Title"
						required
					/>
					<small class="text-muted form-text"
						>Enter a title for your note</small
					>
				</div>
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="note">
						Note Description
					</label>
					<textarea
						v-model="newNote.note"
						class="shadow border rounded w-full py-2 px-3 text-gray-700"
						id="note"
						rows="2"
						cols="20"
						wrap="hard"
						aria-describedby="Enter note description"
						placeholder="Note Description"
						required
					/>
					<small class="text-muted form-text"
						>Enter a description for your note</small
					>
				</div>
				<div class="flex items-center justify-between">
					<button
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Sign In
					</button>
					<a
						class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
						href="#"
					>
						Forgot Password?
					</a>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
const url = process.env.PORT || 'http://localhost:5000/'
const noteUrl = process.env.PORT || 'http://localhost:5000/api/v1/notes'

export default {
	data() {
		return {
			showForm: false,
			user: null,
			newNote: {
				title: '',
				note: '',
			},
		}
	},
	methods: {
		addNote() {
			this.$http({
				method: 'post',
				url: noteUrl,
				headers: {
					'content-type': 'application/json',
					authorization: `Bearer ${localStorage.token}`,
				},
				data: this.newNote,
			})
				.then(result => {
					console.log(result.data)
				})
				.catch(err => console.log(err))
		},
	},
	mounted() {
		this.$http({
			method: 'get',
			url: url,
			headers: {
				authorization: `Bearer ${localStorage.token}`,
			},
		})
			.then(result => {
				if (result.data.user) {
					console.log('result', result)
					this.user = result.data.user
				} else {
					console.log('old token')
					localStorage.token = ''
				}
			})
			.catch(err => {
				console.log(err)
			})
	},
}
</script>

<style>
.text-muted {
	color: #6c757d;
}
</style>

<template>
	<div>
		<h3>Dashboard</h3>
		<h5 v-if="!user">Getting user information</h5>
		<h5 v-if="user">Welcome {{ user.username }}</h5>
		<button
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 mb-5"
			@click="showForm = !showForm"
		>
			Add note
		</button>
		<button
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline  ml-3 mt-3 mb-5"
			@click="logout"
		>
			Logout
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
						>Enter a description for your note. <br />
						Notes support Markdown, HTML and emojis 😊 <br />
						<a href="https://www.markdownguide.org/basic-syntax/"
							>Mark Down Guide</a
						>
					</small>
				</div>
				<div class="flex items-center justify-between">
					<button
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Submit note
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
		<div class="text-center">
			<h4 class="mb-4">All Notes:</h4>
		</div>
		<div class="w-full max-w-lg mx-auto text-blue" v-if="notes.length">
			<div
				v-for="note in notes"
				:key="note.id"
				class="bg-yellow shadow-md rounded mb-5 px-8 pt-6 pb-8 text-left"
			>
				<h6>{{ note.title }}</h6>
				<p v-html="renderMarkDown(note.note)"></p>
			</div>
		</div>
	</div>
</template>

<script>
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt({
	html: true,
	// Linkify is a JavaScript plugin for finding
	// links in plain-text and converting them to HTML <a> tags.
	linkify: true,
})

import emoji from 'markdown-it-emoji'

md.use(emoji)

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
			notes: [],
		}
	},
	methods: {
		renderMarkDown(note) {
			return md.render(note)
		},
		authCheck() {
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
						setTimeout(() => {
							this.$router.push({path: '/dashboard'})
						}, 1000)
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		getAllNotes() {
			this.$http({
				method: 'get',
				url: noteUrl,
				headers: {
					'content-type': 'application/json',
					authorization: `Bearer ${localStorage.token}`,
				},
			})
				.then(result => {
					console.log(result.data)
					this.notes = result.data
				})
				.catch(err => console.log(err))
		},
		logout() {
			localStorage.token = ''
			this.$forceUpdate()
		},
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
					this.getAllNotes()
				})
				.catch(err => console.log(err))
		},
	},
	mounted() {
		this.authCheck()
		this.getAllNotes()
	},
}
</script>

<style>
h6 {
	font-weight: 100;
	font-family: 'Open Sans', sans-serif;
	margin-bottom: 10px;
}
p,
a {
	font-family: 'Handlee', cursive;
	font-weight: 700;
}
.text-blue h6,
.text-blue p {
	color: #2c3e50;
}
.text-muted {
	color: #6c757d;
}
.bg-yellow {
	background-color: #ffed98;
}
</style>

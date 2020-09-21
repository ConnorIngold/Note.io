<template>
	<div class="w-full max-w-md mx-auto">
		<h1>login</h1>
		<div v-if="errorMsg" class="flex items-center mb-4" role="alert">
			<div
				class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full"
				role="alert"
			>
				<strong class="font-bold w-full block"
					><small>{{ errorMsg }}:</small>
				</strong>
				<div class="danger">Username or password is incorrect</div>
			</div>
		</div>
		<form
			action="submit"
			class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
			@submit.prevent="login"
		>
			<label
				class="block text-gray-700 text-sm font-bold mb-2 mt-2"
				for="username"
				>Username</label
			>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				v-model="user.username"
				type="text"
				name="username"
				id="username"
			/>

			<label
				class="block text-gray-700 text-sm font-bold mb-2 mt-2"
				for="password"
				>Password</label
			>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				v-model="user.password"
				type="password"
				minlength="8"
				required
				name="password"
				id="password"
			/>
			<div class="flex items-center justify-between mt-5">
				<input
					type="submit"
					value="Submit"
					placeholder="Register"
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					v-if="signingUp === false"
				/>
				<div class="lds-grid" v-if="signingUp">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>

				<router-link
					class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
					to="/login"
					>Already Got An Account?</router-link
				>
			</div>
		</form>
	</div>
</template>

<script>
import Joi from '@hapi/joi'

const schema = Joi.object().keys({
	username: Joi.string()
		.regex(/(^[a-zA-Z0-9_]+$)/)
		.min(3)
		.max(30)
		.required(),
	password: Joi.string()
		.trim()
		.min(8)
		.required(),
})

const url = process.env.PORT || 'http://localhost:5000/auth/login'

export default {
	name: 'LoginForm',
	data: () => ({
		signingUp: false,
		errorMsg: '',
		user: {
			username: '',
			password: '',
		},
	}),
	watch: {
		user: {
			handler() {
				this.errorMsg = ''
			},
			deep: true,
		},
	},
	methods: {
		login() {
			this.errorMsg = ''
			console.log(this.user)
			if (this.validUser()) {
				console.log('logging in...')
				const body = {
					username: this.user.username,
					password: this.user.password,
				}
				this.$http({
					method: 'post',
					url: url,
					headers: {
						'content-type': 'application/json',
					},
					data: body,
				})
					.then(result => {
            this.signingUp = true
						// save the token to local storage
						localStorage.token = result.data.token

						// redirect after 1 secs
						// make looks like its doing something
						setTimeout(() => {
							// if login successful redirect
							this.$router.push('/dashboard')
						}, 1500)
					})
					.catch(err => (this.errorMsg = err.message))
			}
		},
		validUser() {
			const result = schema.validate(this.user)

			if (result.error === null) {
				return true
			}

			if (result.error.message.includes('username')) {
				this.errorMsg = 'User Cred is invalid 😭'
			} else {
				this.errorMsg = 'Password is invalid'
			}

			return false
		},
	},
}
</script>

<style lang="scss">
.lds-grid {
	display: inline-block;
	position: relative;
	width: 80px;
	height: 80px;
}
.lds-grid div {
	position: absolute;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: #4299e1;
	animation: lds-grid 1.2s linear infinite;
}
.lds-grid div:nth-child(1) {
	top: 8px;
	left: 8px;
	animation-delay: 0s;
}
.lds-grid div:nth-child(2) {
	top: 8px;
	left: 32px;
	animation-delay: -0.4s;
}
.lds-grid div:nth-child(3) {
	top: 8px;
	left: 56px;
	animation-delay: -0.8s;
}
.lds-grid div:nth-child(4) {
	top: 32px;
	left: 8px;
	animation-delay: -0.4s;
}
.lds-grid div:nth-child(5) {
	top: 32px;
	left: 32px;
	animation-delay: -0.8s;
}
.lds-grid div:nth-child(6) {
	top: 32px;
	left: 56px;
	animation-delay: -1.2s;
}
.lds-grid div:nth-child(7) {
	top: 56px;
	left: 8px;
	animation-delay: -0.8s;
}
.lds-grid div:nth-child(8) {
	top: 56px;
	left: 32px;
	animation-delay: -1.2s;
}
.lds-grid div:nth-child(9) {
	top: 56px;
	left: 56px;
	animation-delay: -1.6s;
}
@keyframes lds-grid {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}
</style>

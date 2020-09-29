<template>
	<div id="registerForm" class="w-full max-w-md mx-auto">
		<h2 class="h2 font-bold text-2xl mb-5">Register</h2>
		<form
			action="submit"
			class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
			@submit.prevent="signUp"
		>
			<div class="mb-4">
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
				<h5
					id="usernameHelp"
					class="form-text text-muted"
					v-if="errorMsg.length"
				>
					Username must be longer than 2 characters and shorter than 30.
					Username can only contain alphanumeric characters and under_scores.
				</h5>
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
				<h5
					id="passwordHelp"
					class="form-text text-muted"
					v-if="errorMsg.length"
				>
					Password must be 10 or more characters long.
				</h5>
				<label
					class="block text-gray-700 text-sm font-bold mb-2 mt-2"
					for="password2"
					>Confirm Password</label
				>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					v-model="user.password2"
					type="password"
					minlength="8"
					required
					name="password2"
					id="password2"
				/>
				<h5
					id="confirmPasswordHelp"
					class="form-text text-muted"
					v-if="errorMsg.length"
				>
					Please confirm your password.
				</h5>
			</div>
			<div v-if="errorMsg" class="flex items-center mb-4" role="alert">
				<div
					class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full"
					role="alert"
				>
					<strong class="font-bold w-full block"
						><small>{{ errorMsg }}</small>
					</strong>
					<div class="danger"></div>
				</div>
			</div>
			<div class="flex items-center justify-between">
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
	password2: Joi.string()
		.trim()
		.min(8)
		.required(),
})

const url = process.env.PORT || 'http://localhost:5000/auth/signup'

export default {
	name: 'RegisterForm',
	data: () => ({
		signingUp: false,
		errorMsg: '',
		user: {
			username: '',
			password: '',
			password2: '',
		},
	}),
	watch: {
		user: {
			// watchers accept methods as a string
			handler: 'clearErrorMsg',
			// deep true means:
			// anytime anything chnages inside
			// data run the function
			deep: true,
		},
	},
	methods: {
		clearErrorMsg() {
			this.errorMessage = ''
		},
		signUp() {
			this.errorMessage = ''
			if (this.validUser()) {
				// user is valid so add loader
				this.signingUp = true
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
						// redirect after 2 secs
						// make looks like its doing something
						localStorage.token = result.data.token
						console.log(result)
						setTimeout(() => {
							this.$router.push({path: '/dashboard'})
						}, 1000)
					})
					.catch(err => (this.errorMsg = err.message))
			}
		},
		validUser() {
			if (this.user.password !== this.user.password2) {
				this.errorMsg = 'Passwords do not match'
				return false
			}

			const result = schema.validate(this.user)
			if (result.error === null) {
				return true
			}
			if (result.error.message.includes('username')) {
				this.errorMsg = 'User is invalid 😭'
			} else {
				this.errorMsg = 'Password is invalid'
			}
			// if you return true the rest of the code
			return false
		},
	},
}
// Computer11!
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

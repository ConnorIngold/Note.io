<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">Home</router-link>
			<router-link to="/about">About</router-link>
			<router-link to="/register">Register</router-link>
			<router-link to="/login">Login</router-link>
			<button class="ml-5 btn" @click="darkThemeSwitch">Switch Theme</button>
		</div>
		<router-view />
	</div>
</template>

<script>
export default {
	methods: {
		_addDarkTheme() {
			let darkThemeLinkEl = document.createElement('link')
			darkThemeLinkEl.setAttribute('rel', 'stylesheet')
			darkThemeLinkEl.setAttribute('href', '/css/darktheme.css')
			darkThemeLinkEl.setAttribute('id', 'dark-theme-style')

			let docHead = document.querySelector('head')
			docHead.append(darkThemeLinkEl)
		},
		_removeDarkTheme() {
			let darkThemeLinkEl = document.querySelector('#dark-theme-style')
			let parentNode = darkThemeLinkEl.parentNode
			parentNode.removeChild(darkThemeLinkEl)
		},
		darkThemeSwitch() {
			let darkThemeLinkEl = document.querySelector('#dark-theme-style')
			if (!darkThemeLinkEl) {
				this._addDarkTheme()
			} else {
				this._removeDarkTheme()
			}
		},
	},
}
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
	a,
	button {
		font-weight: bold;
		color: #fff;
		margin: 0px 10px;
		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>

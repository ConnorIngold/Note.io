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
	metaInfo() {
		return {
			title: 'Note',
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content:
						'hello world, this is an example of adding a description with vueMeta',
				},
			],
		}
	},
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
body {
	background-color: #2c3e50;
}
h1,
h2,
h3,
h4,
h5,
h6 {
	margin-top: 0;
	margin-bottom: 2rem;
	font-weight: 300;
}
body h1 {
	font-size: 4rem;
	line-height: 1.2;
}
body h2 {
	font-size: 3.6rem;
	line-height: 1.25;
}
body h3 {
	font-size: 3rem;
	line-height: 1.3;
}
body h4 {
	font-size: 2.4rem;
	line-height: 1.35;
}
body h5 {
	font-size: 1.8rem;
	line-height: 1.5;
}
body h6 {
	font-size: 1.5rem;
	line-height: 1.6;
}

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
		font-family: 'Handlee', cursive;
		&.router-link-exact-active {
			color: #42b983;
		}
	}
}

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
	color: white;
	font-family: 'Open Sans', Avenir, Helvetica, Arial, sans-serif;
}
</style>

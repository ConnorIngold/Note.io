<template>
	<div class="hello">
		<h1>{{ msg }}</h1>
		<p>
			For a guides on how to configure / customize notes,<br />
			check out
			<a href="https://note.io" target="_blank" rel="noopener">note.io/guides</a
			>.
		</p>

		<h3>Essential Links</h3>
		<ul>
			<li>
				<a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
			</li>
			<li>
				<a href="https://forum.vuejs.org" target="_blank" rel="noopener"
					>Forum</a
				>
			</li>
			<li>
				<a href="https://chat.vuejs.org" target="_blank" rel="noopener"
					>Community Chat</a
				>
			</li>
			<li>
				<a href="https://twitter.com/vuejs" target="_blank" rel="noopener"
					>Twitter</a
				>
			</li>
			<li>
				<a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'HelloWorld',
	props: {
		msg: String,
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>

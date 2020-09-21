<template>
	<div>
		<h1>Dashboard</h1>
		<h3 v-if="user">Welcome {{ user.username }}</h3>
	</div>
</template>

<script>
const url = process.env.PORT || 'http://localhost:5000/'

export default {
  data() {
    return {
      user: null
    }
  },
	mounted() {
		this.$http({
			method: 'get',
			url: url,
			headers: {
				Authorization: `Bearer ${localStorage.token}`,
			}
		})
			.then(result => {
        console.log("result", result);
        if(result.data.user){
          console.log("result", result)
          this.user = result.data.user
        } else {
          console.log("old token");
          localStorage.token = ""
        }
			})
			.catch(err => {
				console.log(err)
			})
	},
}
</script>

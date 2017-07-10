<template>
 <div class='userView'>
 <h1>User : {{user.id}}</h1>   
 <p>Create : {{user.created|timeAgo}} ago</p> 
 <p>Karma:{{user.Karma}}</p>
 <a :href="'https://news.ycombinator.com/submitted?id='+user.id">submissions</a>|
 <a :href="'https://news.ycombinator.com/threads?id='+user.id">comments</a>
 </div> 
</template>
<script>
export default {
  name:'userView',
  computed:{
      user(){
          return this.$store.state.users[this.$store.state.route.params.id]
        }
  },
  beforeMount(){
      this.$store.dispatch('FETCH_USER',{id:this.$store.state.route.params.id}) 
  }
}
</script>


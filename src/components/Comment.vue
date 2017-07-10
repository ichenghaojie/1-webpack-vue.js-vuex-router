<template>
  <li v-if="comment" class='comment'>
      <div>
          <router-link :to="'/user/'+comment.by">{{comment.by}}</router-link>
          {{ comment.time | timeAgo }} ago
          <a v-if="comment.kids" @click='open=!open'> | {{comment.kids.length}} {{open ? 'replies collapse': 'reply expand'}}</a>  
      </div>
      <div v-html='comment.text'>
      </div>
      <ul v-show="open">
          <comment v-for="id in comment.kids" :key="id" :id='id'></comment>
      </ul>
      
  </li>
</template>
<script>
export default {
  name:'comment',
  props:['id'],
  data(){
      return {
           open:true
      }
  },
  computed:{
      comment(){
          return this.$store.state.items[this.id]
      }
  },
  beforeMount(){
      this.$store.dispatch('FETCH_ITEMS',{ids:[this.id]})
  }
}
</script>


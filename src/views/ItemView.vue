<template>
<div class="item-view" v-if="item">
  <div class="item-view-header">
       <a :href=item.url target="_blank"><h1>{{item.title}}</h1></a>
       <span class="host" v-if="item.url" >{{item.url|urlHost}}</span>
       <p class="meat">{{item.score}} points | by 
          <router-link :to="'/user/'+item.by">{{item.by}}</router-link> 
         {{item.time|timeAgo}} ago
        </p>
   </div>
   <div class="item-view-comment">
       <p class="item-view-comment-header" >{{item.kids ? item.descendants+'comment':'no comments yet' }}s</p>
       <ul>
           <comment v-for="id in item.kids" :key="id" :id="id"></comment>
       </ul>
   </div>
</div>
   
</template>
<script>
import Comment from '../components/Comment.vue';
export default {
  name:'item-view',
  computed:{
       item(){
           return this.$store.state.items[this.$store.state.route.params.id]
        }
  },
  components:{Comment},
  beforeMount(){
      var id = this.$store.state.route.params.id;
      this.$store.dispatch('FETCH_ITEMS',{ids:[id]})
  }
}
</script>
<style >
.item-view{
    position: relative;
}
.item-view-header h1{
    display:inline;
    font-size:1.4em;
    margin:0 0.5em 0 0 ;
}
.item-view .item-view-header {
    background-color: #fff;
    padding: 1.8em 2em 1em;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.item-view .item-view-header .host,.item-view .item-view-header .meat{
    color: #999
}
.item-view .item-view-header .meat a{
    color: #999;
    text-decoration: underline;
}
</style>


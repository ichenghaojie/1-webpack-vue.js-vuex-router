<template>
  <div class="top">
            <div class="nav">
                <div class="pages">
                    <router-link v-if='page > 1' :to="'/' + type + '/' + (page - 1)">&lt; prev</router-link>
                    <a v-else class="disabled">&lt; prev</a>
                    <span>{{ page }}/{{ maxPage }}</span>
                    <router-link v-if="hasMore" :to="'/' + type + '/' + (page + 1)">more &gt;</router-link>
                    <a v-else class="disabled">more &gt;</a>
                </div>
            </div>
            <transition :name="transition">
                <div class="news-list" :key="displayedPage" v-if="true">
                    <transition-group tag="ul" name="item">
                        <li v-for="item in displayedItems" :key="item.id" class="news-item">
                            <span class="score">{{ item.score }}</span>
                            <span class="title">
                                <template v-if="item.url">
                                    <a :href="item.url" target="_blank">{{ item.title }}</a>
                                    <span class="host">({{ item.url | urlHost }})</span>
                            </template>
                            <template v-else>
                                <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
                            </template>
                            </span>
                            <br>
                            <span class="meta">
                                <span v-if="item.type !== 'job'" class="by">
                                    by <router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
                                </span>
                            <span class="time">
                                    {{ item.time | timeAgo }} ago
                                </span>
                            <span v-if="item.type !== 'job'" class="comments-link">
                                    | <router-link :to="'/item/' + item.id ">{{ item.descendants }} comments</router-link>
                                </span>
                            </span>
                            <span class="label" v-if="item.type !== 'story'">{{ item.type }}</span>
                        </li>
                    </transition-group>
                </div>
            </transition>
        </div>
</template>
<script>
export default {
    name: 'item-list',

    data() {
        const isInitialRender = !this.$root._isMounted
        
        return {
            loading: false,
            transition: 'slide-left',
            displayedPage: isInitialRender ? Number(this.$store.state.route.params.page) || 1 : -1,
            displayedItems: isInitialRender ? this.$store.getters.activeItems : []
        }
    },

    props: {
        type: String
    },

    computed: {
        page(){
            return Number(this.$store.state.route.params.page) || 1
        },
        maxPage(){
            const { itemsPerPage, lists } = this.$store.state
            return Math.ceil(lists[this.type].length / itemsPerPage )
        },
        hasMore(){
            return this.page < this.maxPage
        }
    },

    beforeMount(){
        // if(this.$root._isMounted){
        this.loadItems(this.page);

        // this.unwatchList = watchList(this.type, ids => {
        //     this.$store.commit('SET_LIST', { type: this.type, ids })
        //     this.$store.dispatch('ENSURE_ACTIVE_ITEMS').then(() => {
        //         this.displayedItems = this.$store.getters.activeItems
        //     })
        // })
    },

    beforeDestroy(){
        // this.unwatchList()
    },

    watch: {
        page(to, from){
            this.loadItems(to, from)
        }
    },

    // filters: {
    //     host(url){
    //         const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    //         const parts = host.split('.').slice(-3)
    //         if(parts[0] === 'www') parts.shift()
    //         return parts.join('.')
    //     },
    //     timeAgo(seconds){
    //         const pluralize = function(time, label){
    //             if(time === 1){
    //                 return time + label
    //             }
    //             return time + label + 's'
    //         }
    //         const between = Date.now() / 1000 - Number(seconds)
    //         if(between < 3600){
    //             return pluralize(~~(between / 60), ' minute')
    //         }else if (between < 86400) {
    //             return pluralize(~~(between / 3600), ' hour')
    //         }else {
    //             return pluralize(~~(between / 86400), ' day')
    //         }
    //     }
    // },

    methods: {
        loadItems(to = this.page, from = -1){
            this.loading = true
            this.$store.dispatch('FETCH_LIST_DATA', {
                type: this.type
            }).then(() => {
                console.log('then');
                if(this.page < 0 || this.page > this.maxPage){
                    this.$router.replace(`/${this.type}/1`)
                    return
                }
                this.transition = to > from ? 'slide-left' : 'slide-right'
                this.displayedPage = to
                this.displayedItems = this.$store.getters.activeItems
                console.log(this.displayedItems)
                this.loading = false
            })
        }
    }

}
</script>
<style>
.top {
    padding-top: 54px;
}
.top .nav {
    background-color: #fff;
    box-shadow: 0 2px 1px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 54px;
    left: 0px;
    right: 0px;
    z-index: 99;
}
.top .nav .pages {
    max-width: 800px;
    margin: 0 auto;
    padding: 15px;
    text-align: center;
}
.top .nav .pages .disabled {
    color: #ccc;
}
.top .nav .pages a {
    color: inherit;
    text-decoration: none;
    margin: 0 1em;
}
.top .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    transform: translate(30px, 0);
}
.top .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    transform: translate(-30px, 0);
}
.top .item-move, .item-enter-active, .item-leave-active {
    transition: all .5s cubic-bezier(.55, 0, .1, 1)
}
.top .item-enter {
    opacity: 0;
}
.top .item-leave-active {
    position: absolute;
    opacity: 0;
    transform: translate(30px, 0);
}
.top .news-list {
    position: absolute;
    margin: 16px 0px 30px;
    padding: 0px;
    width: 100%;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.1);
    transition: all .5s cubic-bezier(.55, 0, .1, 1)
}
.top .news-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}
.top .news-list .news-item {
    padding: 20px 30px 20px 80px;
    border-bottom: 1px solid #eee;
    position: relative;
    line-height: 20px;
}
.top .news-list .news-item .score {
    color: #ff6600;
    font-size: 1.1em;
    font-weight: 700;
    position: absolute;
    top: 50%;
    left: 0;
    width: 80px;
    text-align: center;
    margin-top: -10px;
}
.top .news-list .news-item .meta {
    font-size: .85em;
    color: #999;
}
.top .news-list .news-item .meta .by a {
    color: #999;
}
.top .news-list .news-item .meta .comments-link a {
    color: #999;
}
.top .news-list .news-item .title .host {
    font-size: .85em;
    color: #999;
}
.top .news-list .news-item .title a {
    color: inherit;
    text-decoration: none;
}
.top .news-list .news-item .title a:hover {
    color: #ff6600;
}
</style>



        
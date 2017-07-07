import ItemList from '../components/ItemList.vue'
export function createListView(type){
	return{
		name: `${type}-stories-view`,
		render: function (createElement) {
		    return createElement(
		      ItemList,   
		      {props:{type}}
		    )
		}
	}
}
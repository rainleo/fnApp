<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad:function(){
			this.$minApi.myinfo().then(res=>{
				console.log("111");
				console.log(res);
			}).catch(err =>{
				
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

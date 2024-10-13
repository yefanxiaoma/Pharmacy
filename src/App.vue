<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data(){
    return {
      user : JSON.parse(sessionStorage.getItem('AdminCurUser')),
    }
  },
  watch:{
    '$store.state.menu':{
      handler(val,old){
        if(!old && this.user && this.user.userno){
          this.$store.commit("setMenu",val)
        }
      },
      immediate:true
    }
  }
}
</script>
<style>
#app {
width: 100%;
height: 100%;
}
</style>

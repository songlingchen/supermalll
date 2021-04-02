<template>
  <div class="recommend">
    <div v-for="item in recommends" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="recommendsImgLoad">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RecommendView",
    props: {
      recommends: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        isLoad: false
      }
    },
    methods: {
      recommendsImgLoad() {
        if(!this.isLoad){
          this.$emit('recommendsImgLoad')
          this.isLoad = true
        }
      }

    }
  }
</script>

<style scoped>
  .recommend{
    display: flex;
    text-align: center;
    font-size: 12px;
    padding: 10px 0 20px;
    border-bottom: 10px solid #eee;
  }
  .recommend-item{
    flex: 1;
  }
  .recommend-item img{
    width: 85%;
    margin-bottom: 10px;
  }
</style>

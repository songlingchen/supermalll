<template>
  <div class="toast" v-show="isShow">
    {{message}}
  </div>
</template>

<script>
  export default {
    name: "Toast",
    props: {
      // message: {
      //   type: String,
      //   default: ''
      // }
    },
    data() {
      return {
        message: '',
        isShow: false
      }
    },
    methods: {
      show(message = '默认文字', duration = 2000) {
        this.isShow = true
        this.message = message
        setTimeout(() => {
          this.isShow = false
          this.message = ''
        }, duration)
      }
    }
  }
</script>

<style scoped>
  .toast {
    position: fixed;
    left: 50%;
    top:50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0,0,0,.75);
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    z-index: 999;
  }
</style>

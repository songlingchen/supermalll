<template>
  <div class="cart">
    <!--1.导航-->
    <nav-bar  class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!--2.商品列表-->
    <cart-list/>

    <!--3.商品汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar";
  import CartList from "@/views/cart/childCopms/CartList";
  import CartBottomBar from "@/views/cart/childCopms/CartBottomBar";
  import { mapGetters } from 'vuex'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      //两种语法
      // ...mapGetters(['cartLength'])

      ...mapGetters({
        length: 'cartLength'
      })
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .nav-bar{
    background-color: var(--color-tint);
    color: #fff;
  }
</style>

<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物车</div>
    </nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-content" v-show="isFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGood"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>
</template>

<script>
import HomeSwiper from "@/views/home/childComps/HomeSwiper";
import RecommendView from "@/views/home/childComps/RecommendView";
import FeatureView from "@/views/home/childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabBarItem from "@/components/common/tabbar/TabBarItem";
import TabControl from "@/components/content/tabcontrol/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from "@/components/content/backtop/BackTop";

import {getHomeMultidata, getHomeGoods} from "@/network/home";
import {debounce} from "@/common/utils";


export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabBarItem,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data(){
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      isShowBackTop: false,
      topOffsetTop: 0,
      isFixed: false,
      saveY: 0,
      popY: 0,
      newY:0,
      sellY:0
    }
  },
  computed: {
    showGood() {
      return this.goods[this.currentType].list
    }

  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata()

    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {
    // 1.图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    this.$bus.$on('itemImgLoad', () => {
      refresh()
    })
  },
  destroyed() {
    console.log('destroyed');
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY()
    // console.log(this.saveY);
  },
  methods: {

     /**
     * 事件监听相关的方法
     */

    tabClick(index){
       switch (index) {
         case 0:
           this.currentType = 'pop'
           break
         case 1:
           this.currentType = 'new'
           break
         case 2:
           this.currentType = 'sell'
           break
       }
       this.$refs.tabControl1.currentIndex = index
       this.$refs.tabControl2.currentIndex = index
       // if(this.isFixed) {
       //   this.$refs.scroll.scrollTo(0, -this.topOffsetTop, 0)
       // }
     },
    backClick(){
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position) {
      // 1.判断BacKTop是否显示
      this.isShowBackTop = (-position.y) > 1000

      // 2.决定TabControl是否吸顶（position: fixed）
      this.isFixed = (-position.y) > this.topOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      this.topOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

     /**
     * 网络请求相关的方法
     */

    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // this.result = res
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type) {
      let page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        this.$refs.scroll.finishPullUp()

      })
    }
  }
}
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  .content{
    overflow: hidden;
    position: absolute;
    top:44px;
    bottom: 49px;
  }
  .tab-content {
    position: relative;
    z-index: 9;
  }

  /*.content{*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/

</style>

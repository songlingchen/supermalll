<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
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
      <recommend-view :recommends="recommends" @recommendsImgLoad="recommendsImgLoad"/>
      <feature-view @FeatureViewLoad="FeatureViewLoad"/>
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

import {getHomeMultidata, getHomeGoods} from "@/network/home";

import {itemListenerMixin, backTopMixin} from "@/common/mixin";


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
    Scroll
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
      isFixed: false,
      topOffsetTop: 0,
      saveY: 0,
      titles: [],
      scrollY: [0, 0, 0],
      currentIndex: 0
    }
  },
  mixins: [itemListenerMixin, backTopMixin],
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

    for(let item in this.goods) {
      this.titles.push(item)
    }
  },
  mounted() {
    // 1.图片加载完成的事件监听

  },
  destroyed() {
    // console.log('destroyed');
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // 1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY()

    // 2.取消全局时间监听
    this.$bus.$off('itemImgLoad',  this.itemImgListener)
  },
  methods: {

     /**
     * 事件监听相关的方法
     */

    tabClick(index) {

       if(this.isFixed){
         for (let i in this.titles) {
           if(this.scrollY[i] === 0){
             this.scrollY[i] = -this.topOffsetTop
           }
           if(this.currentType === this.titles[i]) {
             this.scrollY[i] = this.$refs.scroll.getScrollY()
           }
         }
       } else {
         this.scrollY = [0,0,0,]
       }

       this.currentType = this.titles[index]
       this.currentIndex = index

       if(this.isFixed) {
         this.$refs.scroll.scrollTo(0, this.scrollY[index], 0)
       }

       this.$refs.tabControl1.currentIndex = index
       this.$refs.tabControl2.currentIndex = index

     },

    contentScroll(position) {
      // 1.判断BacKTop是否显示
      this.listenerShowBackTop(position)

      // 2.决定TabControl是否吸顶（position: fixed）
      this.isFixed = (-position.y) > this.topOffsetTop

    },

    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      this.topOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    FeatureViewLoad() {
      this.topOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    recommendsImgLoad() {
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
        // console.log(this.recommends);
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

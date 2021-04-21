<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <!-- 属性：topImages 传入值 top-images -->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :components-info="componentsInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!--    <toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
 import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
 import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
 import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
 import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
 import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
 import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
 import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
 import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

 import Scroll from "@/components/common/scroll/Scroll";
 import GoodsList from "@/components/content/goods/GoodsList";
 // import Toast from "@/components/common/toast/Toast";

 import {getDetial, getRecommend,  Goods, Shop, GoodsParam} from "@/network/detail";
 import {debounce} from "@/common/utils";
 import {itemListenerMixin, backTopMixin} from "@/common/mixin";
 import { mapActions } from 'vuex'

 export default {
   name: "Detail",
   data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        componentsInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopYs: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
   mixins: [itemListenerMixin, backTopMixin],
   components: {
     DetailBottomBar,
     GoodsList,
     DetailShopInfo,
     DetailNavBar,
     DetailSwiper,
     DetailBaseInfo,
     DetailGoodsInfo,
     DetailParamInfo,
     DetailCommentInfo,
     Scroll,
     // Toast
   },
   created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid;

      // 2.根据iid请求详细数据
      getDetial(this.iid).then(res => {

        // 1.获取数据
        const data = res.result

        // 2.获取顶部图片轮播数据
        this.topImages = data.itemInfo.topImages

        // 3.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 4.创建店铺信息对象
        this.shop = new Shop(data.shopInfo)

        // 5.保存商品的详细信息
        this.detailInfo = data.detailInfo

        // 6.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 7.获取评论信息
        if( data.rate.Crate !==0) {
          this.componentsInfo = data.rate.list[0]
        }
        // 1.第一次获取，值不对
        // 值不对的原因：$refs.params.$el压根没有渲染
        // this.themeTopYs = [];
        // this.themeTopYs.push(0);
        // this.themeTopYs.push( this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        //
        // this.$nextTick(() => {
        //   // 1.第二次获取，值不对
        //   // 值不对的原因：图片没有计算在内
        //   // 根据最新的数据，对应DOM是已经渲染出来
        //   // 但是图片依然是没有加载完（目前获取到offsetTop不包含其中的图片）
        //   // offsetTop值不对的时候，都是因为图片的问题
        //   this.themeTopYs = [];
        //   this.themeTopYs.push(0);
        //   this.themeTopYs.push( this.$refs.params.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        //   console.log(this.themeTopYs);
        // })
      })

      // 3.请求推荐数据
      getRecommend(this.iid).then(res => {
        this.recommends = res.data.list
        // console.log(res);
      })

     // 4.给getThemeTopYs赋值（对给this.themeTopYs赋值的操作进行防抖）
     this.getThemeTopYs = debounce(() => {
       this.themeTopYs = [];
         this.themeTopYs.push(0);
         this.themeTopYs.push(this.$refs.params.$el.offsetTop);
         this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
         this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
         this.themeTopYs.push(Number.MAX_VALUE)
         // console.log(this.themeTopYs);
     }, 100)
    },
   methods: {
     ...mapActions(['addCart']),
     imageLoad() {
        // this.$refs.scroll.refresh()
        this.newRefresh();
        this.getThemeTopYs();
      },
     titleClick(index) {
       // console.log(index);
       this.$refs.scroll.scrollTo(0, -this.themeTopYs[index] , 500)
     },
     contentScroll(position) {
       // 1.获取y值
       const positionY = -position.y

       // 2.positionY和主题中值进行对比
       // [0, 7938, 9120, 9453, Number.MAX_VALUE]
       // console.log(Number.MAX_VALUE);


       // positionY 在 0 和 7938 之间， index = 0
       // positionY 在 =7938 和 9120 之间， index = 1
       // positionY 在 9120 和 9453 之间， index = 2
       // positionY 在 9120 和 非常大的值 之间， index = 3

       // positionY 大于等于 9120 值， index = 3
       const length = this.themeTopYs.length
       for(let i = 0; i < length-1; i++) {

         // if(positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
         //   console.log(i);
         // }

         // if(this.currentIndex !==i && ((i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
         //   || (i === length-1 && positionY >= this.themeTopYs[i]))) {
         //   this.currentIndex = i
         //   this.$refs.nav.currentIndex = this.currentIndex
         // }

         if(this.currentIndex !==i && ((i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
           )) {
           this.currentIndex = i
           this.$refs.nav.currentIndex = this.currentIndex
         }


       }
       this.listenerShowBackTop(position)

     },
     addToCart() {
       // 1.获取购物车需要展示的信息
       const product = {}
       product.image = this.topImages[0];
       product.title = this.goods.title;
       product.desc = this.goods.desc;
       product.price = this.goods.lowNowPrice;
       product.iid = this.iid;

       // 2.将商品添加到购物车(1.Promise 2.mapActions)
       // this.$store.state.push(product)
       // this.$store.commit('addCar', product)
       // this.$store.dispatch('addCart', product).then(res => {
       //   console.log(res);
       // })
       this.addCart(product).then(res => {
         // this.message = res
         // this.show = true
         // setTimeout(() => {
         //   this.show = false
         //   this.message = ''
         // },1500)
         this.$toast.show(res)
       })
     }
   },
   mounted() {

   },
   updated() {

   },
   destroyed() {
     this.$bus.$off('itemImgLoad',  this.itemImgListener)
   }
 }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 58px);
  }

</style>

<template>
  <div id="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem"/>
      <scroll id="tab-content" ref="scroll">
        <tab-content-category :subCategories="showSubCategory"/>
        <tab-control :titles="['综合', '新品', '流行']" @tabClick="tabClick" ref="tabControl"/>
        <tab-content-detail :showContentDetail="showContentDetail"/>
      </scroll>
    </div>

  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import Scroll from "components/common/scroll/Scroll";
  import TabControl from "components/content/tabcontrol/TabControl";

  import TabMenu from "./childCopms/TabMenu";
  import TabContentCategory from "./childCopms/TabContentCategory";
  import TabContentDetail from "./childCopms/TabContentDetail";

  import {getCategory, getSubCategory, getContentDetail} from "network/category";
  import {tabControlMixin} from "common/mixin";
  import {POP, NEW, SELL} from "common/const";
  import {debounce} from "common/utils";

  export default {
    name: "Category",
    components: {
      NavBar,
      Scroll,
      TabControl,
      TabMenu,
      TabContentCategory,
      TabContentDetail
    },
    mixins: [tabControlMixin],
    data() {
      return {
        categories: [],
        currentIndex: -1,
        categoryDate: {}
      }
    },
    created() {
      // 1.请求分类数据
      this._getCategory()
    },
    mounted() {
      // 1.图片加载完成的事件监听
      const refresh = debounce(this.$refs.scroll.refresh, 50)
      this.$bus.$on('itemImgLoad', () => {
        refresh()
      })
    },
    computed: {
      showSubCategory() {
        if(this.currentIndex === -1) return {}
        return this.categoryDate[this.currentIndex].subCategories
      },
      showContentDetail() {
        if(this.currentIndex === -1) return []
        return this.categoryDate[this.currentIndex].categoryDetail[this.currentType]
      }
    },
    methods: {

      _getCategory() {
        getCategory().then(res => {
          // 1.获取分类数据
          this.categories = res.data.category.list
          // 2.初始化每个类别的子数据
          for(let i =0; i < this.categories.length; i++) {
            this.categoryDate[i] = {
              subCategories: {},
              categoryDetail: {
                [POP]: [],
                [NEW]: [],
                [SELL]: []
              }
            }
          }
          console.log(this.categoryDate[0].categoryDetail);
          // 3.请求第一个分类的数据
          this._getSubCategory(0);
        })
      },
      _getSubCategory(index) {
        this.currentIndex = index
        const maitkey = this.categories[index].maitKey
        getSubCategory(maitkey).then(res => {
          this.categoryDate[index].subCategories = res.data
          this.categoryDate = {...this.categoryDate}
        })
        this._getContentDetail(POP)
        this._getContentDetail(NEW)
        this._getContentDetail(SELL)
      },
      _getContentDetail(type) {
        // 1.获取请求的miniWallkey
        const miniWallkey = this.categories[this.currentIndex].miniWallkey
        // 2,发送请求，传入miniWallkey和type
        getContentDetail(miniWallkey, type).then(res => {
          this.categoryDate[this.currentIndex].categoryDetail[type] = res
          // 3,将获取的数据保存下来
          this.categoryDate = {...this.categoryDate}
        })
      },

      /**
      * 事件响应的响应的方法
      */
      selectItem(index) {
        this.$refs.scroll.scrollTo(0, 0, 0)
        this.$refs.tabControl.currentIndex = 0
        this._getSubCategory(index)
      }
    }
  }
</script>

<style scoped>
  #category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }

  .content {
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;
    overflow: hidden;

  }

  #tab-content{
    flex: 1;
  }
</style>

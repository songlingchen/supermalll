import {debounce} from "@/common/utils";
import BackTop from "@/components/content/backtop/BackTop";
import {BACKTOP_DISANCE, POP, NEW, SELL} from "./const";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted() {
    this.newRefresh  = debounce(this.$refs.scroll.refresh, 50)
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('itemImgLoad',  this.itemImgListener)
    // console.log('我是混入的内容');
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    listenerShowBackTop(position) {
      this.isShowBackTop = (-position.y) > BACKTOP_DISANCE
    }
  }
}

export const tabControlMixin = {
  data() {
    return {
      currentType: POP,
    }
  },
  methods: {

    tabClick(index) {

      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }

    }

  }
}

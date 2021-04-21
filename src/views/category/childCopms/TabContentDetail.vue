<template>
  <div id="tab-content-detail">
    <grid-view>
      <goods-list-item v-for="(item, index) in showContentDetail" :key="index" :goodItem="item"/>
    </grid-view>
  </div>
</template>

<script>
import GridView from "components/common/gridview/GridView";
import GoodsListItem from "components/content/goods/GoodsListItem";

export default {
  name: "TabContentDetail",
  components: {
    GridView,
    GoodsListItem
  },
  props: {
    showContentDetail: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>

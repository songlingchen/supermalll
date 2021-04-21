<template>
  <div id="tab-content-category">
    <grid-view :cols="3" :lineSpace="15" :v-margin="20" v-if=" subCategories.list">
      <div v-for="(item, index) in subCategories.list" :key="index" class="item">
        <a :href="item.link">
          <img :src="item.image" alt="" class="item-img">
          <div class="item-text">{{item.title}}</div>
        </a>
      </div>
    </grid-view>
  </div>
</template>

<script>
import GridView from "components/common/gridview/GridView";
export default {
  name: "TabContentCategory",
  components: {
    GridView
  },
  props: {
    subCategories: {
      type: Object
    }
  }
}
</script>

<style scoped>
  .panel img {
    width: 100%;
  }

  .item {
    text-align: center;
    font-size: 12px;
  }

  .item-img {
    width: 80%;
  }

  .item-text {
    margin-top: 15px
  }

</style>

<template>
  <swiper>
    <swiper-item v-for="(item,key) in banners" :key="key">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoaded">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'
  export default {
    name:'HomeSwiper',
    data() {
      return {
        isLoad: false
      }
    },
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      Swiper,
      SwiperItem
    },
    methods: {
      imageLoaded() {
        //console.log('轮播图');
        if(!this.isLoad) {
          this.$emit('swiperImageLoad');
          this.isLoad = true
        }
      }
    }
  }
</script>

<style scoped>

</style>
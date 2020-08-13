<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-swiper :banners="banners"/>
    <home-recommend :recommends="recommends"/>
    
  </div>



</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import HomeSwiper from './childCpns/HomeSwiper'
  import HomeRecommend from './childCpns/HomeRecommend'

  import {getHomeMultidata} from 'network/home'

  export default {
    name:'Home',
    components: {
      NavBar,
      HomeSwiper,
      HomeRecommend
    },
    data() {
      return {
        //result: null
        banners: [],
        recommends: []
      }
    },
    created() {
      //.请求多个数据
      getHomeMultidata().then(res => {
        //console.log(res);
        //this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    }
  }
</script>

<style scoped>
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
  }

</style>
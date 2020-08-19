<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
                    class="tab-control" 
                    @tabctrClick="tabClick" 
                    ref="tabControl1"
                    v-show="isTabFixed"
                    />
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            :pull-up-load="true"
            @scroll="scrollcontent"
            @pullingUp="loadMore"
            >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <home-recommend :recommends="recommends"/>
      <home-feature/>
      <tab-control :titles="['流行','新款','精选']" 
                    @tabctrClick="tabClick" 
                    ref="tabControl"
                    />
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>

  import HomeSwiper from './childCpns/HomeSwiper'
  import HomeRecommend from './childCpns/HomeRecommend'
  import HomeFeature from './childCpns/HomeFeature'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import {itemListenerMixin, backTopMixin} from 'common/mixin'
  import {BACK_POSITION} from 'common/const'

  import {getHomeMultidata,getHomeGoods} from 'network/home'
  

  export default {
    name:'Home',
    components: {
      HomeSwiper,
      HomeRecommend,
      HomeFeature,
      NavBar,
      TabControl,
      GoodsList,
      Scroll
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        //result: null
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        taboffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      console.log('created');
      //1.请求多个数据
      this.getHomeMultidata();
      //2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    mounted() {
      //这个位置img标签确实被挂载,但是其中图片还没有占据高度
      console.log('内部mounted');
      //2.获取tabControll的offsetTop
      //所有组件都有一个属性$el:用于获取组件中的元素
    },
    destroyed() {
      console.log('home 销毁');
    },
    //钩子函数
    activated(){
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      //1.保存y值
      this.saveY = this.$refs.scroll.getScrollY()
      console.log(this.saveY);

      //2.取消全局全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      tabClick(index) {
        //console.log(index);
        switch(index) {
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
        this.$refs.tabControl.currentIndex = index;
        this.$refs.tabControl1.currentIndex = index;
      },
      scrollcontent(position) {
        //1.判断BackTop是否显示
        //console.log(position);
        this.isShowBackTop = (-position.y) > BACK_POSITION

        //2.决定tabcontrol是否吸顶(position:fixed)
        this.isTabFixed = (-position.y) > this.taboffsetTop
      },
      loadMore() {
        //console.log('上拉加载');
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        this.taboffsetTop = this.$refs.tabControl.$el.offsetTop;
      },
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
        //console.log(res);
        //this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
        //console.log(res);
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        //完成上拉加载更多
        this.$refs.scroll.finishPullUp();
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    position: relative;
    height: 100vh;
    /*padding-top: 44px;*/
    /*padding-bottom: 64px;*/
  }
  .home-nav {
    /*position: fixed;*/
    background-color: var(--color-tint);
    color: #fff;
    /*left: 0;
    right: 0;
    top: 0;
    z-index: 99;*/
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
  .content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 64px;
    right: 0;
    left: 0;
  }
  /*.content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  }*/
</style>
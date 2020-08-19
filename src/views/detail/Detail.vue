<template>
  <div id="detail">
      <detail-nav-bar class="detail-nav" @titleClick="titleClick"
      ref="nav"/>
      <scroll class="content" ref="scroll" @scroll="contentScroll"
      :probe-type="3">
        <detail-swiper :top-images="topImages"/>
        <detail-base-info :goods="goods"/>
        <detail-shop-info :shop="shop"/>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
        <detail-param-info ref="params" :param-info="paramInfo"/>
        <detail-comment-info ref="comment" :comment-info="commentInfo"/>
        <goods-list ref="recommend" :goods="recommends"/>
      </scroll>
      <back-top @click.native="backClick" v-show="isShowBackTop"/>
      <detail-bottom-bar @addToCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'
  

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {itemListenerMixin, backTopMixin} from 'common/mixin'
  import {debounce} from 'common/utils'
  import {BACK_POSITION} from 'common/const'


  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'

  export default {
    name:'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    methods: {
      imageLoad() {
        console.log('图片加载');
        //this.$refs.scroll.refresh()
        this.refresh();
        this.getThemeTopY()
      },
      titleClick(index) {
        console.log(index);
        this.$refs.scroll.scrollTo(0,-(this.themeTopYs[index]),500)

      },
      contentScroll(position) {
        //console.log(position);
        //获取y值
        const positionY = -position.y
        //position.Y与主题中的值进行对比
        let length = this.themeTopYs.length
        for(let i = 0; i < length - 1; i++) {
          if( this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i;
            this.$refs.nav.curretIndex = this.currentIndex
          }
        }

        //是否显示回到顶部
        this.isShowBackTop = (-position.y) > BACK_POSITION
      },
      addToCart() {
        //获取购物车需展示的信息
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        //将商品添加到购物车
        this.$store.dispatch('addCart', product)
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid;
      //2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        console.log(res);
        const data = res.result
        //获取轮播图数据
        this.topImages = data.itemInfo.topImages

        //获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //获取店铺信息
        this.shop = new Shop(data.shopInfo)

        //获取商品详情
        this.detailInfo = data.detailInfo

        //获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

        //获取评论信息
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        /**
         * 如皋在这里获取,this.$refs.params.$el压根没有渲染
         */

        
        this.$nextTick(() => {
          /**
           * 根据最新的数据,对应的DOM是已经被渲染出来
           * 但是图片依然没有加载完
           */
        })

      });
      //3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      //4.给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        //PS:获取组件内的元素要用$el
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE)
        console.log(this.themeTopYs);
      },100)
    },
    mounted() {
      console.log('内部');
    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    height: 100vh;
    background-color: #fff;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 93px);
  }

</style>
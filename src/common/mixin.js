import {debounce} from './utils'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    //1.监听图片加载完成
    this.refresh = debounce(this.$refs.scroll.refresh,100);
    this.itemImgListener = () => {
      //console.log('图片打印完成');
      this.refresh();
      }
    this.$bus.$on('itemImageLoad',this.itemImgListener);
    console.log('外部');
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500)
      //console.log('-----');
    }
  }
}
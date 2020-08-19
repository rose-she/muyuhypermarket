<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
  
</template>

<script>
  import BScroll from 'better-scroll' 

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      } 
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      //1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper,{
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
        click: true
      })

      //2.监听滚动位置
      if(this.probeType === 2 || this.probeType ===3) {
        this.scroll.on('scroll', (position) => {
          //console.log(position);
          //发出事件
          this.$emit('scroll',position)
        })
      }

      //3.监听滚动到底部,上拉事件
      if(this.pullUpLoad) {
        this.scroll.on('pullingUp',() => {
          //console.log('上拉事件');
          this.$emit('pullingUp')
        }) 
      }
    },
    methods: {
      scrollTo(x, y, time = 300) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp();
      },
      refresh() {
        //console.log('加载完成');
        this.scroll && this.scroll.refresh();
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
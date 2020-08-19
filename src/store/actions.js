import{
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-type'

export default {
  addCart(context, payload) {
    //查找之前的数组有无该商品
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
    //2.判断
    if(oldProduct) {
      context.commit(ADD_COUNTER, oldProduct)
    }else {
      payload.count = 1
      context.commit(ADD_TO_CART, payload)
    }
  }
}
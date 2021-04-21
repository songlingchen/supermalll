import {
  ADD_COUNTER,
  ADD_TO_CART
} from "@/store/mutations-types";

export default {
  addCart(context, payload) {
    // payload新添加商品
    // let oldProduct = null
    // for (let item of state.carList){
    //   if(item.iid === payload.iid) {
    //     oldProduct = item
    //   }
    // }

    return new Promise((resolve, reject) => {
      //查找之前的数组中是否有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      // 判断oldProduct
      if(oldProduct){ // 数量加一
        context.commit(ADD_COUNTER, oldProduct)
        resolve('当前商品数量+1')
      } else { //添加新商品
        payload.count = 1
        context.commit(ADD_TO_CART, payload)
        resolve('添加了新商品')
      }
    })
  }

}

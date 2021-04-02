import {
  ADD_COUNTER,
  ADD_TO_CART
} from "@/store/mutations-types";

export default {
  addCar(context, payload) {
    // payload新添加商品
    // let oldProduct = null
    // for (let item of state.carList){
    //   if(item.iid === payload.iid) {
    //     oldProduct = item
    //   }
    // }

    //查找之前的数组中是否有该商品
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

    // 判断oldProduct
    if(oldProduct){
      context.commit(ADD_COUNTER, oldProduct)
    } else {
      payload.count = 1
      context.commit(ADD_TO_CART, payload)
    }
  }

}

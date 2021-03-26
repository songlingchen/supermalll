import {request} from "@/network/request";

export function getDetial(iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}


export class Goods {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title
    this.desc = itemInfo.desc
    this.lowNowPrice = itemInfo.lowNowPrice
    this.oldPrice = itemInfo.oldPrice
    this.discountDesc = itemInfo.discountDesc
    this.columns = columns
    this.services = services
    this.realPrice = itemInfo.realPrice
  }
}

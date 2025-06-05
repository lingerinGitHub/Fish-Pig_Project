import { CURRENT_ENV_URL } from '../config/environment_config'

export const httpUrl = {
    userLogin: `${CURRENT_ENV_URL}/userOperation/login`, // 用户登录
    selectCroporation: `${CURRENT_ENV_URL}/corporation/selectCorporation`, // 查询企业信息（根据字段包含模糊查询）
    selectAllOrderById: `${CURRENT_ENV_URL}/order/selectAllOrderById`, // 根据用户id查询所有订单信息
    addaddCorporation: `${CURRENT_ENV_URL}/corporation/addCorporation`, // 添加企业信息
    deleteCorporation: `${CURRENT_ENV_URL}/corporation/deleteCorporation/`, // 删除企业信息
    updateCorporation: `${CURRENT_ENV_URL}/corporation/updateCorporation`, // 更新企业信息
    addOrder: `${CURRENT_ENV_URL}/order/addOrder`, // 添加订单信息
    updateOrder: `${CURRENT_ENV_URL}/order/updateOrder`, // 更新订单信息
    deleteOrder: `${CURRENT_ENV_URL}/order/deleteOrder/`, // 删除订单信息

}
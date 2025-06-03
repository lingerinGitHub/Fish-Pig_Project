import { CURRENT_ENV_URL } from '../config/environment_config'

export const httpUrl = {
    userLogin: `${CURRENT_ENV_URL}/userOperation/login`, // 用户登录
    selectCroporation: `${CURRENT_ENV_URL}/corporation/selectCorporation`, // 查询企业信息（根据字段包含模糊查询）
    
}
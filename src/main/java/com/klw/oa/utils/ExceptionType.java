package com.klw.oa.utils;

/**
 *
 */

/**
 * dxp 错误码、错误信息公共类
 */
public enum ExceptionType {
    ERROR_PARAMS_FORMAT(1, "参数不正确"),
    ERROR_PARAMS_LENGTH(2, "参数长度不正确"),
    ERROR_PARAMS_TYPE(3, "参数类型不正确"),

    ERROR_ACESS_FORBIDDEN(4, "无权限访问"),

    ERROR_DATA_NOTFOUND(5, "数据表不存在"),
    ERROR_DATA_DUPLICATE(6, "数据信息重复"),
    ERROR_DATA_NOTEXCHANGE(7, "数据未发布或在撤销中，无法进行交换"),
    ERROR_DATA_NOTGET(8, "数据无法获取"),

    ERROR_TIME_FORMAT(11, "时间格式不正确"),

    ERROR_USER_GET_FAILED(21, "用户获取失败"),

    ERROR_CREATE_CODE_CONFLICT(1400, "编码冲突,创建失败"),


    ERROR_UNKNOWN(1500, "系统内部错误"),
    ERROR_TYPE_NOTEXIST(1501, "当前分类不存在"),

    ERROR_ES_INIT_STRUCTURE_FAIL(1600, "初始化索引及Type结构失败"),


    ERROR_EDIT_RESOURCE_DETAIL(1700, "该资源已经被使用,主类不能编辑"),

    ERROR_DOP_GATEWAY_NULL(1800,"API网关不能为空"),

    ERROR_DXT_GATE_NAME_NULL(1850,"网关名称不能为空"),


    ERROR_PAPER_REVIEW_DETAIL_ERROR(2000, "资源申请清单解析错误"),


    ERROR_PAPERREVIEW_OPERATE(3000, "执行数据资源申请流程的任务失败"),


    ERROR_TERMINATEEXCHANGE_OPERATE(2000, "执行终止交换流程的任务失败"),

    ERROR_PHOTO_IS_NOT_STANDARD(3000,"上传图片宽高不符合要求，宽度>=1024，高度>=300"),


    ERRPR_SNAKER_BUSINESS_TYPE_NO_FOUND(3100, "流程业务类型不存在"),
	ERROE_NEXTPHASE_NOT_EXIST(3101, "未指定下一步操作任务"),

    //中间库操作错误码
    ERROR_CENTER_DB_CATALOG_DATA(4000, "数据准备的数据不存在或被删除"),

    ERROR_CENTER_DB_DELETE_AND_MODIFY(4009, "该中间库已关联资源，不能删除或修改"),
    //数据目录错误
    ERROR_DATA_DIRECTORY_MODIFY(4010, "修改失败"),


    //应用系统错误
    ERROR_APP_SYSTEM_CREATE(4050, "应用系统创建保存失败"),
    ERROR_APP_SYSTEM_MODIFY(4051, "应用系统修改保存失败");

    private int code;
    private String message;

    ExceptionType(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return this.code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String toString() {
        return "[Code:" + this.code + "; Message:" + this.message + "]";
    }

}

/**
 * mlp chart api in report for draw charts 
 * @param {object} params 初始化的参数
 * @class chartAPI
 * @author [I am using __markdown__]
 * @example
 * chartAPI().init({
 * 	version: "0.0.2"
 * })
 */
var chartAPI = function(params){
	var config = {
		version: "0.0.1"
	}
	
	var api = {};
	/**
	 * This callback type is called `requestCallback` and is displayed as a global symbol.
	 *
	 * @callback requestCallback
	 * @param {number} responseCode
	 * @param {string} responseMessage
	 */
	/**
	 * chartApi 初始化
	 * @public
	 * @name init
	 * @memberof chartAPI.prototype
	 * @param { Object | undefined } param 修改默认参数
	 * @param { string } [param.version=0.0.1] 当前版本
	 * @param { requestCallback | undefined } [cb] 异步调用, 当图标创建成功时候
	 * @function 
	 * @return {HTMLElement} body 元素
	 */
	api.init = function(param, cb){
		param || (param = {});
		console.log("init");
		return document.body;
	}
	return api;
}
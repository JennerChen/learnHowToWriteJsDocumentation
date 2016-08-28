/**
 * mlp chart api in report for draw charts 
 * @param {object} params 初始化的参数
 * @class chartAPI
 */
var chartAPI = function(params){

	var api = {};
	/**
	 * chartApi 初始化
	 * @public
	 * @memberof chartAPI
	 * @return {HTMLElement} body 元素
	 */
	api.init = function(){
		console.log("init");
		return document.body;
	}
	return api;
}
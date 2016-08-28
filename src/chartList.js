/**
 * chart 集合方法, 调用其内部方法时, 必须先执行init方法
 * @namespace 
 */
var chartList = (function(){
	var api = {};
	var list = [];
	/**
	 * 获取所有的 chartApi
	 * @memberOf chartList 
	 * @return {chartAPI[]} chartAPI 数组 {@link chartAPI}
	 */
	api.getAllChartApi = function(){
		return [chartApi().init()];
	}

	/**
	 * 根据id获取 chartApi 
	 * @param  {int} cId chartId
	 * @memberOf chartList 
	 * @return {chartApi} 
	 * See {@link chartAPI}
	 */
	api.getChartApiById = function(cId){
		return list[cId]
	}

	/**
	 * 初始化 chart 集合方法
	 * @memberOf chartList 
	 * @return {chartList} 
	 */
	api.init = function(){
		console.log("inited");
		return api;
	}
	return api;
}());
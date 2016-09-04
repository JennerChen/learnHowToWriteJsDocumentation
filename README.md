学习如何使用 jsdoc 和 markdown的语法
=================================

## Markdonw basics

### 块状包裹(blockquote)
> This is a blockquote.
> 
> This is the second paragraph in the blockquote.
>
> ## This is an H2 in a blockquote


### 强调单词
Some of these words *are emphasized*.
Some of these words _are emphasized also_.

Use two asterisks for **strong emphasis**.
Or, if you prefer, __use two underscores instead__.

### ul清单
*   Candy.
*   Gum.
*   Booze.


### 链接(link)
This is an [example link](http://example.com/).

I get 10 times more traffic from [Google][1] than from
[Yahoo][2] or [MSN][3].

[1]: http://google.com/        "Google"
[2]: http://search.yahoo.com/  "Yahoo Search"
[3]: http://search.msn.com/    "MSN Search"

### 代码(``)
I strongly recommend against using any `<blink>` tags.

I wish SmartyPants used named entities like `&mdash;`
instead of decimal-encoded entites like `&#8212;`.

***
## 高级markdown 语法

This is a normal paragraph:

    var a = new ChartApi() // 这是一行代码

***

## jsdoc 语法学习

### @namespace 

一般 namespace 用法. 	

	/**
	 * @namespace 
	 */
	var myUtils = {
		/**
		 * This function adds 2 to its input.
		 * @public 
		 * @param {number} input any number
		 * @memberof myUtils
		 * @returns {number} that number, plus 2.
		 */
		addOne: function(input) {
			return input + 2;
		},
		/**
		 * This function draw 
		 * @public 
		 * @memberof myUtils
		 * @returns {number} that number, plus 2.
		 */
		draw: function() {
			return input + 2;
		}
	}

namespace 用于 闭包:

#### 静态方法	
	
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


#### 类class, 不需要用new 的class	
1.  用@class 标签
2.  其方法用 @memberof 类名.prototype
3.  其方法必须用 @name标签 重写其名字, 否则无效							
			
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

### @param 标签		
用法: `@param` {变量类型} 变量名 描述 		
	
1.  最简单例子		

		/**
		 * @param {number} input 输入值
		 */
		function calculate(input){
			return input + 1;
		}

2.  可选参数		
		
		/**
		 * 计算一个值加1的结果, 如果输入为空, 返回为1
		 * @param {number } [input=1] 输入值
		 */
		function calculate(input){
			if(Number(input)){
				input = 1;
			}
			return input +1;
		}

3.  多重类型变量, 表明输入值可以为 数字 或者 undefined		
		
		/**
		 * @param {number | undefined } [input=1] 输入值
		 */
		function calculate(input){
			if(Number(input)){
				input = 1;
			}
			return input +1;
		}

4.  描述一个数组		
		
		/**
		 * @param { Number[] }  [input=[]] 输入值
		 */
		function calculate(input){
			var result = 0;
			input.forEach(function(i){
				result = result+i
			});
			return result;
		}

5.  深层次对象		
		
		/**
		 * @param { Object | undefined }  [config = {}] 默认参数
		 * @param { string }  [config.version = 0.0.1 ] 当前版本
		 * @param { int[] } [config.dataSource = []] 数据元
		 * @param { Object } [config.param = {} ] 其他配置
		 */
		function demo(config){
			config = config || {};
			config.version = config.version || "0.0.1";
			config.dataSource = config.version || [];
			return config;
		}

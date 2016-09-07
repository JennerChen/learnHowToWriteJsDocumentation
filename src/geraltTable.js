/**
 * table plugins to generate table 
 * @author Zhang Qing
 * @class
 * @param { Object } options 
 * @param { Object[] } options.dataSource 表格的数据
 * @param { string | HTMLElement } options.selector 选择器, 将表格放入的元素
 * @param { string } [options.tableStyle = TRTD] 表格使用的风格, 默认 trtd 形式 可选 `TRTD` 或者 `DIVCSS`
 * @param { Object } options.rowMap 表格映射的关系
 * @param { Function | undefined } [options.rowCreated = null] 每一行创建完之后的回调函数, 该方法一般用于行上的事件绑定
 * @param { Function | undefined } [options.rowCreating = null] 每一行创建时的回调
 * @param { Object | boolean } [options.paging = false ] 是否开启分页
 * @param { boolean } [options.sort = false] 是否有排序
 * @param { Object } [options.settings] 一些额外的参数配置, 用于灵活性配置的
 * @description
 * 		请不要添加额外的dom操作在此插件中,这会影响到其他使用该插件的地方!
 *
 */
var geraltTable = function(options) {
	const COL_HOLDER = 'GERALTTABLE_COL_HOLDER';
	// table tr td 与 div+css区别:
	// tr,td组合表格可以适用于需要rowspan, colspan的复杂条件下使用,其他与div+css表格基本无区别
	// div+css表格优势：布局语义化, 适合SEO, 简化代码
	/////////////////////
	// 默认div布局 //////
	/////////////////////
	const TABLESTYLE = 'TRTD';
	const DIVSTYLE = 'DIVCSS';
	//noinspection JSUnresolvedVariable,JSUnusedLocalSymbols
	var dataSource = options.dataSource,
		selector = options.selector,
		tableStyle = options.tableStyle == TABLESTYLE ? TABLESTYLE : DIVSTYLE,
		// e.g. {'k':v,'k2':v2}
		rowMap = options.rowMap,
		rowCreated = options.rowCreated,
		rowCreating = options.rowCreating,
		// page para
		paging = options.paging,
		sort = options.sort,
		settings = {
			showMultiline: true,
			tableStyle: tableStyle
		},
		// 数据是否来自远程
		dataRemote = options.dataRemote;

	settings = $.extend(settings, options.settings);

	// public method
	var api = {};

	function generateTableRow(rowData) {
		// 如果传入为数组类型 rowMap, 那么为有序表格, 执行有序表格的生成
		if ($.isArray(rowMap)) {
			return generateTableRowUsingArray(rowData);
		}
		var output = settings.tableStyle === DIVSTYLE ? "<div class='tableRow'>" : "<tr>";
		$.each(rowMap, function(k, f) {
			var finalresult = rowData;
			output += settings.tableStyle === DIVSTYLE ? "<div class='tableCol'>" : "<td>";
			// 是否取rowData中的对象元素
			if (k.split('.').length > 1) {
				//取rowData中的对象元素
				$.each(k.split('.'), function(i, val) {
					finalresult = finalresult[val];
				});
			} else {
				if (k == COL_HOLDER || k.split(COL_HOLDER).length === 2) {
					finalresult = rowData;
				} else {
					finalresult = rowData[k];
				}
			}
			if ($.isFunction(f)) {
				// 调用colum的生成函数
				output += f(finalresult, rowData, $(output));
			} else {
				output += finalresult;
			}
			output += settings.tableStyle === DIVSTYLE ? "</div>" : "</td>"
		});
		output += settings.tableStyle === DIVSTYLE ? "</div>" : "</tr>";
		var row = $(output);
		$(selector).append(row);
		if ($.isFunction(rowCreated)) {
			rowCreated(row, rowData);
		}
	}
	// rowMap e.g. [{key:abc,callback:function(d){return d}},{key:ccc, callback: function(d){return d}}]
	function generateTableRowUsingArray(rowData) {
		var output = settings.tableStyle === DIVSTYLE ? "<div class='tableRow'>" : "<tr>";
		$.each(rowMap, function(i, v) {
			var finalresult = rowData;
			output += settings.tableStyle === DIVSTYLE ? "<div class='tableCol'>" : "<td>";
			// 是否取rowData中的对象元素

			finalresult = rowData[v.key];

			if ($.isFunction(v.callback)) {
				// 调用colum的生成函数
				output += v.callback(finalresult, rowData, $(output));
			} else {
				output += finalresult;
			}
			output += settings.tableStyle === DIVSTYLE ? "</div>" : "</td>"
		});
		output += settings.tableStyle === DIVSTYLE ? "</div>" : "</tr>";
		var row = $(output);
		$(selector).append(row);
		if ($.isFunction(rowCreated)) {
			rowCreated(row, rowData);
		}
	}

	function generateTablePagination() {
		// 从远程获取数据
		var result = paging.generateCallback(paging.pagingTemplate, paging.subPageTemplate, api.page);
		$(paging.paginationSelector).append(result);
		paging.generatedCallback(api.page);
	}

	function generateTable() {
		if (paging) {
			api.page.goPage(paging.initPageNumber ? paging.initPageNumber : 1);
			return;
		}
		$(selector).empty();
		$.each(dataSource, function(index, data) {
			generateTableRow(data);
		});
	}

	function draw(ds) {
		$(selector).empty();
		$.each(ds, function(index, data) {
			generateTableRow(data);
		});
		// pagination
		if (paging) {
			if (!paging.paginationSelector) {
				return
			}
			if ($(paging.paginationSelector).html().trim() == "" || api.page.rebuildpager) {
				$(paging.paginationSelector).empty();
				if (paging.removePaginationWhenPageLessThan) {
					var pagelimit = parseInt(paging.removePaginationWhenPageLessThan.total) ? parseInt(paging.removePaginationWhenPageLessThan.total) : 1;
					if (api.page.pageTotal() <= pagelimit) {
						return;
					}
				}
				generateTablePagination();
			}
			if (paging.pagingInfo) {
				paging.pagingInfo(api.page);
			}
		}
	}
	/**
	 * @typedef {Object} geraltTable#page
	 * @property { Function } goPage -  goPage, 更具传入参数, 进行排序. 		  		
	 *                      	`@param { int | string } [num = 1] 页码`				
	 *                      	`@param { int } [p = 20] 默认20页`    
	 *                      	
	 * @property { boolean } [rebuildpager = true] 是否重新构建分页	    
	 */
	/**
	 * 分页相关 api
	 * @public
	 * @name page
	 * @type geraltTable#page
	 * @memberof geraltTable.prototype
	 */
	api.page = function() {
		// page api
		var page = {};
		var pageSize,
			pageNum,
			total = 1;

		if (!paging) {
			return false;
		}
		page.rebuildpager = true;
		//noinspection JSUnusedLocalSymbols
		page.goPage = function(num, p) { //去目标页
			switch (num) {
				case "prev":
					if (pageNum <= 1) {
						return false;
					}
					num = (--pageNum);
					//page.rebuildpager = (num%10==0);
					break;
				case "next":
					if (total && total == pageNum) {
						return false;
					}
					num = (++pageNum);
					//page.rebuildpager = (num%10==1);
					break;
				case "first":
					if (pageNum <= 1) {
						return false;
					}
					num = 1;
					break;
				case "last":
					if (num == total) {
						return false;
					}
					num = total;
					break;
				default:
					num = parseInt(num) ? parseInt(num) : 1;
					break;
			}
			if (dataRemote) {
				var dataUrl = dataRemote.url,
					params = {},
					loadingTemp = dataRemote.loading ? $(dataRemote.loading()) : undefined;
				if (paging) {
					params[dataRemote.pageNumName_req] = num;
					params[dataRemote.pageSizeName_req] = pageSize;
					if (dataRemote.extraParam) {
						params = _.extend({}, params, dataRemote.extraParam(params))
					}
				}
				if (loadingTemp) {
					$(selector).closest('.tableContainer').parent().append(loadingTemp);
				}
				$(selector).css('opacity', '0.8');
				$.ajax({
						url: dataUrl,
						type: 'GET',
						dataType: 'json',
						data: params
					})
					.done(function(data) {
						if (loadingTemp) {
							$(loadingTemp).remove()
						}
						$(selector).css('opacity', '1');
						var result = dataRemote.callback(data);
						if (!result) return false;
						dataSource = result.dataSource;
						// set meta data if needs later
						data = result.metaData ? result.metaData : data;
						// update paging details					
						total = Math.ceil(data[dataRemote.pageTotal] / pageSize);
						pageNum = data[dataRemote.pageNumName];
						pageSize = data[dataRemote.pageSizeName];
						// draw table
						draw(dataSource)
					})
					.fail(function() {
						console.log("error");
					});
				return true;
			}
			if ((total = Math.ceil(dataSource.length / pageSize)) >= num) {
				var nowDs = dataSource.slice((num - 1) * pageSize, pageSize * num);
				pageNum = num;
				draw(nowDs);
				//totalSize=dataSource.length;
			} else {
				return false;
			}
		};
		page.pageSize = function(psize) { //每页显示数量
			if (psize) {
				pageSize = psize;
				return page;
			}
			return pageSize;
		};
		page.pageNum = function(pnum) { //当前页码
			if (pnum) {
				pageNum = pnum;
				return page;
			}
			return pageNum;
		};
		page.pageTotal = function(ptotal) { //总共页数
			if (ptotal) {
				total = ptotal;
				return page;
			}
			return total;
		};
		page.initpage = function() {
			pageSize = paging.pageSize;
			pageNum = 1;
		}();
		// 获取默认分页数组信息的方法,
		// @example
		// 	当前页: pageNum: 5 ,共有: pTotal 20
		// 	=> result: [1,2,3,4,5,6,7,"...","20"];
		// @return {[int]}
		page.getDefaultPagingNumbersArr = function() {
			return ["\«", "\‹", pageNum, "\›", "\»"];
		};
		/**
		 * 返回分页信息
		 * @version 2
		 * @returns {Array}
		 */
		page.getPagingNumbersV2 = function() {
			var nums = [];
			var pNum = pageNum,
				pTotal = total;
			if (pNum <= 6) {
				if (pNum < pTotal) {
					nums = nums.concat(_.range(1, pNum + 1));
					if (pNum + 3 < pTotal) {
						nums = nums.concat([pNum + 1, pNum + 2, "...", pTotal]);
					} else {
						nums = _.range(1, pTotal + 1);
					}
				} else {
					nums = _.range(1, pTotal + 1);
				}
			} else {
				nums = nums.concat([1, 2, 3, "..."]).concat([pNum - 2, pNum - 1, pNum]);
				if (pNum + 2 < pTotal) {
					nums = nums.concat([pNum + 1, pNum + 2]);
					if (pNum + 3 < pTotal) {
						nums = nums.concat(["...", pTotal])
					} else {
						nums = nums.concat([pTotal]);
					}
				} else {
					nums = nums.concat(_.range(pNum + 1, pTotal + 1))
				}
			}
			return nums;
		};
		return page;
	}();
	/**
	 * @typedef {Object} geraltTable#sort
	 * @property { Function } sortBy -  sortBy, 更具传入参数, 进行排序. 		  		
	 *                      	`@param {string } sortKey 按照哪个字段排序`				
	 *                      	`@param {string } [scend = ASC] 排序方式, 默认 ASC`    
	 *                      	`@example sort.sortBy("apple", "ASC")` 以apple字段升序进行重新排序		
	 *                      			    
	 */
	/**
	 * 排序api, 表格关于排序的api
	 * @public
	 * @name sort
	 * @type geraltTable#sort
	 * @memberof geraltTable.prototype
	 */
	api.sort = function() {
		var sortApi = {};
		if (!sort) return;
		if (dataRemote) {
			console.log('under implementing ....');
			return;
		}
		/**
		 * sortBy, 更具传入参数, 进行排序
		 * @public 
		 * @function sortBy
		 * @memberof geraltTable.prototype.sort
		 * @param  { string }   sortKey  [description]
		 * @param  { string }   scend    [description]
		 */
		sortApi.sortBy = function(sortKey, scend) {
			if (!rowMap.hasOwnProperty(sortKey)) return;
			if (!(scend === 'DESC' || scend === 'ASC')) {
				scend = 'ASC';
			}
			switch (scend) {
				case 'DESC':
					dataSource = _.sortBy(dataSource, sortKey).reverse();
					break;
				default:
					dataSource = _.sortBy(dataSource, sortKey);
			}
			generateTable();
		};
		return sortApi;
	}();
	/**
	 * 更具传入的 data，重新绘制新的table
	 * @public
	 * @name  draw
	 * @function
	 * @memberof geraltTable.prototype
	 * @param  { Object[] } data 相当于 dataSource
	 */
	api.draw = function(data) {
		draw(data);
	};
	
	/**
	 * 刷新表格, 去第一页		
	 * _仅有当 dataRemote模式时, 有效, 否则返回 false_
	 * @public
	 * @name  flush
	 * @function
	 * @memberof geraltTable.prototype 
	 */
	api.flush = function() {
		if (!dataRemote) return false;
		api.page.goPage(1);
		if (paging) {
			if ($(paging.paginationSelector).length == 1) {
				$(paging.paginationSelector).empty();
				generateTablePagination();
			}
		}
	};
	/**
	 * 销毁/删除 表格
	 * @param  {Function} [callback=null] 当表格已经销毁时的回调, 
	 * @public
	 * @name  destory
	 * @function
	 * @memberof geraltTable.prototype 
	 */
	api.destory = function(callback) {
		$(selector).empty();
		if (paging && paging.paginationSelector) {
			$(paging.paginationSelector).empty();
		}
		if (callback) {
			callback();
		}
	};
	/**
	 * 该种table适用于动态添加数据的情况以(DataSource初始化) 		
	 * mergeDs会和现有数据合并,并且可以根据params中的参数选择性的插入位置,默认最前 `head`
	 * @public
	 * @name  dynamicUpdate
	 * @function
	 * @memberof geraltTable.prototype 
	 * @param  {Object[]} mergeDs 新加入的 Datasource
	 * @param  {Object} params  可选参数
	 * @param { string } [params.position = 'head'] 新数据加入的位置 `head` | `end` 
	 * @param { int } [params.pNumber = 1 ] 生成表格后显示哪一页
	 * @param { Function } [params.custMerge = null ] 如何改参数存在, 那么 需要自定义 如何合并, 并且将 结构返回			
	 * 					`@param { Array[] } dataSource 现在的数据`		
	 * 					`@return { Array[] } 新的数据`
	 */
	api.dynamicUpdate = function(mergeDs, params) {
		var position = "head",
			pNumber = 1;

		if (!mergeDs) {
			console.info("invalid merge datasource");
			return;
		}
		if (params) {
			if (params.position == "end") {
				position = "end";
			}
			if (params.pNumber && parseInt(params.pNumber)) {
				pNumber = parseInt(params.pNumber);
			}
			if (params.custMerge) {
				// 自定义数据合并的方法
				dataSource = params.custMerge(dataSource);
				api.page.goPage(pNumber);
				return;
			}
		}
		switch (position) {
			case "head":
				dataSource = mergeDs.concat(dataSource);
				break;
			case "end":
				dataSource = dataSource.concat(mergeDs);
				break;
		}
		api.page.goPage(pNumber);
	};
	// api.searchFilter(params)
	generateTable();
	return api;
};
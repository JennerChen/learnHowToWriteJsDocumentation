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
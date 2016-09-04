/**
 * @file Manages the configuration settings for the widget.
 * @author Rowina Sanela 
 */

/**
 * Returns the sum of a and b
 * @param {Number} a
 * @param {Number} b
 * @param {Boolean} retArr If set to true, the function will return an array
 * @returns {Number|Array} Sum of a and b or an array that contains a, b and the sum of a and b.
 */
function sum(a, b, retArr) {
    if (retArr) {
        return [a, b, a + b];
    }
    return a + b;
}

/**
 * 
 * this is a common function 
 */
var good = function(){
	console.log("this is a function ")
}
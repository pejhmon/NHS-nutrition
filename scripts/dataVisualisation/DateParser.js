function DateParser() {}

DateParser.prototype.parse = function(originalDate) {
	return d3.time.format("%Y%m%d").parse;
}
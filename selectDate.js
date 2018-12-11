/**
 * author: 三味
 * url: www.iduhua.com
 */
;(function($) {
	"use strict";

	function selectorDate(element, settings) {
		this.element = element;
		this.defaults = {
			minYear: 1900, //最小年 默认1900
			maxYear: (new Date).getFullYear(), //最大年
			yearClass: "yearDate", //年
			monthClass: "monthDate", //月
			dayClass: "dayDate", //天
			dataClass: "dataDate", //input
			dateJoin: "-", //数据连接
			today: true, //是否开启当前时间 默认为true
			//自定义设置时间  开启会优先于 默认时间
			newDate: {
				state: false, //自定义设置时间 默认关闭
				year: 1990, //自定义年
				month: 1, //自定义月
				days: 1, //自定义年
			},
		};
		this.options = $.extend({}, this.defaults, settings || {});
	};

	selectorDate.prototype.createDOM = function(callback) {

		var $this = this;

		var $selectDom = $('' +
			'<select class="' + this.options.yearClass + '">' +
			'	<option value="">请选择</option>' +
			'</select>&nbsp年&nbsp' +
			'<select class="' + this.options.monthClass + '">' +
			'	<option value="">请选择</option>' +
			'</select>&nbsp月&nbsp' +
			'<select class="' + this.options.dayClass + '">' +
			'	<option value="">请选择</option>' +
			'</select>&nbsp日&nbsp' +
			'<input type="hidden" class="' + this.options.dataClass + '"/>');

		this.element.append($selectDom);

		var yearClass = this.element.find('.' + this.options.yearClass + ''),
			monthClass = this.element.find('.' + this.options.monthClass + ''),
			dayClass = this.element.find('.' + this.options.dayClass + ''),
			dataClass = this.element.find('.' + this.options.dataClass + '');

		if(this.options.today && !this.options.newDate.state) {
			var todate = new Date(),
				toyear = todate.getFullYear(),
				tomonth = (todate.getMonth() + 1 < 10 ? '0' + (todate.getMonth() + 1) : todate.getMonth() + 1),
				today = todate.getDate();
		}

		if(this.options.newDate.state) {
			var toyear = this.options.newDate.year,
				tomonth = this.options.newDate.month,
				today = this.options.newDate.days;
		}

		for(var i = this.options.maxYear; i >= this.options.minYear; i--) {
			var yearOption = $("<option value=" + i + ">" + i + "年</option>");
			yearClass.append(yearOption);

			if(this.options.today || this.options.newDate.state) {
				if(toyear == i) {
					//年DOM
					yearClass.find("option[value=" + toyear + "]").prop("selected", "selected");
					//月DOM
					this.addOption(12, '月', monthClass);
					monthClass.find("option[value=" + tomonth + "]").prop("selected", "selected");
					//天DOM
					this.selectMonth(toyear, tomonth, dayClass);
					dayClass.find("option[value=" + today + "]").prop("selected", "selected");
					//默认日期
					dataClass.attr("data-date", toyear + this.options.dateJoin + tomonth + this.options.dateJoin + today);
				};
			};
		};

		yearClass.on("change", function() {
			if($(this).val() == "") {
				$this.removeOption(monthClass);
				$this.removeOption(dayClass);
				return false;
			};
			$this.removeOption(monthClass);
			$this.addOption(12, '月', monthClass);
			$this.removeOption(dayClass);
		});

		monthClass.on("change", function() {
			var year = yearClass.find("option:selected").val(),
				month = monthClass.find("option:selected").val();
			$this.removeOption(dayClass);
			$this.selectMonth(year, month, dayClass);
		});

		dayClass.on("change", function() {
			if($(this).val() != "" || $(this).val() != "undefined") {
				dataClass.attr("data-date", yearClass.val() + $this.options.dateJoin + monthClass.val() + $this.options.dateJoin + $(this).val());
			}
		});
	};

	selectorDate.prototype.addOption = function(num, unit, ele) {
		for(var i = 1; i <= num; i++) {
			var options = $("<option value=" + i + "></option>");
			if(i < 10) {
				i = '0' + i
			}
			options.html(i + unit);
			$(ele).append(options);
		}
	};

	selectorDate.prototype.removeOption = function(ele) {
		var options = $(ele).find('option');

		for(var i = 1; i < options.length; i++) {
			$(ele).find(options[i]).remove();
		}
	};

	selectorDate.prototype.selectMonth = function(year, month, dayClass) {
		if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
			this.addOption(31, '日', dayClass)
		} else if(month == 4 || month == 6 || month == 9 || month == 11) {
			this.addOption(30, '日', dayClass)
		} else if(month == 2) {
			if((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
				this.addOption(29, '日', dayClass)
			} else {
				this.addOption(28, '日', dayClass)
			}
		}
	};

	$.fn.selectDate = function(options) {
		var selector = new selectorDate(this, options);
		
		return selector.createDOM();
	};
})(jQuery)
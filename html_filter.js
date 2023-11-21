var HtmlFilter = function() {
	//すべて小文字で定義すること。

	//許可タグ
	this.allowed_html = {
		'b' : {'style' : {}},
		'strong' : {'style' : {}},
		'i' : {'style' : {}},
		'em' : {'style' : {}},
		'u' : {'style' : {}},
		'div' : {'style' : {}},
		'p' : {'style' : {}},
		'span' : {'style' : {}},
		'ul' : {'style' : {}},
		'ol' : {'style' : {}},
		'li' : {'style' : {}},
		'sub' : {'style' : {}},
		'sup' : {'style' : {}},
		'strike' : {'style' : {}},
		'br' : {'style' : {}},
		'blockquote' : {'style' : {}},
		'img' : {
			'src' : {'starts_with':['file://']},
			'style' : {},
			'width' : {},
			'height' : {}
		},
		'font' : {
			'size' : {},
			'style' : {},
			'color' : {}
		}
	};
	//許可プロトコル
	this.allowed_protocols = {
		'file' : '1',
		'color' : '1',
		'width' : '1',
		'height' : '1',
		'background-color' : '1',
		'margin-left' : '1',
		'margin-right' : '1',
		'text-align' : '1'
	};

	this.setAllowedHtml = function(allowed_html) {
		this.allowed_html = allowed_html;
	}

	this.setAllowedProtocols = function(allowed_protocols) {
		this.allowed_protocols = allowed_protocols;
	}
	
	/**
	 * フィルタリング実行
	 */
	this.execute = function(html) {
		var resultHtml = this.process_all_tag(html, this.allowed_html, this.allowed_protocols);
		//jquery convert
		var jqueryObject = $('<root />').html(resultHtml);
		return jqueryObject.html();
	}

	this.process_all_tag = function(html, allowed_html, allowed_protocols) {
		var quote_escaped_html = this.escape_html(html);
		var rsingleTag = /(?:(<!.*?>|<(\/?)((\w+))[^>]*>|[^<]+|<))/g;
		var evalstring = quote_escaped_html.replace(rsingleTag, 'this.judge_tag("$3","$1",allowed_html,allowed_protocols)+');
		var _html = '';
		eval('_html=' + evalstring + '""');
		return _html;
	}

	this.judge_tag = function(tagName, html, allowed_html, allowed_protocols) {
		try {
			if (this.is_empty(tagName)) {
				return html;
			}
			if (allowed_html != null && allowed_html[tagName.toLowerCase()]) {
				var quote_escaped_html = this.escape_html(html);
				var rattributes = /(?:((\w{1,})[\s\\\\n]*=[\s]*(?:\\\"([^\"]*)\\\"|'([^']*)'|([^\ \>]+)))|\ \w{1,}[\ |\/])/g;
				var evalstring = quote_escaped_html.replace(rattributes, '"+this.judge_attributes(tagName,"$2","$3$4$5","$1",allowed_html,allowed_protocols)+"'); //"
				var _html = '';
				eval('_html="' + evalstring + '"');
				return _html;
			}
			return '';
		} catch (e) {
			return '';
		}
	}

	this.judge_attributes = function(tagName, attributeName, attributeValue, html, allowed_html, allowed_protocols) {
		if (this.is_empty(attributeName)) {
			return '';
		}
		allowed_attributes = allowed_html[tagName.toLowerCase()];
		if (allowed_attributes != null && allowed_attributes[attributeName.toLowerCase()]) {
			/*
			 * validates attribute-value
			 */
			if (!this.is_valid_attribute_value(tagName, attributeName, attributeValue, allowed_html)) {
				return '';
			}
			
			var quote_escaped_html = this.escape_html(attributeValue);
			var r_protocols = /([-a-zA-Z0-9]{3,})(\ ?:)/g;
			var evalstring = quote_escaped_html.replace(r_protocols, '"+this.judge_protocol("$1","$1$2",allowed_protocols)+"');
			var _attributeValue = '';
			eval('_attributeValue="' + evalstring + '"');
			var _html = html.replace(attributeValue, _attributeValue);
			return _html;
		}
		return '';
	}

	this.judge_protocol = function(protocolName, html, allowed_protocols) {
		if (this.is_empty(protocolName)) {
			return '';
		}
		if (allowed_protocols != null && allowed_protocols[protocolName.toLowerCase()]) {
			return html;
		}
		return '';
	}

	this.escape_html = function(html) {
		if (html == null || html == '') {
			return '';
		}
		return html.replace(/\\/g,'\\\\').replace(/\"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r'); //'
	}

	this.is_valid_attribute_value = function(tagName, attributeName, attributeValue, allowed_html) {
		var allowed_attributes = allowed_html[tagName.toLowerCase()];
		if (allowed_attributes != null && allowed_attributes[attributeName.toLowerCase()]) {
			var validate_definition = allowed_attributes[attributeName.toLowerCase()];
			if (validate_definition == null) {
				return false;
			}
			//starts_with
			if (validate_definition['starts_with']) {
				var is_valid = false;
				jQuery.each(validate_definition['starts_with'], function() {
					if (attributeValue.indexOf(this) == 0) {
						is_valid = true;
					}
				});
				if (!is_valid) return false;
			}
			return true;
		}
		return false;
	}

	this.is_empty = function(str) {
		if (str == null) return true;
		if (str.length == 0) return true;
		return false;
	}
}

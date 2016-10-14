'use strict';

module.exports = stringify;

function stringify( opts ){
	opts = opts || {};

	var indent = opts.indent || '';
	var open = opts.open || '';
	var separator = opts.separator || '\n';
	var close = opts.close || '';
	var stringifier = opts.stringifier || JSON.stringify;

	return function( read ){
		var opened = false;
		var closed = false;

		return function( abort, cb ){
			if (closed)
				return cb(true);

			read(abort, function( end, data ){
				if (end !== null) {
					if (end === true)
						return (closed = true) && cb(null, opened
							? close
							: open+close);

					return cb(end);	// error
				}

				var json = stringifier(data, null, indent);

				if (!opened)
					return (opened = true) && cb(null, open+json);

				return cb(null, separator+json);
			});
		}
	}
}

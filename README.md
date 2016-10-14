# JSON stringify for pull-streams

JSON serialize a pull-stream.

```js
const pull = require('pull-stream');
const stringify = require('pull-json-stringify');

const data = [
	{ name: 'LEGO' },
	{ name: 'IKEA' },
];

pull(
	pull.values(data),
	stringify(),
	pull.concat(( err, json ) => console.log(json))
	/*
	{"name":"LEGO"}
	{"name":"IKEA"}
	*/
);

pull(
	pull.values(data),
	stringify({
		open: '[\n',
		close: '\n]',
		separator: ',\n',
	}),
	pull.concat(( err, json ) => console.log(json))
	/*
	[
	{"name":"LEGO"},
	{"name":"IKEA"}
	]
	*/
);
```

The [ndjson](http://ndjson.org) format is the default.

The second example produces valid JSON.

Both formats are parsable using
[pull-json-parse](https://github.com/srcagency/pull-json-parse), the second
example's format being useful for having JSON compatibility while enjoying
simple newline based parsing.

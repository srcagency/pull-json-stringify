'use strict';

var test = require('tape');
var pull = require('pull-stream');

var stringify = require('./');

var data = [
	{
		age: 25,
	},
	{
		age: 24,
	},
];

test('Default', function( t ){
	t.plan(1);

	pull(
		pull.values(data),
		stringify(),
		pull.concat(function( err, data ){
			t.equal(data, '{"age":25}\n{"age":24}\n');
		})
	);
});

test('Options', function( t ){
	t.plan(1);

	pull(
		pull.values(data),
		stringify({
			indent: '->',
			open: '(',
			separator: ',',
			close: ')',
			stringifier: function( value, replacer, indent ){
				return indent+value.age;
			},
		}),
		pull.concat(function( err, data ){
			t.equal(data, '(->25,->24)');
		})
	);
});

test('Zero item with defaults', function( t ){
	t.plan(1);

	pull(
		pull.values([]),
		stringify(),
		pull.concat(function( err, data ){
			t.equal(data, '\n');
		})
	);
});

test('One item with defaults', function( t ){
	t.plan(1);

	pull(
		pull.values([ 'A' ]),
		stringify(),
		pull.concat(function( err, data ){
			t.equal(data, '"A"\n');
		})
	);
});

test('Zero items with custom `open`, `close` and `separator`', function( t ){
	t.plan(1);

	pull(
		pull.values([]),
		stringify({
			open: '(',
			close: ')',
			separator: ',',
		}),
		pull.concat(function( err, data ){
			t.equal(data, '()');
		})
	);
});

test('One item with custom `open`, `close` and `separator`', function( t ){
	t.plan(1);

	pull(
		pull.values([ 'A' ]),
		stringify({
			open: '(',
			close: ')',
			separator: ',',
		}),
		pull.concat(function( err, data ){
			t.equal(data, '("A")');
		})
	);
});

test('Stream using `undefined` as "end" argument', function( t ){
	t.plan(1);
	var c = 0

	pull(
		(end, cb) => {
			if (end) return cb(end)
			if (c === 3) return cb(true)
			cb(undefined, c++)
		},
		stringify(),
		pull.concat(function( err, data ){
			t.equal(data, '0\n1\n2\n');
		})
	);
});

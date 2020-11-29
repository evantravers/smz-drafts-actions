var fs = require("fs")
var vm = require('vm')

vm.runInThisContext(fs.readFileSync('./api.js'))

var draft1 = {};
draft1.content =
`This ought to be a title

This ought to be content.

There should be no confusion.
`;

var draft2 = {};
draft2.content =
`#This ought to be a title

This ought to be content.

There should be no confusion.
`;
draft2.lines = draft2.content.split("\n")

var draft3 = {}
draft3.content =
`---
title: foobar: the bedoubling
aliases: ['foobar', 'jane']
tags: ['#foo', '#bar']
id: 2020112844939
---

Testing to see if there's lots of things here that I could add

This should be content
`
draft3.lines = draft3.content.split("\n")

console.log(Zettel.__split(draft3));

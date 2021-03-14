const yaml = {
  extract: function(d = draft) {
    let start = d.lines.indexOf("---") + 1
    let end = d.lines.indexOf("---", start)
    return d.lines.slice(start, end).join("\n")
  },
  loadFrontmatter: function(d = Draft) {
    return yaml.load(yaml.extract(d))
  },
  load: function(str) {
    return parser.obj(parser.tokenize(str)).binding;
  },
  dump: function(obj) {
    // for key in obj
    let y = "";
    for (key in obj) {
      y += `${key}: `
      if (Array.isArray(obj[key])) {
        y += `\n${obj[key].map(v => "- " + v).join("\n")}`
      } else if (obj[key]. match(/[':#]/)) {
        y += `"${obj[key]}"`
      } else if (obj[key]. match(/"/)) {
        y += `'${obj[key]}'`
      } else {
        y += `${obj[key]}`;
      }
      y += "\n";
    }
    return y.trim();
  }
};

// private ==========
const parser = {
  tokenize: function(str) {
    console.log(str.split(/\s/));
    return {
      tokens: str.split(/\s/),
      binding: {}
    }
  },

  next: function(b) {
    return b.tokens.shift();
  },

  // obj(binding)
  obj: function(b) {
    // should expect an key and a value, in this context is essentially assignment
    // FIXME: replace is kluge
    let token = parser.next(b).replace(":", "");
    
    b.binding[token] = parser.val(b);
    return b;
  },

  val: function(b) {
    console.log(JSON.stringify(b))
    // need to account for:
    // strings with or without quotes
    // lists
    let token = parser.next(b);
    console.log(token);
    return b;
  }
};

draft = {
  content: `---
title: This is a Test
tags:
- foo
- "#bar"
aliases:
---

# title

Paragraph`,
}
draft.lines = draft.content.split("\n")

console.log(yaml.loadFrontmatter(draft))

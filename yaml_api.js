const yaml = {
  extract: function(d = draft) {
    let start = d.lines.indexOf("---") + 1
    let end = d.lines.indexOf("---", start)
    return d.lines.slice(start, end).join("\n")
  },

  content: function(d = draft) {
  return d.content.replace(`---\n${yaml.extract(d)}\n---\n\n`, "");
  },

  loadFrontmatter: function(d = Draft) {
    return yaml.load(yaml.extract(d))
  },

  dumpFrontmatter: function(meta) {
    if (Object.keys(meta) === 0) {
      return '';
    } else {
      return `---\n${yaml.dump(meta)}\n---\n\n`;
    }
  },

  load: function(str) {
    return parser.parse(str)
  },

  dump: function(obj) {
    // for key in obj
    let y = "";
    for (key in obj) {
      y += `${key}: `
      if (Array.isArray(obj[key])) {
        y += `\n${obj[key].map(v => "- " + v).join("\n")}`
      } else if (obj[key]. match(/'|:|#/)) {
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
  parse: function(str) {
    let json =
      str.split("\n").reduce(function(binding, line) {
        line = line.trimEnd();

        // start of a list
        if (line.match(/^\w*:$/)) {
          let token = line.match(/(\w.*):/)[1];
          binding[token] = []
          binding.tmpVar = token;
        }
        // start of a list item
        else if (line.match(/^- .*$/)) {
          let val = line.match(/^- (.*)$/)[1];
          binding[binding.tmpVar].push(val)
        }
        // start an assignment
        else if (line.match(/^\w.+: ?.*$/)) {
          let token = line.match(/^(\w.+): ?.*$/)[1]
          let val   = line.match(/^\w.+: ?(.*)$/)[1]

          binding[token] = val;
        }
        else {
          console.error("Couln't match " + line);
        }

        return binding;
      }, {});

    // cleanup
    delete json.tmpVar;

    return json;
  }
};

draft = {
  content: `---
id: 202101312155
title: Leadership Strategy and Tactics
started: January 31, 2021
tags:
- #booknote"
- "#book"
subtitle: Field Manual
authors: Jocko Willink
publisher: St. Martin's Press
year: 2020
identifier: 9781250226853
completed: N/A
---

# Leadership Strategy and Tactics by Jocko Willink

Testing a paragraph below`,
}
draft.lines = draft.content.split("\n")

testJson = yaml.loadFrontmatter(draft)
console.log(yaml.content(draft));

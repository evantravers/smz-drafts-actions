var Zettel = {};

// get_meta(Draft) :: Object
Zettel.get_meta = function(d) {
  let meta = {};
  let meta_string = Zettel.__split(d).meta

  if (meta_string) {
    meta_string
      .split("\n")
      .map(function(s) {
        let sp = s.search(/: /, 2);
        let key = s.slice(0, sp)
        let val = s.slice(sp+2, s.length);

        if (key) { meta[key] = val; }
      });
  }
  return meta;
}

// set_meta(Draft, Object) :: Draft
// This is to completely set the meta block for a draft entirely.
Zettel.set_meta = function(d, new_meta) {
  let meta = Object.entries(new_meta).map(m => m.join(": ")).join("\n");
  d.content = `---\n${meta}\n---\n${Zettel.content(d)}`
}

// update_meta(Draft, String, Any) :: Draft
// This is to update a single key/value pair in a draft.
Zettel.update_meta = function(d, key, value) {
  let meta = Zettel.get_meta(d);
  meta[key] = value;
  Zettel.set_meta(d, meta);
}

// __split(Draft) :: {meta: String, content: String}
Zettel.__split = function(d) {
  let start = d.lines.indexOf('---');
  let end = d.lines.slice(start+1, d.lines.length).indexOf('---');

  let meta = d.lines.slice(start+1, end+1).join("\n").trim()
  let content = d.lines.slice(end+2, d.lines.length).join("\n").trim()

  return { meta: meta, content: content }
}

// content(Draft) :: String
Zettel.content = function(d) {
  if (Zettel.__split(d).meta) {
    return Zettel.__split(d).content;
  }
  else {
    return d.content
  }
}

// title(Draft) :: String
Zettel.title = function(d) {
  if (Zettel.get_meta(d).title) {
    return Zettel.get_meta(d).title
  }
  else {
    return d.displayTitle;
  }
}

// id(Draft) :: String
Zettel.id = function(d) {
  if (Zettel.get_meta(d).id) {
    return Zettel.get_meta(d).id
  }
  else {
    return strftime(d.createdAt, "%Y%m%d%H%M").toString()
  }
}

// filename(Draft) :: String
Zettel.filename = function(d) {
  let title =
    Zettel.title(d)
      .toLowerCase()
      .replace(/[^a-z0-9_\s]/g, '')
      .replace(/\s+/g, '-');
  return `${Zettel.id(d)}-${title}.md`;
}

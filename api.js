var Zettel = {};

// render(Object) :: nil
// takes the object {meta: Object, content: String} and
// "renders" the content.
Zettel.render = function(obj) {
  let meta =
    Object.entries(obj.meta)
      .map(([k, v]) => `${k}: ${Zettel.__render_meta(v)}`)
      .join("\n");

  return `---\n${meta}\n---\n\n${obj.content}`;
}

// __render_meta(Any) :: String
Zettel.__render_meta = function(val) {
  val = JSON.stringify(val);
  return val.slice(1, val.length-1); // remove ".*"
}

// update_meta(Draft, String, Any) :: Draft
// This is to update a single key/value pair in a draft.
Zettel.update_meta = function(d, key, value) {
  let z = Zettel.parse(d);
  z.meta[key] = value;
  Zettel.render(z);
}

// __parse_meta(String) :: Object
Zettel.__parse_meta = function(meta_string) {
  if (meta_string) {
    meta = {}
    meta_string
      .split("\n")
      .map(function(s) {
        let sp = s.search(/: /, 2);
        let key = s.slice(0, sp)
        let val = s.slice(sp+2, s.length);

        if (key) { meta[key] = val; }
      });
    return meta;
  }
  else {
    return null;
  };
}

// parse(Draft) :: {meta: Obj, content: String}
Zettel.parse = function(d) {
  let meta = {};
  let content = d.content;

  let start = d.lines.indexOf('---');
  if (start != -1) {
    let end = d.lines.slice(start+1, d.lines.length).indexOf('---');
    if (end != -1) {
      meta = d.lines.slice(start+1, end+1).join("\n").trim()
      content = d.lines.slice(end+2, d.lines.length).join("\n").trim()

      meta = Zettel.__parse_meta(meta);
    }
  }

  if (!meta.id) {
    meta.id = strftime(d.createdAt, "%Y%m%d%H%M").toString()
  }

  if (!meta.title) {
    meta.title = d.displayTitle;
  }

  return { meta: meta, content: content }
}

// filename(Draft) :: String
Zettel.filename = function(d) {
  let z = Zettel.parse(d)
  let title =
    z.meta.title
      .toLowerCase()
      .replace(/[^a-z0-9_\s]/g, '')
      .replace(/\s+/g, '-');
  return `${z.id}-${title}.md`;
}


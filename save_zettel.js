var path = "/wiki/";

let zettel = Zettel.parse(draft);
if (!draft.hasTag("link")) {
  zettel.meta.aliases = [zettel.meta.title];
}

// delete unneeded references
if (draft.hasTag("bible")) {
  zettel.content = editor.arrange(zettel.content);
}

if (draft.tags) {
  let tags = '' + draft.tags
  tags
    .split(',')
    .map(function(str) {
      let tag = 
        str.replace("#", "");
        if (tag) {
                Zettel.pushTag(zettel, `#${tag}`);
        }
    })
}

var filename = Zettel.filename(zettel);

Zettel.update(zettel);

var db = Dropbox.create();
var check = db.write(path + filename, draft.content, "append");

if (!check) {
  alert("Couldn't save to " + path + filename);
}
  else {
  draft.isArchived = true;
  draft.update();
}


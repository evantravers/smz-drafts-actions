let workspace = Workspace.find("Booknotes");
let booknotes = workspace.query("inbox");

let bookTitles = [];
for (let booknote of booknotes) {
bookTitles.push(Zettel.parse(booknote).meta.title);
}

var p = Prompt.create();

p.addLabel("title", "Choose booknote:");

p.addSelect(
  "selectBook",
  "Book:",
  bookTitles,
  [],
  false);

p.addButton("Choose Book", 1, true);

p.show();

if (p.buttonPressed == 1) {

  let bookIndex = booknotes.findIndex(bk => Zettel.parse(bk).meta.title == p.fieldValues["selectBook"]);
  let book = booknotes[bookIndex];
  let booknote = Zettel.parse(book);
  let child = Zettel.parse(draft)

  // - Adds a citation to the book to the current note.
  draft.content = draft.content + `\n\n${Booknotes.mla(booknote.meta, Zettel.filename(booknote))}`;

  // - Adds a link to this zettel in the main booknote, if there’s a title, uses that as a summary
  book.content = book.content + `\n\n[[${Zettel.filename(child)}|${child.meta.title}]]`
  book.update();
}



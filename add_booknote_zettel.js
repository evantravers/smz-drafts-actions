let book = Booknotes.selectBook();

if (book) {
  let d = Draft.create();
  d.addTag("booknote");
  d.update();
  let z = Zettel.parse(d);
  z.meta.started = strftime(Date.now(), "%F");
  Zettel.pushTag(z, "#booknote");
  Zettel.pushTag(z, "#book");
  z.meta.title = book.title
  z.meta.subtitle = book.subtitle
  z.meta.authors = book.authors
  z.meta.publisher = book.publisher
  z.meta.year = strftime(new Date(book.publishedDate), "%Y")
  z.meta.identifier = book.identifier
  z.meta.started = strftime(new Date(), "%B %d, %Y")
  z.meta.completed = "N/A"
  Zettel.update(z, d);
}

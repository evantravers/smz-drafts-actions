let z = Zettel.parse(draft)
app.setClipboard(`[[${Zettel.filename(z)}]]`)

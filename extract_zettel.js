// get selection
if (editor.getSelectedRange()[1] != 0) {
  // we've selected some lines.
  let selection =
    editor
    .getTextInRange(...editor.getSelectedRange());
    
  // prompt for title, use first line as a default
  let p = Prompt.create();
  p.title = "Extract selection into new note."
  p.addTextField("title", "Set Title for New Zettel", selection.split("\n")[0]);
  p.addButton("Extract", 1);
  
  p.show();
  
  if (p.buttonPressed == 1) {
    let title = p.fieldValues["title"];
  
    // make new draft, copy any MMD tags from the original Zettel.
    let childDraft = Draft.create();
    let childZettel = Zettel.parse(childDraft);
    let parentDraft = draft;
    let parentZettel = Zettel.parse(draft);
    
    childZettel.meta.title = title;
    if (parentZettel.meta.tags) {
      childZettel.meta.tags = parentZettel.meta.tags
    }

    // have link to original zettel in new zettel
    
    childZettel.content = childZettel.content + `\n${selection}\n\n[[${Zettel.filename(parentZettel)}|${parentZettel.meta.title}]]`;
    
    // leave link to new zettel in old zettel with title.
   
  Zettel.update(childZettel, childDraft);
  Zettel.update(parentZettel, parentDraft);
  editor.setTextInRange(...editor.getSelectedRange(), `[[${Zettel.filename(childZettel)}|${childZettel.meta.title}]]\n`);
  };
}


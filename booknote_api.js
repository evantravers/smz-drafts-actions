var Booknotes = {};

Booknotes.__mlaAuthors = function(authors) {
  if (authors) {
    switch (authors.length) {
      case 1: return authors[0]; break;
      case 2: return authors.join(", "); break;
      case 3: return authors[0] + " et al."; break;
    }
  } else {
    return "";
  }
}

// Takes a string, returns the year
Booknotes.__mlaDate = function(d) {
  let date = new Date(d);
  return date.getFullYear();
}

Booknotes.mla = function(data, link = false) {
  let title = `_${data.title}_`;
  
  if (link) {
    title = `_[[${link}|${data.title}]]_`;
  }

  let publishedDate = 'Unknown Year';
  if (data.year) {
    publishedDate = data.year;
  }
  if (data.publishedDate) {
    publishedDate = Booknotes.__mlaDate(data.publishedDate)
  }

  return `${Booknotes.__mlaAuthors(data.authors)}. ${title}. ${data.publisher}, ${publishedDate}.`
}

Booknotes.searchGoogleBooks = function(query) {
  var url = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(query);

  var http = HTTP.create(); //create HTTP object
  var response = http.request({
    "url": url,
    "method": "GET"
  });

  if (response.success) {
    var jsonObj = JSON.parse(response.responseText);
    return jsonObj.items;
  } else {
    return null;
  }
}

Booknotes.findBooks = function(reference) {
  let items = Booknotes.searchGoogleBooks(reference);
  if (items) {
    if (items.length > 5) {
      return items.slice(0, 5);
    }
    else {
      return items
    }
  }
}

Booknotes.selectBook = function(str = null) {
  let googleBooks = Prompt.create();

  googleBooks.addLabel("title", "Search Google Books...");

  googleBooks.addTextField("q", "🔎 ", "")
  googleBooks.addButton("Confirm", 1, true);

  googleBooks.show();

  if (googleBooks.buttonPressed == 1) {

    let search = Booknotes.findBooks(googleBooks.fieldValues["q"]);
    let bookTitles = search.map((b) => Booknotes.mla(b.volumeInfo));

    let bookSelect = Prompt.create();

    bookSelect.addLabel("title", "Choose a match:");

    bookSelect.addSelect(
      "selectBook",
      "Book:",
      bookTitles,
      [],
      false);

    bookSelect.addButton("Select Book", 1, true);

    bookSelect.show();

    if (bookSelect.buttonPressed == 1) {
      let book =
        search.find(b =>
          Booknotes.mla(b.volumeInfo) == bookSelect.fieldValues["selectBook"]).volumeInfo;
      if (book.industryIdentifiers) {
        book.identifier = book.industryIdentifiers[0].identifier;
      }
      console.log(JSON.stringify(book));

      return book;
    }
    else {
      return false;
    }
  }
}


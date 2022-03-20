class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static displayBooks() {
    console.log("data");
    let storedBooks = Store.getBooks();
    let books = storedBooks;
    books.forEach((book) => UI.addBooks(book));
  }
  static addBooks(book) {
    if (!book.title || !book.author) {
      UI.showAlert("Please at least fill the title & Author", "warning");
      return;
    }
    let list = document.getElementById("booklist");
    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td class="btn btn-danger btn-sm delete">X</td>
    `;
    list.appendChild(row);
  }
  static clearFields() {
    document.querySelector("#title").value = null;
    document.querySelector("#author").value = null;
    document.querySelector("#isbn").value = null;
  }
  static deleteBooks(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.remove();
    }
  }
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}

class Store {
  static getBooks() {
    let books;
    if (!localStorage.getItem("books")) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static saveBooks(book) {
    let books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    let books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn == isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

document.addEventListener("DOMContentLoaded", UI.displayBooks);
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;
  const book = new Book(title, author, isbn);
  if (title && author) {
    UI.showAlert("book added successfully", "success");
    Store.saveBooks(book);
  }
  UI.addBooks(book);
  UI.clearFields();
});

document.querySelector("#booklist").addEventListener("click", (e) => {
  UI.deleteBooks(e.target);
  UI.showAlert("book deleted successfully", "danger");
  Store.removeBook(e.target.previousElementSibling.textContent);
});

const STORAGE_KEY = "BOOKSHELF_APPS";

let books = [];

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null)
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function composeBookObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title: title,
        author: author,
        year: year,
        isComplete: isComplete
    };
}

function findBookById(bookId) {
    for (let book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}

function findBookByTitle(bookTitle) {
    for (let book of books) {
        if (book.title === bookTitle)
            return book;
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0
    for (let book of books) {
        if (book.id === bookId)
            return index;
        index++;
    }
    return -1;
}
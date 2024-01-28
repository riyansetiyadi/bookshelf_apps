const UNCOMPLETED_LIST_BOOK_ID = "books";
const COMPLETED_LIST_BOOK_ID = "completed-books";
const BOOK_ITEMID = "itemId";

function makeElementBook(title, author, year, isComplete) {

    const textTitle = document.createElement("h2");
    textTitle.innerText = title;

    const textAuthor = document.createElement("h4");
    textAuthor.innerText = author;

    const textYear = document.createElement("p");
    textYear.innerText = year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textYear);

    const containerButton = document.createElement("div");
    containerButton.classList.add("container-rud-button");

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer, containerButton);

    if (isComplete) {
        containerButton.append(
            createUndoButton(),
            createTrashButton(),
            createEditButton()
        );
    } else {
        containerButton.append(
            createCheckButton(),
            createTrashButton(),
            createEditButton()
        );
    }

    return container;
}

function createUndoButton() {
    return createButton("undo-button", function (event) {
        moveBookToUncompleted(event.target.parentElement.parentElement);
    });
}

function createTrashButton() {
    return createButton("trash-button", function (event) {
        openRemoveDialog(event.target.parentElement.parentElement);
    });
}

function createCheckButton() {
    return createButton("check-button", function (event) {
        moveBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createEditButton() {
    return createButton("edit-button", function (event) {
        openEditDialog(event.target.parentElement.parentElement);
    });
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function clearInput() {
    document.getElementById("title").value = '';
    document.getElementById("author").value = '';
    document.getElementById("year").value = '';
    document.getElementById("checkCompleted").checked = false;
}

function addBook() {
    let textTitle = document.getElementById("title").value;
    let textAuthor = document.getElementById("author").value;
    let textYear = document.getElementById("year").value;
    textYear = parseInt(textYear);
    const textCompleted = document.getElementById("checkCompleted").checked ? true : false;

    const book = makeElementBook(textTitle, textAuthor, textYear, textCompleted);

    if (textCompleted) {
        const completedBOOKList = document.getElementById(COMPLETED_LIST_BOOK_ID);
        completedBOOKList.append(book);
    } else {
        const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
        uncompletedBOOKList.append(book);
    }

    const bookObject = composeBookObject(textTitle, textAuthor, textYear, textCompleted);
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    updateDataToStorage();
    clearInput();
}

function editBook(bookElement) {
    const textTitle = document.getElementById("editTitle").value;
    const textAuthor = document.getElementById("editAuthor").value;
    const textYear = document.getElementById("editYear").value;
    textYear = parseInt(textYear);

    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    const book = findBookById(bookElement[BOOK_ITEMID]);
    const bookObject = composeBookObject(textTitle, textAuthor, textYear, book?.isComplete ?? false);
    books.splice(bookPosition, 1, bookObject);

    updateDataToStorage();
}

function moveBookToCompleted(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const textTitle = bookElement.querySelector(".inner > h2").innerText;
    const textAuthor = bookElement.querySelector(".inner > h4").innerText;
    const textYear = bookElement.querySelector(".inner > p").innerText;

    const elementBook = makeElementBook(textTitle, textAuthor, textYear, true);
    const book = findBookById(bookElement[BOOK_ITEMID]);
    book.isComplete = true;
    elementBook[BOOK_ITEMID] = book.id;
    listCompleted.append(elementBook);

    bookElement.remove();
    updateDataToStorage();
}


function moveBookToUncompleted(bookElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const textTitle = bookElement.querySelector(".inner > h2").innerText;
    const textAuthor = bookElement.querySelector(".inner > h4").innerText;
    const textYear = bookElement.querySelector(".inner > p").innerText;

    const elementBook = makeElementBook(textTitle, textAuthor, textYear, false);
    const book = findBookById(bookElement[BOOK_ITEMID]);
    book.isComplete = false;
    elementBook[BOOK_ITEMID] = book.id;
    listUncompleted.append(elementBook);

    bookElement.remove();
    updateDataToStorage();
}

function removeBook(bookElement) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function refreshDataFromBooks() {
    let listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    listUncompleted.innerText = '';
    listCompleted.innerText = '';

    let searchTerm = document.getElementById('search').value.toLowerCase();

    for (book of books) {
        if (searchTerm == '') {
            appendElementBook(book, listUncompleted, listCompleted);
        } else {
            const bookTitle = book.title.toLowerCase();
            if (bookTitle.includes(searchTerm)) {
                appendElementBook(book, listUncompleted, listCompleted);
            }
        }
    }
}

function appendElementBook(book, listUncompleted, listCompleted) {
    const elementBook = makeElementBook(book.title, book.author, book.year, book.isComplete);
    elementBook[BOOK_ITEMID] = book.id;

    if (book.isComplete) {
        listCompleted.append(elementBook);
    } else {
        listUncompleted.append(elementBook);
    }
}

function openRemoveDialog(bookElement) {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('removeDialog').style.display = 'block';

    let removeDialogButton = document.getElementById('removeDialogButton');
    let cancelRemoveDialogButton = document.getElementById('cancelRemoveDialogButton');

    removeDialogButton.replaceWith(removeDialogButton.cloneNode(true));
    cancelRemoveDialogButton.replaceWith(cancelRemoveDialogButton.cloneNode(true));

    document.getElementById('removeDialogButton').addEventListener('click', function () {
        removeBook(bookElement);
        closeRemoveDialogs();
    });
    document.getElementById('cancelRemoveDialogButton').addEventListener('click', function () {
        closeRemoveDialogs();
    });
}

function closeRemoveDialogs() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('removeDialog').style.display = 'none';
}

function openEditDialog(bookElement) {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('editDialog').style.display = 'block';

    const editTitleElement = document.getElementById("editTitle");
    const editAuthorElement = document.getElementById("editAuthor");
    const editYearElement = document.getElementById("editYear");

    const textTitle = bookElement.querySelector(".inner > h2").innerText;
    const textAuthor = bookElement.querySelector(".inner > h4").innerText;
    const textYear = bookElement.querySelector(".inner > p").innerText;

    editTitleElement.value = textTitle;
    editAuthorElement.value = textAuthor;
    editYearElement.value = textYear;

    let editDialogButton = document.getElementById('editDialogButton');
    let cancelEditDialogButton = document.getElementById('cancelEditDialogButton');
    
    editDialogButton.replaceWith(editDialogButton.cloneNode(true));
    cancelEditDialogButton.replaceWith(cancelEditDialogButton.cloneNode(true));

    document.getElementById('editDialogButton').addEventListener('click', function (event) {
        event.preventDefault();
        editBook(bookElement);
        closeEditDialogs();
        refreshDataFromBooks();
    });
    document.getElementById('cancelEditDialogButton').addEventListener('click', function (event) {
        event.preventDefault();
        closeEditDialogs();
    });
}

function closeEditDialogs() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('editDialog').style.display = 'none';
}
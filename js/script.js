document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("form");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    const searchElement = document.getElementById('search');

    searchElement.addEventListener('input', function (event) {
        event.preventDefault();
        refreshDataFromBooks();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});


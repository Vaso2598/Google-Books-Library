const Google_API_KEY = "AIzaSyC20juLxxzWQGC1YxsweUMsX9v60LcNq8k";

const search = document.getElementById("search");
const searchResults = document.getElementById("results");
const form = document.getElementById("form");
const bookList = document.getElementById("booksByGenre");
const genreName = document.getElementById("genreName");
const genreList = document.getElementById("genre");

/* Searchbar with style */

form.addEventListener("submit", ($e) => {
	$e.preventDefault();
	const searchTerm = search.value;
	if (searchTerm && searchTerm !== "") {
		fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`)
			.then((response) => response.json())
			.then((data) => {
				displayResults(data.items.slice(0, 5));
				darken.style.display = "block";
				searchResults.classList.add("show");
			});
		search.value = "";
	} else {
		window.location.reload();
	}
});

/* Hide results when clicking elsewhere on the page */

document.addEventListener("click", (event) => {
	if (!searchResults.contains(event.target) && event.target !== search) {
		searchResults.classList.remove("show");
		darken.style.display = "none";
	}
});

function displayResults(data) {
	searchResults.innerHTML = "";

	const resultContainer = document.createElement("div");
	resultContainer.classList.add("result-container");
	searchResults.appendChild(resultContainer);

	data.forEach((bookResult) => {
		const bookElement = document.createElement("div");
		bookElement.classList.add("book");
		bookElement.innerHTML = `
            <img src="${bookResult.volumeInfo.imageLinks?.thumbnail}" alt="${
			bookResult.volumeInfo.title || "Book Cover"
		}"> 
            <p class="title">${bookResult.volumeInfo.title}</p>
            <p class="authors">${bookResult.volumeInfo.authors}</p>
        `;

		bookElement.addEventListener("click", () => {
			const bookId = `${bookResult.id}`;
			// console.log(bookId);
			window.location.href = `./details.html?volumeId=${bookId}`;
		});

		resultContainer.appendChild(bookElement);
	});
}

/* Event Listener for genres */

genreList.addEventListener("click", ($e) => {
	// $e.preventDefault();
	const target = $e.target;
	// console.log(target.textContent);
	const genre = `${target.textContent}`;
	// console.log(genre);
	window.location.href = `./genre.html?subject=${genre}`;
});

const urlParams = new URLSearchParams(window.location.search);
const bookGenre = urlParams.get("subject");
// console.log(bookGenre);

/* Fetch books by Genres */

genreName.innerHTML = `${bookGenre}`;

fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${bookGenre}`)
	.then((response) => response.json())
	// .then((data) => console.log(data))
	.then((data) => {
		displayResultsByGenre(data.items);
	});

function displayResultsByGenre(data) {
	// console.log(data);
	bookList.innerHTML = "";
	const booksToShow = data.slice(0, 10);
	booksToShow.map((booksByGenre) => {
		// console.log(booksByGenre);
		const booksByGenreElement = document.createElement("div");
		booksByGenreElement.classList.add("book");
		booksByGenreElement.innerHTML = `
            <img src="${booksByGenre.volumeInfo.imageLinks?.thumbnail}" alt="${
			booksByGenre.volumeInfo.title || "Book Cover"
		}">
            <p class="title">${booksByGenre.volumeInfo.title}</p>
			<p class="authors">${booksByGenre.volumeInfo.authors}</p>
        `;

		booksByGenreElement.addEventListener("click", () => {
			const bookId = `${booksByGenre.id}`;
			console.log(bookId);
			window.location.href = `./details.html?volumeId=${bookId}`;
		});

		bookList.appendChild(booksByGenreElement);
	});
}

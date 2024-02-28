const Google_API_KEY = "AIzaSyC20juLxxzWQGC1YxsweUMsX9v60LcNq8k";

const search = document.getElementById("search");
const searchResults = document.getElementById("results");
const form = document.getElementById("form");
const bookList = document.getElementById("booksByGenre");
const genreName = document.getElementById("genreName");

form.addEventListener("submit", ($e) => {
	$e.preventDefault();
	const searchTerm = search.value;
	if (searchTerm && searchTerm !== "") {
		fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`)
			.then((response) => response.json())
			// .then((data) => console.log(data))
			.then((data) => {
				displayResults(data.items);
			});
		search.value = "";
	} else {
		window.location.reload;
	}
});

function displayResults(data) {
	console.log(data);
	searchResults.innerHTML = "";
	data.map((bookResult) => {
		console.log(bookResult.volumeInfo);
		const bookElement = document.createElement("div");
		bookElement.classList.add("book");
		bookElement.innerHTML = `
            <img src="${bookResult.volumeInfo.imageLinks?.thumbnail}" alt="${
			bookResult.volumeInfo.title || "Book Cover"
		}"> 
            <p class="title">${bookResult.volumeInfo.title}</p>
			<p class="authors">${bookResult.volumeInfo.authors}</p>
        `;
		searchResults.appendChild(bookElement);
	});
}

/* Event Listener for genres */

const genreList = document.getElementById("genre");

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

		bookList.appendChild(booksByGenreElement);
	});
}

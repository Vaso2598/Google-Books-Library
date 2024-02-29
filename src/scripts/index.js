const Google_API_KEY = "AIzaSyC20juLxxzWQGC1YxsweUMsX9v60LcNq8k";
const Nyt_API_KEY = "DeAFDYAoBJe6gYO8gy88zHOH377fhZG0";

const search = document.getElementById("search");
const searchResults = document.getElementById("results");
const form = document.getElementById("form");
const popular = document.getElementById("popular");

/* Searchbar */

form.addEventListener("submit", ($e) => {
	$e.preventDefault();
	const searchTerm = search.value;
	if (searchTerm && searchTerm !== "") {
		fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}:keyes&key=${Google_API_KEY}`)
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

/* Script for bestseller books */

fetch(`https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=${Nyt_API_KEY}`)
	.then((response) => response.json())
	.then((data) => {
		getBestSellersId(data.results);
	});

function getBestSellersId(data) {
	let bookPromises = [];
	data.forEach((bookId) => {
		const isbn10 = bookId.isbns[0]?.isbn10;
		const isbn13 = bookId.isbns[0]?.isbn13;

		let fetchUrl = "";

		if (isbn13) {
			fetchUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn13}`;
		} else if (isbn10) {
			fetchUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn10}`;
		} else {
			console.log("No books found with matching ISBN");
			return;
		}

		bookPromises.push(
			fetch(fetchUrl)
				.then((response) => response.json())
				.then((bookData) => {
					return bookData.items;
				})
				.catch((error) => {
					console.error("Error fetching book data:", error);
					return [];
				})
		);
	});

	Promise.all(bookPromises).then((booksData) => {
		const allBooks = booksData.flat();
		displayBestSellers(allBooks);
	});
}

/* Display best sellers */

function displayBestSellers(bookData) {
	popular.innerHTML = "";
	const booksToShow = bookData.slice(0, 8);
	booksToShow.forEach((bookResult) => {
		// console.log(bookResult);
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
			console.log(bookId);
			window.location.href = `./details.html?volumeId=${bookId}`;
		});

		popular.appendChild(bookElement);
	});
}

/* Event Listener for genres */

const genreList = document.getElementById("genre");

genreList.addEventListener("click", ($e) => {
	$e.preventDefault();
	const target = $e.target;
	// console.log(target.textContent);
	const genre = `${target.textContent}`;
	console.log(genre);
	window.location.href = `./genre.html?subject=${genre}`;
	console.log(window.location.href);
});

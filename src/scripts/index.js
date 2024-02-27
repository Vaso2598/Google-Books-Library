const Google_API_KEY = "AIzaSyCba6TVOGjsMW8yOEJjTE9JXnAvA7mU3JU";
const Nyt_API_KEY = "DeAFDYAoBJe6gYO8gy88zHOH377fhZG0";

const search = document.getElementById("search");
const searchResults = document.getElementById("results");
const form = document.getElementById("form");
const popular = document.getElementById("popular");

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
			<img src="${bookResult.volumeInfo.imageLinks.thumbnail}"> 
			<p>${bookResult.volumeInfo.title}</p>
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
			fetchUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn13}&key=${Google_API_KEY}`;
		} else if (isbn10) {
			fetchUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn10}&key=${Google_API_KEY}`;
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
	bookData.forEach((bookResult) => {
		console.log(bookResult);
		const bookElement = document.createElement("div");
		bookElement.classList.add("book");
		bookElement.innerHTML = `
            <img src="${bookResult.volumeInfo.imageLinks?.thumbnail}" alt="${
			bookResult.volumeInfo.title || "Book Cover"
		}"> 
            <p class="title">${bookResult.volumeInfo.title}</p>
			<p class="authors">${bookResult.volumeInfo.authors}</p>
        `;
		popular.appendChild(bookElement);
	});
}

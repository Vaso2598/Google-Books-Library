const Google_API_KEY = "AIzaSyCba6TVOGjsMW8yOEJjTE9JXnAvA7mU3JU";
const Nyt_API_KEY = "DeAFDYAoBJe6gYO8gy88zHOH377fhZG0";

const search = document.getElementById("search");
const searchResults = document.getElementById("results");
const form = document.getElementById("form");
const popular = document.getElementById("popular");
let isbn10 = "";
let isbn13 = "";

// fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}:keyes&key=${Google_API_KEY}`)
// 	.then((response) => response.json())
// 	// .then((data) => console.log(data))
// 	.then((data) => {
// 		displayResults(data.items);
// 	});

/* Script for search */

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
	// .then((data) => console.log(data))
	.then((data) => {
		getBestSellersId(data.results);
	});

function getBestSellersId(data) {
	// console.log(data);
	popular.innerHTML = "";
	data.map((bookId) => {
		console.log(bookId.isbns[0]);
		// console.log(bookId.isbns[0].isbn10);
		// console.log(bookId.isbns[0].isbn13);
		let isbn10 = `${bookId.isbns[0].isbn10}`;
		let isbn13 = `${bookId.isbns[0].isbn13}`;

		if ((isbn10 = `${bookId.isbns[0].isbn10}`)) {
			fetch(`https://www.googleapis.com/books/v1/volumes?isbn=${isbn10}:keyes&key=${Google_API_KEY}`);
		} else if ((isbn13 = `${bookId.isbns[0].isbn13}`)) {
			fetch(`https://www.googleapis.com/books/v1/volumes?isbn=${isbn13}:keyes&key=${Google_API_KEY}`);
		} else {
			console.log("no books found with matching ISBN");
		}
	});
}

// TODO: add if else function, if isbn10 is empty use isbn13, if isbn13 is also empty do not show that book

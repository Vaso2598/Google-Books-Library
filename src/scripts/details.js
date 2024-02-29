const Google_API_KEY = "AIzaSyC20juLxxzWQGC1YxsweUMsX9v60LcNq8k";

const search = document.getElementById("search");
const searchResults = document.getElementById("results");
const form = document.getElementById("form");
const genreName = document.getElementById("genreName");
const bookDetails = document.getElementById("bookDetails");

/* Searchbar */

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

/* Fetch book details */

const urlParams = new URLSearchParams(window.location.search);
const volumeId = urlParams.get("volumeId");
// console.log(volumeId);

fetch(`https://www.googleapis.com/books/v1/volumes/${volumeId}`)
	.then((response) => response.json())
	// .then((data) => console.log(data))
	.then((data) => {
		displayDetails(data);
	});

function displayDetails(data) {
	console.log(data);
	bookDetails.classList.add("bookDetails");
	bookDetails.innerHTML = `
        <h4>${data.volumeInfo.title}</h4>
        <p>${data.volumeInfo.authors}</p>
        <p>${data.volumeInfo.publishedDate}</p>
        <p>${data.volumeInfo.publisher}</p>
        <p>${data.volumeInfo.categories}</p>
        <img src="${data.volumeInfo.imageLinks?.thumbnail}" alt="${data.volumeInfo.title || "Book Cover"}">
        <p>${data.volumeInfo.description}</p>
    `;
}

const Google_API_KEY = "AIzaSyC20juLxxzWQGC1YxsweUMsX9v60LcNq8k";

const search = document.getElementById("search");
const searchResults = document.getElementById("results");
const form = document.getElementById("form");
const genreName = document.getElementById("genreName");
const bookDetails = document.getElementById("bookDetails");

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
	// console.log(data);
	bookDetails.classList.add("bookDetails");
	bookDetails.innerHTML = `
        <img src="${data.volumeInfo.imageLinks?.thumbnail}" alt="${data.volumeInfo.title || "Book Cover"}">
        <div>
            <h4>${data.volumeInfo.title}</h4>
            <p><b>Authors:</b> ${data.volumeInfo.authors}</p>
            <p><b>Publish Date:</b> ${data.volumeInfo.publishedDate}</p>
            <p><b>Publisher:</b> ${data.volumeInfo.publisher}</p>
            <p><b>Overview:</b>
			</br>
			${data.volumeInfo.description}</p>
            <p><i>${data.volumeInfo.categories}</i></p>
        </div>
    `;
}

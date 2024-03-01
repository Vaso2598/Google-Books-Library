const Google_API_KEY = "AIzaSyC20juLxxzWQGC1YxsweUMsX9v60LcNq8k";
const Nyt_API_KEY = "DeAFDYAoBJe6gYO8gy88zHOH377fhZG0";

const search = document.getElementById("search");
const searchResults = document.getElementById("results");
const form = document.getElementById("form");
const popular = document.getElementById("popular");
const bookList = document.getElementById("booksByGenre");
const genreName = document.getElementById("genreName");

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

	// const viewFullResultsLink = document.createElement("a");
	// viewFullResultsLink.textContent = "View Full Results";
	// viewFullResultsLink.onclick = () => window.open(`https://www.google.com/search?q=${search.value}`, "_blank");
	// searchResults.appendChild(viewFullResultsLink);
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
	const booksToShow = bookData.slice(0, 20);
	/*  */
	const swiperEl = document.createElement("div");
	swiperEl.classList.add("swiper");
	popular.appendChild(swiperEl);
	/*  */
	const swiperWrapperEl = document.createElement("div");
	swiperWrapperEl.classList.add("swiper-wrapper");
	swiperEl.appendChild(swiperWrapperEl);
	/*  */
	booksToShow.forEach((bookResult) => {
		// console.log(bookResult);
		const bookElement = document.createElement("div");
		bookElement.classList.add("swiper-slide");
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

		swiperWrapperEl.appendChild(bookElement);
	});

	const swiper = new Swiper(".swiper", {
		// Optional parameters
		direction: "horizontal",
		slidesPerView: 2,
		spaceBetween: 50,
		breakpoints: {
			640: {
				slidesPerView: 5,
				spaceBetween: 50,
			},
		},
		autoplay: {
			delay: 3000,
			pauseOnMouseEnter: true,
		},
		/* scroll slide */
		loop: true,
		mousewheel: {
			invert: true,
		},
	});
}

/* Books you may like */

fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction`)
	.then((response) => response.json())
	// .then((data) => console.log(data))
	.then((data) => {
		displayResultsByGenre(data.items);
	});

function displayResultsByGenre(data) {
	// console.log(data);
	bookList.innerHTML = "";
	const booksToShow = data.slice(0, 5);
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

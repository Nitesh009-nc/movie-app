const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const main = document.getElementById('main');
const form = document.getElementById('form');
const input = document.getElementById('input');
const favorite = document.querySelector('.favorite');
const favBtn = document.getElementById('fav_btn');
const movieContainer = document.getElementById('movie_container');
const closeBtn = document.getElementById('close');

fetchLs();

function getLs() {
    const favMovie = JSON.parse(localStorage.getItem('favMoviesList')); 
    return favMovie;
}

function fetchLs() {
    const favMovie = getLs();
    if (favMovie) {
        loadFavMovie(favMovie);
    };
}

getMovie(APIURL);

async function getMovie(url) {
    const res = await fetch(url);
    const resData = await res.json();
    loadMovie(resData.results);
}

function loadMovie(movies) {
    const lsData = getLs();
    movies.forEach((movie) => {
        const { poster_path, original_title, vote_average, overview } = movie;
        if (poster_path != null) {
            const cardEl = document.createElement('div');

            cardEl.classList.add('card');
            if (lsData) {
                lsData.forEach(arr => {
                    if (arr.movieTitle === original_title) {
                        cardEl.classList.add('favMovies');
                    }
                });
            };
            cardEl.innerHTML = `
            <div class="movie_img
                ">
                    <img src="${ IMGPATH + poster_path }" alt="">
                </div>
                <ul>
                    <li><p class="title">${original_title}</p></li>
                    <li><p class="${className()}">${vote_average}</p></li>
                </ul>
    
                <div class="overview">
                    <h5>Overview:</h5>
                    <i class="fa-regular fa-heart"></i>
                    ${overview}          
                </div>
    
            `
            // selected fav 
            if (cardEl.classList.contains('favMovies')) {
                cardEl.querySelector('.fa-heart').classList.add('fa-solid');
            };

            function className() {
                if (vote_average >= 8) {
                    return 'green';
                } else if (vote_average >= 5 && vote_average < 8) {
                    return 'orange';
                } else return 'red' ;
            }

            const favBtn = cardEl.querySelector('.fa-heart');
            favBtn.addEventListener('click', () => {
                favBtn.classList.toggle('fa-solid');
                cardEl.classList.toggle('favMovies');
                updateLs();
            });

            main.appendChild(cardEl);
        };
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputTerm = input.value;
    if (inputTerm) {
        getMovie(SEARCHAPI + inputTerm)
        main.innerHTML = "";
    }
    input.value = "";
    
});

function updateLs() {
    const favMovies = document.querySelectorAll('.favMovies');
    const favMovieList = [];
    console.log(favMovies);
    if (favMovies.length > 0) {
        favMovies.forEach((favMovie) => {
            const posterSrc = favMovie.childNodes[1].firstChild.nextSibling.src;
            const movieTitle = favMovie.childNodes[3].firstChild.nextSibling.outerText;
            const movieRating = favMovie.childNodes[3].childNodes[3].outerText;
            const overview = favMovie.childNodes[5].childNodes[4].nodeValue;

            favMovieList.push({
                posterSrc,
                movieTitle,
                movieRating,
                overview
            });

            localStorage.setItem('favMoviesList', JSON.stringify(favMovieList));

        });

        
    };
    fetchLs();
}

function loadFavMovie(movies) {
    movieContainer.innerHTML = "";
    movies.forEach(movie => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');
        cardEl.innerHTML = `
        <div class="movie_img
                ">
                    <img src="${movie.posterSrc}" alt="">
                </div>
                <ul>
                    <li><p class="title">${movie.movieTitle}</p></li>
                    <li><p class="">${movie.movieRating
                    }</p></li>
                </ul>
    
                <div class="overview">
                    <h5>Overview:</h5>
                    <i class="fa-solid fa-heart"></i>
                    ${movie.overview}          
                </div>
        `
        const fav_btn = cardEl.querySelector('.fa-heart');
        fav_btn.addEventListener('click', () => {
            cardEl.remove();
        });
        
        movieContainer.appendChild(cardEl);
        
    });
}

// favorite buttn
favBtn.addEventListener('click', (e) => {
    e.preventDefault();
    favorite.style.display = "block";
});

// close btn
closeBtn.addEventListener('click', () => {
    favorite.style.display = "none"; 
});


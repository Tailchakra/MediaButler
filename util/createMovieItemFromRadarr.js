module.exports = (movie) =>
{
    let d = new Date(movie.inCinemas);
    let i = {};
    i.Year = movie.year;
    i.Poster = movie.remotePoster;
    i.Rated = "N/A";
    i.Released = d.toDateString();
    i.Genre = movie.genres.join(", ");
    i.Runtime = movie.runtime;
    i.imdbRating = movie.ratings.value;
    i.imdbVotes = movie.ratings.votes;
    i.imdbID = `N/A (TMDb ${movie.tmdbId})`;
    return i;
}
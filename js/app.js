'use strict';


var app = {};

app.selectors = {
  searchField: $('#search'),
  searchButton: $('#submit'),
  movies: $('#movies'),
  yearField: $('#year'),
  mainContent: $('.main-content'),
  overlay: function(){
    return this.mainContent.find('.overlay');
  },
  overlayDesc: function(){
    return this.mainContent.find('.overlay-description');
  },
  overlayTop: function(){
    return this.mainContent.find('.overlay-top');
  },
  overlayClose: function(){
    return this.mainContent.find('.close-overlay');
  }
}

app.values = {
  url: 'http://www.omdbapi.com/?apikey=85d68d8c&r=json'
};

app.init = function(){
  var selectors = this.selectors;
  var values = this.values;

  selectors.mainContent.append(function(){
    var html = '';

    html += '<div class="overlay overlay-background" style="display:none"></div>';
    html += '<div class="overlay overlay-description" style="display:none">';
    html += '<div class="overlay-top"></div>';
    html += '<div class="row">';

    html += '<div class="col-xs-12"><span class="clickable close-overlay">< Search results</span></div>';
    html += '<div class="col-sm-4"><img id="overlay-poster"></div>';

    html += '<div class="col-sm-8">';

    html += '<div class="overlay-heading-group">';
    html += '<h1 class="overlay-heading">';

    html += '<span id="overlay-title">overlay heading</span>';
    html += '<span id="overlay-year"></span>';

    html += '</h1>';

    html += '<span id="overlay-imdb-rating">imdb rating</span>';
    html += '</div>';

    html += '<div class="overlay-body">';

    html += '<h4 class="overlay-heading">Plot Synopsis:</h4>';
    html += '<div id="overlay-plot"></div>';

    html += '<a id="overlay-imdb-link" class="btn btn-success" target="_blank">View on IMDB</a>';

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
  });

  selectors.searchButton.click(function(event){
    event.preventDefault();

    var searchTerm = selectors.searchField.val();
    var yearInput = selectors.yearField.val();
    var url = values.url + '&s=' + searchTerm;

    if(searchTerm === ''){return;}

    // includes year in search string if valid year is supplied in the year filter
    if(yearInput !== '' && yearInput.length === 4 && typeof Number(yearInput) === 'number' ){
      url += '&y=' + yearInput;
    }

    selectors.movies.children().remove();

    // make api call
    $.get(url, function(data){
      var Search = data.Search;
      var html = '';

      values.dataArr = Search.slice();

      console.log(data);

      if(data.Error){
        html += '<li class="no-movies">';
        html += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchTerm + '.';
        html += '</li>';

        selectors.movies.append(html);
        return;
      }

      Search.forEach(function(movie){
        html += '<li class="clickable">';
        html += '<div class="poster-wrap">';

        if(movie.Poster === 'N/A'){
          html += '<i class="material-icons poster-placeholder">crop_original</i>';

        }else{
          html += '<img class="movie-poster" src="' + movie.Poster + '">';
        }

        html += '</div>';
        html += '<span class="movie-title">' + movie.Title + '</span>';
        html += '<span class="movie-year">' + movie.Year + '</span>';
        html += '</li>';
      });
      selectors.movies.append(html);
    })
  });

  selectors.movies.on('click', '> li', function(){
    var index = $(this).index();
    var movieObj = values.dataArr[index];
    var overlayParent = selectors.overlayDesc();
    var url = values.url + '&plot=long&t=' + movieObj.Title;

    selectors.overlay().show();
    selectors.overlayTop().css('height', (selectors.overlayClose().outerHeight() + $('.overlay-heading-group').outerHeight()) + 'px');

    // make api call
    $.get(url, function(data){
      console.log(data);
      overlayParent.find('#overlay-title').text(data.Title);
      overlayParent.find('#overlay-year').text(' (' + data.Year + ')');
      overlayParent.find('#overlay-imdb-rating').text('IMDB Rating: ' + data.imdbRating);
      overlayParent.find('#overlay-plot').html('<p>' + data.Plot + '</p>');
      overlayParent.find('#overlay-poster').attr('src', data.Poster);
      overlayParent.find('#overlay-imdb-link').attr('href', 'http://www.imdb.com/title/' + data.imdbID);
    });
  });

  selectors.mainContent.on('click', '.close-overlay', function(){
    selectors.overlay().hide();
  });

  // testing
  selectors.searchField.val('gun');
  selectors.searchButton.trigger('click');
};

app.init();

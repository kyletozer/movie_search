(function(){

  var searchField = $('#search');
  var searchButton = $('#submit');

  var url = 'http://www.omdbapi.com/?apikey=85d68d8c&r=json'; // &s= to return by title

  // default testing value
  searchField.val('gun');

  searchButton.click(function(event){
    // prevent page refresh
    event.preventDefault();

    var searchTerm = searchField.val();

    url += '&s=' + searchTerm;

    $.get(url, function(data){
      console.log(data);
    });
  });

  // automate search for testing
  searchButton.trigger('click');

})();

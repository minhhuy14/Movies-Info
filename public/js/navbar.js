$(document).ready(function() {
        $('#my-search-actors').click(function() {
          $('#my-search-button').attr('formaction', '/search_actor/');
        });
        $('#my-search-movies').click(function() {
          $('#my-search-button').attr('formaction', '/search/');
        });
});

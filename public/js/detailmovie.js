

$(document).ready(function () {


    $('.page-item-review').click(function (e) {
        e.preventDefault();
        let currentPage = parseInt($(this).text());
        let id = $(this).attr('data-movieId');
        console.log(id);
        console.log(currentPage);
        loadReviewPage(currentPage, id);
        console.log('Da click');
        $('.page-item-review').removeClass('active');
        $(this).addClass('active');
    });

    let movie_id = $('.page-item-review').attr('data-movieId');
    loadReviewPage(1, movie_id);

});

function loadReviewPage(pageNumber, movie_id) {
    $.ajax({
        url: `/detailmovie/${movie_id}/reviews/page/${pageNumber}`,
        type: 'GET',
        success: function (data) {
            // console.log(data);
            // console.log(typeof data);
            $('#reviewTableBody').empty();
            // console.log(data.reviewsData.length);
            data.reviewsData.forEach(rv => {
                $('#reviewTableBody').append(`
           <tr>
              <th scope="row">${rv.username}</th>
               <td>${rv.title_review}</td>
               <td>${rv.date}</td>
               <td>${rv.user_rating}</td>
               <td>${rv.warning_spoiler}</td>
               <td>${rv.text_review}</td>
              
           </tr>
           `);
            });

        }
    });
}
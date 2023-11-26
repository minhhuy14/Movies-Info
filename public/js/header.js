$(document).ready(function() {
    $('.darkmode-btn').on('change',function() {
      if ($(this).is(':checked')) {
        document.body.setAttribute('data-bs-theme','dark');
        document.body.style.background = '#000';

        $('#header').addClass('purple-color');

        $('.darkmode-icon').html('Dark Mode');
        // <i class="fa-solid fa-moon-stars"></i>
      }
      else {
        document.body.removeAttribute('data-bs-theme');
        document.body.style.background = '#c3c7c4';
        $('#header').removeClass('purple-color');
        $('.darkmode-icon').html('Dark Mode');
      }
    });
  });
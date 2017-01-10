window.onload = function () {

  var socket = io();
  socket.connect("http://localhost:3001/socket.io.js");

  // Swaps the main photo when the menu bar is fully exposed/hidden.
  $(window).scroll(function() {
    url = $('#main-container').css('background-image');
    if ($(window).scrolltop() == 0 && url.indexof('headshot_light') !== -1) {
      swapbackground('url(../images/new_photo.jpg) no-repeat -15em center fixed', function() {});
    }
  });


  // Click event handler for exposing subsections of the site.
  $('.link').click(function(e) {
    newid = this.id;
    if (this.id == 'about') {
      swapBackground('url(../images/day_of_the_dead.jpg) no-repeat center center fixed', changeSection);
    } else if (this.id == 'reels') {
      swapBackground('none', changeSection);
    } else if (this.id == 'portfolio') {
      swapBackground('none', changeSection);
    } else if (this.id == 'resume') {
      swapBackground('none', changeSection);
    } else if (this.id == 'events') {
      swapBackground('url(../images/Bandelion_dark.jpg) no-repeat center center fixed', changeSection);
    } else if (this.id == 'contact') {
      swapBackground('url(../images/Bandelion_light.jpg) no-repeat center center fixed', changeSection);
    }
  });


  // Function for swapping the background image of the main container.
  function swapBackground(background, callback) {
    $('#main-container').animate({opacity: 0}, 600, function() {
      $('#main-container').css({
        'background': background,
        'background-size': '100%'
      });
      $('#main-container').animate({opacity: 1}, 600);
      callback();
    });
  }


  // Hides all subsections that are NOT the subsection clicked on.
  function changeSection() {
    $('.container-page').each(function() {
      if (this.id != newid+'-page') {
        this.style.display = 'none';
      } else {
        var width = $("#links-container").css("width");
        this.style.display = 'inline';
        $("#links-container").css({"width": width});
        if (this.id == 'portfolio-page') {
          socket.emit('requestImages');
        }
        if (this.id == 'reels-page') {
          $('#scroll-player').attr('src', reels.clips[0]);
          $('#reel-info').text(reels.summaries[0]);
        }
      }
    });
  }


  // Fills image-container with divs for each image.
  socket.on('imageResponse', function (obj) {
    for (i=0; i < obj.files.length; i++) {
      var img = "<img class='image-container' src='images/portfolio/"+obj.files[i]+"\'>";
      $('#images-container').html($('#images-container').html() + "\n" + img);
    }
    for (j=0; j < obj.thumbs.length; j++) {
      var thumb = "<img class='image-container' src='images/portfolio/thumbnails/"+obj.thumbs[j]+"\'>";
      $('#mini-images-container').html($('#mini-images-container').html() + "\n" + thumb);
    }
    alert("wrapper1: " + $("#wrapper1").css("height") + "\n" + "images-container: " + $("#images-container").css("height") + "\n" + "wrapper2: " + $("#wrapper1").css("height") + "\n" + "mini-images-container: " + $("#mini-images-container").css("height") + "\n" + "image: " + $(".image-container").css("height"));
  });

  $("#wrapper2").scroll(function(e) {
    alert('mini scrolling');
  });


  // Click event to scroll to bottom of reels page.
  $('#down-arrow').click(function(e) {
    $('body').animate({scrollTop: document.body.scrollHeight}, 500);
  });


  // Click event handler for swapping reel clips.
  reels = {
    'summaries': ['Qi Aerista Kickstarter Promo', 'Avid Dance Company Promo'],
    'clips': ['https://www.youtube.com/embed/nIS6qMorab4','https://www.youtube.com/embed/iYZZ6d-JrtU']
  }
  reelNum = 0;
  $('#left-arrow').click(function(e) {
    $('#scroll-player').attr('src', reels.clips[--reelNum % reels.clips.length]);
    $('#reel-info').text(reels.summaries[reelNum % reels.summaries.length]);
  });
  $('#right-arrow').click(function(e) {
    $('#scroll-player').attr('src', reels.clips[++reelNum % reels.clips.length]);
    $('#reel-info').text(reels.summaries[reelNum % reels.summaries.length]);
  });

  //$('#reels').trigger('click');
}

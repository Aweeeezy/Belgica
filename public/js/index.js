window.onload = function () {
  var portfolioImages = [];

  var socket = io();
  socket.connect("http://localhost:8000/socket.io.js");

  // Click event handler for exposing subsections of the site.
  $('.link').click(function(e) {
    newid = this.id;
    if (this.id == 'about') {
      swapBackground('url(../images/site_photos/day_of_the_dead.jpg) no-repeat center -15em fixed', changeSection);
    } else if (this.id == 'reels') {
      swapBackground('none', changeSection);
    } else if (this.id == 'portfolio') {
      swapBackground('none', changeSection);
    } else if (this.id == 'resume') {
      swapBackground('none', changeSection);
    } else if (this.id == 'contact') {
      swapBackground('none', changeSection);
    }
  });


  // Click event to scroll to bottom of reels page.
  $('#down-arrow').click(function(e) {
    $('html, body').animate({scrollTop: document.body.scrollHeight}, 500);
  });

  // Click event handler for swapping reel clips.
  reels = {
    'summaries': ['Credit Karama', 'Qi Aerista Kickstarter Promo', 'Avid Dance Company Promo'],
    'clips': ['https://www.youtube.com/embed/iqSVZ2W9BRc', 'https://www.youtube.com/embed/nIS6qMorab4','https://www.youtube.com/embed/iYZZ6d-JrtU']
  }
  reelNum = 0;
  $('#left-arrow').click(function(e) {
    $('#scroll-player').attr('src', reels.clips[Math.abs(--reelNum) % reels.clips.length]);
    $('#reel-info').text(reels.summaries[Math.abs(reelNum) % reels.summaries.length]);
  });
  $('#right-arrow').click(function(e) {
    $('#scroll-player').attr('src', reels.clips[Math.abs(++reelNum) % reels.clips.length]);
    $('#reel-info').text(reels.summaries[Math.abs(reelNum) % reels.summaries.length]);
  });


  // Click event for mini-images to scroll full-sized image-container
  $(document).on('click', '.mini-image', function() {
    var id = this.id.substring(5);
    var position = $('#'+id).position().left;
    var halfImage = $('#'+id).width()/2;
    var windowWidth = window.innerWidth/2;
    $('#images-container').animate({scrollLeft: $('#images-container').scrollLeft() + position - windowWidth + halfImage}, 400);
  });


  // Fills image-container with divs for each image.
  socket.on('imageResponse', function (obj) {
    portfolioImages = obj.files;
    for (i=0; i < obj.files.length; i++) {
      var img = "<a href='images/portfolio/"+obj.files[i]+"' data-lightbox='box-stuff'><img id='img-"+i+"' class='image' src='images/portfolio/"+obj.files[i]+"\'></a>";
      $('#images-container').html($('#images-container').html() + "\n" + img);
    }
    for (j=0; j < obj.thumbs.length; j++) {
      var thumb = "<img id='mini-img-"+j+"' class='image mini-image' src='images/portfolio/thumbnails/"+obj.thumbs[j]+"\'>";
      $('#mini-images-container').html($('#mini-images-container').html() + "\n" + thumb);
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

  lightbox.option({
      'disableScrolling': true,
      'imageFadeDuration': 200,
      'resizeDuration': 100,
      'wrapAround': true,
  })
}

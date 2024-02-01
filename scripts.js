$(document).ready(function(){
    $('.movies-list').slick({
        variableWidth: true,
        prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>'
    });


    const KEY = "f1edcd577fa343a5ca8962adedb51dbe";
    const API = "https://api.themoviedb.org/3/";
    const IMAGE = "https://image.tmdb.org/t/p/";

    const getPopularMovies = API + "discover/movie?api_key=" + KEY + "&language=en-US";
    const getPopularSeries = API + "discover/tv?api_key=" + KEY + "&language=en-US";
    const getPopularFamily = API + "discover/movie?api_key=" + KEY + "&language=en-US&with_genres=10751";
    const getPopularHorror = API + "discover/movie?api_key=" + KEY + "&language=en-US&with_genres=27";
    const getPopularThriller = API + "discover/movie?api_key=" + KEY + "&language=en-US&with_genres=53";


    $.ajax(getPopularMovies).done(function(res){
        const featured = res.results[0];
        setFeaturedMovie(featured);
        const list = res.results;
        list.shift(); 

        setListItems(list, '#popular-movies', "movie");
        
    })

    $.ajax(getPopularSeries).done(function(res){

            const list = res.results
            setListItems(list, '#popular-series', "tv");


        });
        
    $.ajax(getPopularFamily).done(function(res){

        const list = res.results
        setListItems(list, '#popular-family', "movie");

    });
    $.ajax(getPopularHorror).done(function(res){

        const list = res.results
        setListItems(list, '#horror-movies', "movie");

    });
    $.ajax(getPopularThriller).done(function(res){

        const list = res.results
        setListItems(list, '#thriller-movies', "movie");

    });
    

    //TO DO:
    $("#play-featured, .movies-list").click(function(event) {
        if ( $(this).data("id") ){
            var id = $(this).data("id");
            var type = $(this).data("type");
        } else {
            var id = $(event.target).closest("[data-id]").data("id");
            var type = $(event.target).closest("[data-id]").data("type")
        }

        if ( id ) {
            $("#modal").fadeIn();

        const getItemContent = API + type + "/"+ id +"?api_key=" + KEY + "&language=pt-BR";
        $.ajax(getItemContent).done(function(res) {
            setModalContent(res, type);
        
        $("#modal .modal-poster").click(function() {
            $("#player").fadeIn();

        const getVideos = API + type + "/"+ id +"/videos?api_key=" + KEY + "&language=pt-BR";
            $.ajax(getVideos).done(function(res){
            setVideoPlayer(res.results);
            });
        });
           
        
        });
        }

    });
    $("#modal .modal-close").click(function() {
        $("#modal").fadeOut();
    });

    $(document).ajaxComplete(function(){
        $("#loading").fadeOut();
    });
    $(document).ajaxStart(function(){
        $("#loading").fadeIn();
    });

    function setFeaturedMovie (movie) {
        const featureTitle = movie.title;
        const featureBackdrop = movie.backdrop_path;
        const featureVote = movie.vote_average;
        const movieId = movie.id;

        $("#featureTitle").html(featureTitle);
        $("#featureVote").html(featureVote);
        $("#featureBackdrop").css("background-image", "url(" + IMAGE + "original" + featureBackdrop + ")");
        $("#play-featured").attr("data-id", movieId).attr("data-type", "movie");
    }
    function setListItems(list, carousel, type){
        for(let i = 0; i < list.length; i++) {
            let title = type === "movie" ? list[i].title : list[i].name;
            let rate = list[i].vote_average;
            let poster = list[i].poster_path;
            let id = list[i].id;

            let item = '<div class="movies-item" data-id="'+ id +'"data-type="'+ type +'">';
            item += '<div class="movies-info">';
            item += '<i class="far fa-play-circle"></i>';
            item += '<h3>' + title + '</h3>';
            item += '<div class="rating"><div class="rating-rate">'+ rate +'</div></div>';
            item += '</div>';
            item += '<img src="'+ IMAGE + 'w185' + poster + '"alt="'+ title +'">';
            item += '</div>';

        $(carousel).slick('slickAdd', item);
    }
    }
    function setModalContent (item, type ) {
        let poster = IMAGE + "w500" + item.poster_path;
        let title = type === "movie" ? item.title : item.name;
        let year = type === "movie" ? item.release_date : item.first_air_date;
        let originalTitle = type === "movie" ? item.original_title : item.original_name;
        let description = item.overview;
        let vote = item.vote_average;
        let duration = item.runtime;
        let site = item.homepage;
        let idEl = item.id;

        $("#modal .modal-poster img").attr("src", poster);
        $("#modal .modal-title").html(title);
        $("#modal .modal-year").html("Lançamento: " +  year);
        $("#modal .modal-original-title").html(originalTitle);
        $("#modal .modal-description").html(description);
        $("#modal .rating-rate").html(vote);
        if (type === "movie") {
        $("#modal .modal-duration").show();
        $("#modal .modal-duration").html('<i class="far fa-clock"></i> ' +duration + "min");
        } else {
        $("#modal .modal-duration").hide();
        }
        $("#modal .modal-link").attr("href", site).html(site);
    }
    function setVideoPlayer (videos) {
        if(videos.length) {

            let idVideo = videos[0].key;
            let width = window.innerWidth;
            let height = window.innerHeight;

            $("#video").html('<iframe width="'+  width +'" height="'+ height +'" src="https://www.youtube.com/embed/'+ idVideo +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
        } else {
            $("#video").html("<h3>Vídeo Indisponível</h3>");
        }
        $("#player .player-close").click(function() {
            $("#player").fadeOut();
            $("#video").html("");
        });
    }
  });

                  
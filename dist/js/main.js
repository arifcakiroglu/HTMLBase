$(function(){$(".news-list__item").click(function(){$(".pane").show(),$("body").addClass("no-scroll")}),$(".pane__overlay, .pane__close").click(function(){$(".pane").hide(),$("body").removeClass("no-scroll")})});
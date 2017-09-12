(function () {
    var jquery_version = '2.1.4';
    var site_url = 'http://127.0.0.1:8000/';
    var static_url = site_url + 'static/';
    var min_width = 100;
    var min_height = 100;

    function bookmarklet(msg) {
        // load CSS
        var css = JQuery('<link>')
        css.attr({
            rel: 'stylesheet',
            type: 'text/css',
            href: static_url + 'css/bookmarklet.css?r=' + Math.floor(Math.random()*99999999999999999999)
        });
        JQuery('head').append(css);

        // load html
        box_html = '<div id="bookmarklet"><a href="#" id="close">&times;</a><h1>Select an image to bookmark:</h1><div class="images"></div></div> ';
        JQuery('body').append(box_html);

        // close event
        JQuery('#bookmarklet #close').click(function () {
            JQuery('#bookmarklet').remove();
        });

        // find images and display them
        JQuery.each(JQuery('img[src$="jpg"]'),function (index, image) {
            if (JQuery(image).width() >= min_width && JQuery(image).height() >= min_height)
            {
                image_url = JQuery(image).attr('src');
                JQuery('#bookmarklet .images').append('<a href="#"><img src="'+ image_url +'" /></a>');
            }
        });

        //when an image is selected open URL with it
        JQuery('#bookmarklet .images a').click(function (e) {
            selected_image = JQuery(this).children('img').attr('src');
            // hide bookmarklet
            JQuery('#bookmarklet').hide();
            // open new windown to submit the image
            window.open(site_url + 'images/create/?url='
                        + encodeURIComponent(selected_image)
                        + '&title'
                        + encodeURIComponent(JQuery('title').text()),'_blank');
        });

    };

    // Check if JQuery is loaded
    if(typeof window.JQuery != 'undefined'){
        bookmarklet();
    }else{
        // Check for conflicts
        var conflict = typeof window.$ != 'undefined';
        // Create the script and point to Goodle API
        var script = document.createElement('script');
        script.setAttribute('src', 'http://ajax.googleapis.com/ajax/libs/jquery/' + jquery_version + '/jquery.min.js' );
        // Add the script to the 'head' for processing
        document.getElementsByTagName('head')[0].appendChild(script);

        // Create a way to wait until script loading
        var attempts = 15;
        (function () {
            // Check again if JQuery is undefined
            if(typeof window.JQuery == 'undefined'){
                if(--attempts > 0){
                    // Calls himself in a few milliseconds
                    window.setTimeout(arguments.callee, 250)
                }else{
                    // Too much attempts to load, send error
                    alert('An error ocurred while loading JQuery')
                }
            }else{
                bookmarklet();
            }
        })();
    }
})()

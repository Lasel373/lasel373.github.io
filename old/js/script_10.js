    var topBtn = document.getElementById('back-to-top');
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            topBtn.style.opacity = '0.9';
        } else {
            topBtn.style.opacity = '0.4';
        }
    };
    topBtn.onclick = function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
    // kleiner Hinweis in der Konsole – damals beliebt
    console.log('2010er Modus aktiv – floats und clearfix regieren!');
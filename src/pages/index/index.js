// 在开发版热更新当前html
// if(process.env.NODE_ENV === 'development'){
//     require('./index.html');
// }

import './index.html';

import './index.scss';

console.log('success');

console.log(process.env.NODE_ENV);

(function () {
    let $about = $('.about')
    if (!$about.length) return

    let $blurImg = $('.blur img')
    $blurImg.each(function (i, e) {
        let $img = $(e)
        if (!$img.prop('complete')) {
            $img.one('load', function () {
                setImgClass($img)
            })
        } else {
            setImgClass($img)
        }
    })

    function setImgClass($img) {
        $img.addClass('loaded')
        if ($img.hasClass('large')) {
            $img.siblings('.thumb').eq(0).addClass('hidden')
        }
    }

    if ($(document).width() > 767) {
        let $brand = $('.brand')
        let brandHeight = $brand.height()
        let $siteH1 = $('.brand h1')

        changeBrand()
        $(document).on('scroll', function () {
            changeBrand()
        })

        $(window).on('resize', function () {
            brandHeight = $brand.height()
            changeBrand()
        })

        var valOpacity = 1,
            valTranslateY = 0,
            valScale = 1;

        function changeBrand() {
            let ratio = $(document).scrollTop() / brandHeight
            if (ratio > 0 && ratio < 1) {
                valOpacity = 1 - 1.05 * ratio
                valTranslateY = (brandHeight / 2) * ratio
                valScale = 1 - 0.45 * ratio
                $siteH1.css({
                    'opacity': valOpacity,
                    'transform': 'translate3d(0,' + valTranslateY + 'px,0) scale(' + valScale + ')',
                })
            } else {
                $siteH1.removeAttr('style')
            }
        }
    }

    var $menu = $('.menu')
    if (!$menu.is(':visible')) return

    var $nav = $('.nav')
    var $html = $('html')
    var $shut = $('.shut')
    $menu.on('click', function () {
        $nav.addClass('down live')
        clearTimeout($html.noscrollTimer)
        $html.noscrollTimer = setTimeout(function () {
            $html.addClass('noscroll')
        }, 300)
        clearTimeout($shut.shutTimer)
        $shut.shutTimer = setTimeout(function () {
            $shut.addClass('show')
        }, 500)
    })
    $shut.on('click', function () {
        $nav.addClass('hide').removeClass('down')
        clearTimeout($nav.hideTimer)
        $nav.hideTimer = setTimeout(function () {
            $nav.removeClass('live hide')
        }, 300)
        $html.removeClass('noscroll')
        $shut.removeClass('show')
    })
})();
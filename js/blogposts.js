(function (d, e) {
    if (!window.location.href.indexOf("flowscript") > -1) {
    var e = +e || 10,
    a = document.getElementsByTagName("script"),
    a = a[a.length - 1], b = document.createElement("div");
    a.parentNode.appendChild(b); b.setAttribute("class", "widget");
    b.setAttribute("id", "TumblrRecentPosts"); a = document.createElement("script");
    a.src = "https://" + d + "/api/read/json"; a.onload = function () {
        if (tumblr_api_read) {
            for (var a = tumblr_api_read.posts, c, d = Math.min(a.length, e), f = "<ul>", g = 0;
                g < d; ++g)c = a[g], f += "<li><a href='" + (c["url-with-slug"] || c.url) + "'>" +
                    c["regular-title"] + "</a></li>"; b.innerHTML = f
        }
    };
    document.body.appendChild(a)
    }
})
    ("amicitia-team.tumblr.com", 12); //enter your settings here
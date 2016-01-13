
// Define
var config = {
    user:       'LoeiFy',
    repo:       'Recordum',
    token:      'da3fb4003c268a958949'+'6b36b39b5d43a62831b3',
    info:       'Lorem ipsum dolor sit amet',
    per_page:   7,
    behance:    '',
    dribbble:   '',
    instagram:  ''
}

var _load = function(url, data, callback, error) {

    url = 'https://api.github.com'+ url; 
    data.access_token = config.token;

    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        success: function(data, status, xhr) {
            callback(data, xhr.getResponseHeader('link'))
        },
        error: function(a, b, c) {
            error && error(a, b, c)
        }
    })

}

var _template = {

    user: function(data) {
        var social = '<a target="_blank" class="icon-github" href="'+ data.html_url +'"></a>';
        if (data.blog) {
            social += '<a target="_blank" class="icon-link" href="'+ data.blog +'"></a>'
        }
        if (data.email) {
            social += '<a target="_blank" class="icon-email" href="mailto:'+ data.email +'"></a>'
        }
        if (config.behance) {
            social += '<a target="_blank" class="icon-behance" href="'+ config.behance +'"></a>'
        }
        if (config.dribbble) {
            social += '<a target="_blank" class="icon-dribbble" href="'+ config.dribbble +'"></a>'
        }
        if (config.instagram) {
            social += '<a target="_blank" class="icon-instagram" href="'+ config.instagram +'"></a>'
        }

        var user = '<img src="'+ data.avatar_url +'" />'+
                   '<h1>'+ data.name +'</h1>'+
                   '<p>'+ config.info +'</p>'+
                   '<section>'+ social +'</section>';

        return user
    },

    issues: function(data) {
        var issues = '';

        for (var i = 0; i < data.length; i ++) {
            issues += '<a class="post" href="#'+ data[i].number +'">'+
                     '<h1 class="title">'+ data[i].title +'</h1>'+
                     '<time class="time">Updated at<span>'+ data[i].updated_at.split('T')[0] +'</span></time>'+
                     '</a>';
        }

        return issues
    },

    issue: function(data) {
            var labels = '';
            
            for (var j = 0; j < data[i].labels.length; j ++) {
                labels += '<mark style="background:#'+ data[i].labels[j].color +'">#'+ data[i].labels[j].name +'</mark>'
            }
            var comment = data[i].comments > 0 ? 
                '<button class="comment" data-id="'+ data[i].number +'">View Comments</button>' :
                '<a class="comment" href="'+ data[i].html_url +'#new_comment_field" target="_blank">Add Comment</a>';
                     /*
                     '<section class="labels">'+ labels +'</section>'+
                     '<section class="main hidden">'+
                     '<article class="content">'+ marked(data[i].body) +'</article>'+ comment +
                     '</section>'+
                     '<button class="comment" id="p'+ data[i].number +'">View More</button>'+
                     */
    },

    comments: function(data) {
        var comments = '<ul class="comment_list">', issue_url = '';

        for (var i = 0; i < data.length; i ++) {
            if (i === 0) {
                issue_url = data[i].html_url.split('#')[0]
            }

            comments += '<li>'+
                       '<a href="'+ data[i].user.html_url +'" target="_blank"><img src="'+ data[i].user.avatar_url +'" /></a>'+
                       '<section>'+
                       '<header>'+
                       '<a target="_blank" href="'+ data[i].user.login +'">'+ data[i].user.login +'</a>'+
                       '<span>commented on '+ data[i].updated_at.split('T')[0] +'</span>'+
                       '</header>'+
                       '<p>'+ marked(data[i].body) +'</p>'+
                       '</section>'+
                       '</li>';
        }
        comments += '</ul><a class="comment" href="'+ issue_url +'#new_comment_field" target="_blank">Add Comment</a>';

        return comments
    }

}

$(function($) {

    var issues = '/repos/'+ config.user +'/'+ config.repo +'/issues',
        user = '/users/'+ config.user,
        page = 1, 
        issues_data = [];

    function get_issues() {
        _load(issues, {filter: 'created', page: page, per_page: config.per_page}, function(data, header) {
            // save data
            issues_data = issues_data.concat(data)

            $('#posts').append(_template.issues(data))

            if (header.indexOf('rel="next"') > 0) {
                $('#next').css('display', 'block')
                page ++;
            } else {
                $('#next').hide()
            }
        })
    }

    _load(user, {}, function(data) {
        $('#user').html(_template.user(data))

        get_issues()
    })

    $('#next').on('click', function() {
        get_issues()
    })

    if (location.hash) {
    }

    /*
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block)
    })
    */

    $('body').on('click', function(e) {
        e = $(e.target);

        if (e.hasClass('comment') && e[0].tagName == 'BUTTON') {
            var id;

            if (e.data('id')) {
                id = e.data('id');

                _load(issues +'/'+ id +'/comments', {}, function(data) {
                    e.parent().append(_template.comments(data))
                    e.remove()
                })
            }

            if (e.attr('id')) {
                id = e.attr('id');
                location.hash = id.split('p')[1];
            }

        }
    })

    $(window).on('hashchange', function() {
        var hash = location.hash.split('#')[1];

        setTimeout(function() {
        }, 0)
    })

})

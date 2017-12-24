#!/usr/bin/python
# coding=utf-8
from flask import (
    Blueprint,
    flash,
    redirect,
    url_for,
    session,
    render_template,
    Markup
)


class Video(object):
    def __init__(self, video_id, cls='youtube'):
        self.video_id = video_id
        self.cls = cls

    def render(self, *args, **kwargs):
        return render_template(*args, **kwargs)

    @property
    def html(self):
        return Markup(
            self.render('youtube/video.html', video=self)
        )


def youtube(*args, **kwargs):
    video = Video(*args, **kwargs)
    return video.html

class Youtube(object):
    def __init__(self, app=None, **kwargs):
        if app:
            self.init_app(app)

    def init_app(self, app):
        self.register_blueprint(app)
        app.add_template_global(youtube)

    def register_blueprint(self, app):
        module = Blueprint(
            'youtueb',
            __name__,
            template_folder='static'
        )
        app.register_blueprint(module)
        return module

youtube_ext = Youtube()
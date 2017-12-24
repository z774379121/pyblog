# -*- coding:utf-8 -*-


from flask import Flask
# from flask.ext.mail import Mail
from flask_moment import Moment
from flask_sqlalchemy import SQLAlchemy
#from flask_misaka import Misaka
from flask_login import LoginManager
from flask_pagedown import PageDown
from config import config
from extensions import youtube_ext

# mail = Mail()
moment = Moment()
db = SQLAlchemy()
#md = Misaka()
pagedown = PageDown()
login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'admin.login'


def create_app(config_name):
    """ 使用工厂函数初始化程序实例"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app=app)

    # mail.init_app(app=app)
    moment.init_app(app=app)
    db.init_app(app=app)
    pagedown.init_app(app=app)
    #md.init_app(app=app)
    login_manager.init_app(app=app)
    youtube_ext.init_app(app=app)

    # 注册蓝本 main
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    # 注册蓝本 admin
    from .admin import admin as admin_blueprint
    app.register_blueprint(admin_blueprint, url_prefix='/admin')

    return app

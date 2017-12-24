# -*- coding:utf-8 -*-

from flask import render_template, redirect, request, current_app, url_for, g
from . import main
#from .._customs import CustomRenderer
#import misaka as m
from ..models import Article, Tag, Category, TagSpaces, Plugin, Videobase
from .forms import SearchForm
from datetime import datetime


@main.before_request
def before_request():
    g.tags = Tag.query.all()
    g.categorys = Category.query.all()
    g.video = Videobase.query.all()
    g.recent_articles = Article.query.order_by(Article.timestamp.desc()).limit(5).all()
    articles = Article.query.order_by(Article.timestamp.desc()).all()
    time_tag = []
    for a in articles:
        if a.timestamp.strftime('%Y-%m') not in time_tag:
            time_tag.append(a.timestamp.strftime('%Y-%m'))
    g.time_tag = time_tag
    g.search_form = SearchForm(prefix='search')


@main.route('/', methods=['GET', 'POST'])
def index():
    page = request.args.get('page', 1, type=int)     #获得请求的页面参数
    articles = Article.query.order_by(Article.timestamp.desc()). \
        paginate(page, per_page=current_app.config['OUSI_POSTS_PER_PAGE'], error_out=False)    #根据数据库里的文章日期倒序排序显示文章,当页页码，设置每页的数目，超过不提醒，

    return render_template('default/index.html', articles=articles)


@main.route('/article/<pid>', methods=['GET', 'POST'])
def article(pid):                      #文章高亮装载处理
    post = Article.query.get(int(pid))
    #renderer = CustomRenderer()
    #md = m.Markdown(renderer=renderer, extensions=('fenced-code', 'tables'))
    #text = md(post.body)
    #youyan = Plugin.query.filter_by(name=u'友言').first()

    return render_template('default/article.html',  post=post)


@main.route('/tag/<t>', methods=['GET', 'POST'])
def tag(t):                                               #标签分类
    page = request.args.get('page', 1, type=int)         #第二个参数为默认值当请求参数不存在时返回默认值
    tag = Tag.query.filter_by(name=t).first()
    articles = Article.query.join(TagSpaces, TagSpaces.tag_id == tag.id).filter(TagSpaces.article_id == Article.id). \
        order_by(Article.timestamp.desc()). \
        paginate(page, per_page=current_app.config['OUSI_POSTS_PER_PAGE'], error_out=False)

    return render_template('default/tag.html', articles=articles, tag=tag)


@main.route('/category/<c>', methods=['GET', 'POST'])
def category(c):                                                      #类别分类
    page = request.args.get('page', 1, type=int)
    cty = Category.query.filter_by(name=c).first()
    articles = Article.query.filter_by(cty=cty).order_by(Article.timestamp.desc()). \
        paginate(page, per_page=current_app.config['OUSI_POSTS_PER_PAGE'], error_out=False)

    return render_template('default/category.html', articles=articles, category=cty)


@main.route('/archives/<time_tag>', methods=['GET', 'POST'])
def archives(time_tag):                                           #按发表日期分类
    page = request.args.get('page', 1, type=int)
    articles = Article.query.filter(Article.timestamp.startswith(time_tag)). \
        order_by(Article.timestamp.desc()). \
        paginate(page, per_page=current_app.config['OUSI_POSTS_PER_PAGE'], error_out=False)

    return render_template('default/archives.html', articles=articles, time_tag=time_tag)


@main.route('/search/', methods=['GET', 'POST'])
def search():
    if not g.search_form.validate_on_submit():        #如果未输入则返回主页
        return redirect(url_for('.index'))

    return redirect(url_for('.search_results', query=g.search_form.search.data.strip()))


@main.route('/search_results/<query>', methods=['GET', 'POST'])
def search_results(query):
    page = request.args.get('page', 1, type=int)
    articles = Article.query.filter(Article.body.like('%%%s%%' % query)).order_by(Article.timestamp.desc()). \
        paginate(page, per_page=current_app.config['OUSI_POSTS_PER_PAGE'], error_out=False)
    return render_template('default/search_result.html', articles=articles)

	
@main.route('/about')
def about():   
    return render_template('default/about.html')
	

@main.route('/video')
def video():
    return render_template('default/video.html')
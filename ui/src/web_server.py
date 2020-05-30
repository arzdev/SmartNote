from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.renderers import render_to_response

import mysql.connector as mysql

import requests
import os
import json
from datetime import datetime


db_user = 'admin'
db_pass = 'password'
db_name = '140a_rest_db'
# different than inside the container and assumes default port of 3306
db_host = 'localhost'

# db = mysql.connect(user=db_user, password=db_pass, host=db_host, database=db_name) // problems with connecting to localhost
# cursor = db.cursor()

# WEB_SERVER = "http://127.0.0.1:5000"
users = []
loggedIn = ""


def isDatabaseEmpty():
    if(os.stat('database.txt').st_size == 0):
        return True
    return False


def addUser(name, email):
    global users
    user = {}
    user['name'] = name
    user['email'] = email
    if(isDatabaseEmpty() == False):
        users = readFile()
    users.append(user)
    writeToFile(users)


def writeToFile(data):
    with open('database.txt', 'w') as outfile:
        json.dump(data, outfile)


def readFile():
    with open('database.txt') as json_file:
        data = json.load(json_file)
    return data


def post_signup(req):
    global users
    print(str(req.params))
    email = str(req.params['email'])
    name = str(req.params['name'])

    if(isDatabaseEmpty() == False):
        users = readFile()

    for user in users:
        if (email == user['email']):
            break

    addUser(name, email)
    """

    query = "insert into Users(name, email) values (%s, %s)"

    values = [
        (str(email), str(name)),
    ]

    cursor.executemany(query, values)
    db.commit()
    """

    return get_newsletter(req)


# --- this route will show a login form
def get_front(req):
    return render_to_response('./public/front-page.html', {}, request=req)


def get_about_us(req):
    return render_to_response('./public/about_us.html', {}, request=req)


def get_newsletter(req):
    return render_to_response('./public/newsletter.html', {}, request=req)


def get_features(req):
    return render_to_response('./public/features.html', {}, request=req)


def get_pricing(req):
    return render_to_response('./public/pricing.html', {}, request=req)


def get_metrics(req):
    return render_to_response('./public/metrics.html', {}, request=req)


def get_num_users(req):
    f = open('./public/num_users.json',)
    return json.load(f)


def get_news_data(req):
    f = open('./public/news.json',)
    return json.load(f)


if __name__ == '__main__':

    with Configurator() as config:

        config.include('pyramid_jinja2')
        config.add_jinja2_renderer('.html')

        config.add_route('front', '/front')
        config.add_route('home_front', '/')

        config.add_view(get_front, route_name='front', request_method='GET')

        config.add_view(get_front, route_name='home_front',
                        request_method='GET')

        config.add_view(post_signup, route_name='front', request_method='POST')

        config.add_route('about_us', '/about_us')
        config.add_view(get_about_us, route_name='about_us',
                        request_method='GET')

        config.add_route('newsletter', '/newsletter')
        config.add_view(get_newsletter, route_name='newsletter',
                        request_method='GET')

        config.add_route('num_users', '/num_users')
        config.add_view(get_num_users, route_name='num_users',
                        request_method='GET', renderer='json')

        config.add_route('news_data', '/news_data')
        config.add_view(get_news_data, route_name='news_data',
                        request_method='GET', renderer='json')

        config.add_route('features', '/features')
        config.add_view(get_features, route_name='features',
                        request_method='GET')

        config.add_route('metrics', '/metrics')
        config.add_view(get_metrics, route_name='metrics',
                        request_method='GET')

        config.add_route('pricing', '/pricing')
        config.add_view(get_pricing, route_name='pricing',
                        request_method='GET')

        app = config.make_wsgi_app()

        config.add_static_view(name='/', path='./public', cache_max_age=3600)

        server = make_server('0.0.0.0', 5000, app)
        server.serve_forever()
        # db.close()

"""All system views are located here"""

from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from flask_login import login_required, login_user, logout_user, current_user
from src.api import actions
from src.user import User

site_views = Blueprint('site_views', __name__, template_folder='templates')

@site_views.route('/', methods=['GET'])
def index():
    """Home page"""
    if current_user.is_authenticated:
        return redirect(url_for('site_views.logged'))
    else:
        return render_template('index.jinja')

@site_views.route('/register', methods=['GET', 'POST'])
def register():
    """Register page"""
    if current_user.is_authenticated:
        return redirect(url_for('site_views.logged'))
    elif request.method == 'GET':
        return render_template('register.jinja')
    else:
        result = actions.register(request.form)
        if result['success']:
            return render_template('index.jinja', msg=result['message'], success=result['success'])
        else:
            print("HERE"+str(result['success']))
            return render_template('register.jinja', msg=result['message'],
                                   success=result['success'])

@site_views.route('/login', methods=['GET', 'POST'])
def login():
    """Login page"""
    if request.method == 'GET':
        return render_template('login.jinja')
    else:
        result = actions.validate_account(request.form)
        if result['success']:
            user = User(request.form['username'], request.form['password'])
            login_user(user)
            return redirect(url_for('site_views.logged'))
        else:
            return render_template('login.jinja', msg=result['message'], succes=result['success'])

@site_views.route('/logged', methods=['GET'])
@login_required
def logged():
    """Index page of a logged user"""
    return render_template('logged.jinja', user=current_user)

@site_views.route('/logout', methods=['GET'])
@login_required
def logout():
    """Remove user session and redirect to index page"""
    logout_user()
    return redirect(url_for('site_views.index'))

# From down here, these will be frontend APIs to be called by javascript

@site_views.route('/create_endpoint', methods=['POST'])
@login_required
def create_endpoint():
    """Create endpoint frontend service. It only redirects the call to
       external API.
    """
    print(request.form)
    return jsonify(actions.create_endpoint(request.form))

@site_views.route('/list_endpoints', methods=['GET'])
@login_required
def list_endpoints():
    """List all endpoints. No account distinction is made"""
    return jsonify(actions.list_endpoints())

from flask import (
    Flask,
    request,
    make_response,
    render_template,
    redirect,
    url_for,
)
from flask_sqlalchemy import SQLAlchemy
import os
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("FLASK_SECRET_KEY", os.urandom(24).hex())
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///Database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


def get_current_user_from_cookie():
    token = request.cookies.get("jwt_token")

    if not token:
        return None

    try:
        data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
    except jwt.PyJWTError:
        return None

    return User.query.filter_by(public_id=data.get("public_id")).first()


# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(70), unique=True)
    password = db.Column(db.String(80))


# Decorator for verifying JWT token from cookie
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user = get_current_user_from_cookie()

        if current_user:
            return f(current_user, *args, **kwargs)

        response = make_response(redirect(url_for("login")))
        response.set_cookie("jwt_token", "", expires=0, samesite="Lax")
        return response

    return decorated_function


# Routes


@app.route("/")
def home():
    current_user = get_current_user_from_cookie()
    return render_template("home.html", current_user=current_user)


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        data = request.form
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return render_template("signup.html", message="All fields are required.")

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return render_template("signup.html", message="That email is already registered.")

        hashed_password = generate_password_hash(password)
        new_user = User(
            public_id=str(uuid.uuid4()),
            name=name,
            email=email,
            password=hashed_password,
        )

        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for("login"))

    return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        if not email or not password:
            return render_template("login.html", message="Enter both email and password.")

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return render_template("login.html", message="Invalid credentials")

        token = jwt.encode({"public_id": user.public_id}, app.config["SECRET_KEY"], algorithm="HS256")
        if isinstance(token, bytes):
            token = token.decode("UTF-8")

        response = make_response(redirect(url_for("home")))
        response.set_cookie(
            "jwt_token",
            token,
            httponly=True,
            samesite="Lax",
            max_age=60 * 60 * 24,
        )

        return response

    return render_template("login.html")

@app.route("/logout", methods=["POST"])
def logout():
    response = make_response(redirect(url_for('login', signed_out=1)))
    response.set_cookie('jwt_token', '', expires=0, samesite='Lax')
    return response


@app.route("/protected")
@token_required
def protected(current_user):
    users = User.query.all()
    return render_template("protected.html", current_user=current_user, users=users)


# Create all database tables within application context
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)

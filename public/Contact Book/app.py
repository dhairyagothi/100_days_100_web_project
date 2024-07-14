from flask import Flask, render_template, redirect, url_for, request, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config["SECRET_KEY"] = "your_secret_key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///contacts.db"
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session["user_id"] = user.id
            return redirect(url_for("dashboard"))
        flash("Invalid credentials")
    if "user_id" in session:
        return render_template("dashboard.html")
    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for("login"))
    if "user_id" in session:
        return render_template("dashboard.html")
    return render_template("register.html")


@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect(url_for("login"))
    user_id = session["user_id"]
    contacts = Contact.query.filter_by(user_id=user_id).order_by(Contact.name).all()
    return render_template("dashboard.html", contacts=contacts)


@app.route("/add_contact", methods=["GET", "POST"])
def add_contact():
    if "user_id" not in session:
        return redirect(url_for("login"))
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        phone = request.form.get("phone")

        # Check for duplicates
        existing_contact = Contact.query.filter(
            (Contact.email == email) | (Contact.phone == phone),
            Contact.user_id == session["user_id"],
        ).first()

        if existing_contact:
            flash("Email or phone number already exists for another contact.")
            return redirect(url_for("add_contact"))

        new_contact = Contact(
            name=name, email=email, phone=phone, user_id=session["user_id"]
        )
        db.session.add(new_contact)
        db.session.commit()
        return redirect(url_for("dashboard"))
    return render_template("contact_form.html", action="Add")


@app.route("/edit_contact/<int:id>", methods=["GET", "POST"])
def edit_contact(id):
    if "user_id" not in session:
        return redirect(url_for("login"))
    contact = Contact.query.get_or_404(id)
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        phone = request.form.get("phone")

        # Check for duplicates
        existing_contact = Contact.query.filter(
            ((Contact.email == email) | (Contact.phone == phone)),
            (Contact.id != id),
            (Contact.user_id == session["user_id"]),
        ).first()

        if existing_contact:
            flash("Email or phone number already exists for another contact.")
            return redirect(url_for("edit_contact", id=id))

        contact.name = name
        contact.email = email
        contact.phone = phone
        db.session.commit()
        return redirect(url_for("dashboard"))
    return render_template("contact_form.html", contact=contact, action="Edit")


@app.route("/delete_contact/<int:id>")
def delete_contact(id):
    if "user_id" not in session:
        return redirect(url_for("login"))
    contact = Contact.query.get_or_404(id)
    db.session.delete(contact)
    db.session.commit()
    return redirect(url_for("dashboard"))


@app.route("/logout")
def logout():
    session.pop("user_id", None)
    return redirect(url_for("home"))


def init_db():
    with app.app_context():
        db.create_all()


if __name__ == "__main__":
    init_db()
    app.run(debug=True)

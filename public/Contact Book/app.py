 from flask import Flask, render_template, redirect, url_for, request, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
  flask import Flask, render_template, redirect, url_for, request, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import re
import difflib

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("FLASK_SECRET_KEY", os.urandom(24).hex())
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///contacts.db"
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Colufrommn(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# Helper functions for duplicate detection
def clean_phone(phone):
    if not phone:
        return ""
    return re.sub(r"\D", "", phone)


def clean_name_words(name):
    # Remove non-alphanumeric except spaces, then split
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", "", name.lower())
    return cleaned.split()


def is_similar_name(name1, name2):
    n1 = name1.strip().lower()
    n2 = name2.strip().lower()
    if not n1 or not n2:
        return False
    if n1 == n2:
        return True

    # Sequence matcher ratio (for minor spelling typos)
    ratio = difflib.SequenceMatcher(None, n1, n2).ratio()
    if ratio >= 0.8:
        return True

    # Word analysis
    w1 = clean_name_words(name1)
    w2 = clean_name_words(name2)
    if not w1 or not w2:
        return False

    # Check if all words of the shorter name are prefixes of words in the longer name
    shorter, longer = (w1, w2) if len(w1) <= len(w2) else (w2, w1)

    if len(shorter) == 1:
        return shorter[0] in longer and (shorter[0] == longer[0] or len(longer) == 1)

    matched_indices = set()
    for s_word in shorter:
        found = False
        for idx, l_word in enumerate(longer):
            if idx not in matched_indices:
                if l_word.startswith(s_word):
                    matched_indices.add(idx)
                    found = True
                    break
        if not found:
            return False
    return True


def find_potential_duplicates(user_id, name, email, phone, exclude_id=None):
    query = Contact.query.filter(Contact.user_id == user_id)
    if exclude_id:
        query = query.filter(Contact.id != exclude_id)
    contacts = query.all()

    duplicates = []
    target_phone_clean = clean_phone(phone)
    target_email_clean = email.strip().lower() if email else ""

    for c in contacts:
        reasons = []
        # Check email
        c_email_clean = c.email.strip().lower() if c.email else ""
        if target_email_clean and c_email_clean and target_email_clean == c_email_clean:
            reasons.append("Same email address")

        # Check phone
        c_phone_clean = clean_phone(c.phone)
        if target_phone_clean and c_phone_clean and target_phone_clean == c_phone_clean:
            reasons.append("Same phone number")

        # Check name similarity
        if is_similar_name(name, c.name):
            reasons.append("Similar contact name")

        if reasons:
            duplicates.append({"contact": c, "reasons": ", ".join(reasons)})
    return duplicates


def scan_all_duplicates(user_id):
    contacts = Contact.query.filter_by(user_id=user_id).order_by(Contact.name).all()
    duplicates = []
    seen = set()

    for i in range(len(contacts)):
        for j in range(i + 1, len(contacts)):
            c1 = contacts[i]
            c2 = contacts[j]

            pair_key = tuple(sorted([c1.id, c2.id]))
            if pair_key in seen:
                continue

            reasons = []
            # Check email
            c1_email_clean = c1.email.strip().lower() if c1.email else ""
            c2_email_clean = c2.email.strip().lower() if c2.email else ""
            if c1_email_clean and c2_email_clean and c1_email_clean == c2_email_clean:
                reasons.append("Same email address")

            # Check phone
            c1_phone_clean = clean_phone(c1.phone)
            c2_phone_clean = clean_phone(c2.phone)
            if c1_phone_clean and c2_phone_clean and c1_phone_clean == c2_phone_clean:
                reasons.append("Same phone number")

            # Check name similarity
            if is_similar_name(c1.name, c2.name):
                reasons.append("Similar contact name")

            if reasons:
                seen.add(pair_key)
                duplicates.append(
                    {"contact1": c1, "contact2": c2, "reasons": ", ".join(reasons)}
                )
    return duplicates


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
    sort_order = request.args.get("sort", "asc")

    if sort_order == "desc":
        contacts = Contact.query.filter_by(user_id=user_id).order_by(
            Contact.name.desc()
        ).all()
    else:
        contacts = Contact.query.filter_by(user_id=user_id).order_by(
            Contact.name.asc()
        ).all()
if sort_order == "desc":
    contacts = Contact.query.filter_by(user_id=user_id).order_by(Contact.name.desc()).all()
else:
    contacts = Contact.query.filter_by(user_id=user_id).order_by(Contact.name.asc()).all()

    contact_count = len(contacts)

    return render_template(
        "dashboard.html",
        contacts=contacts,
        contact_count=contact_count
    contacts = Contact.query.filter_by(user_id=user_id).order_by(Contact.name).all()

    contact_count = len(contacts)

    return render_template(
        "dashboard.html",
        contacts=contacts,
        contact_count=contact_count
    duplicates = scan_all_duplicates(user_id)
    duplicate_count = len(duplicates)
    return render_template(
        "dashboard.html", contacts=contacts, duplicate_count=duplicate_count
    )


@app.route("/add_contact", methods=["GET", "POST"])
def add_contact():
    if "user_id" not in session:
        return redirect(url_for("login"))
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        phone = request.form.get("phone")

        # Check for duplicates and warn
        duplicates = find_potential_duplicates(session["user_id"], name, email, phone)
        if duplicates:
            session["pending_contact"] = {
                "name": name,
                "email": email,
                "phone": phone,
            }
            return redirect(url_for("duplicate_warning", action="add"))

        new_contact = Contact(
            name=name, email=email, phone=phone, user_id=session["user_id"]
        )
        db.session.add(new_contact)
        db.session.commit()
        flash("Contact added successfully.", "success")
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

        # Check for duplicates excluding this contact
        duplicates = find_potential_duplicates(
            session["user_id"], name, email, phone, exclude_id=id
        )
        if duplicates:
            session["pending_contact"] = {
                "name": name,
                "email": email,
                "phone": phone,
                "edit_id": id,
            }
            return redirect(url_for("duplicate_warning", action="edit"))

        contact.name = name
        contact.email = email
        contact.phone = phone
        db.session.commit()
        flash("Contact updated successfully.", "success")
        return redirect(url_for("dashboard"))
    return render_template("contact_form.html", contact=contact, action="Edit")


@app.route("/duplicate_warning")
def duplicate_warning():
    if "user_id" not in session:
        return redirect(url_for("login"))

    pending = session.get("pending_contact")
    if not pending:
        return redirect(url_for("dashboard"))

    action = request.args.get("action", "add")
    edit_id = pending.get("edit_id")

    conflicts = find_potential_duplicates(
        session["user_id"],
        pending["name"],
        pending["email"],
        pending["phone"],
        exclude_id=edit_id,
    )

    if not conflicts:
        return redirect(url_for("save_pending_contact"))

    return render_template(
        "duplicate_warning.html",
        pending=pending,
        conflicts=conflicts,
        action=action,
        edit_id=edit_id,
    )


@app.route("/save_pending")
def save_pending_contact():
    if "user_id" not in session:
        return redirect(url_for("login"))

    pending = session.pop("pending_contact", None)
    if not pending:
        return redirect(url_for("dashboard"))

    edit_id = pending.get("edit_id")
    if edit_id:
        contact = Contact.query.get_or_404(edit_id)
        contact.name = pending["name"]
        contact.email = pending["email"]
        contact.phone = pending["phone"]
        db.session.commit()
        flash("Contact updated successfully.", "success")
    else:
        new_contact = Contact(
            name=pending["name"],
            email=pending["email"],
            phone=pending["phone"],
            user_id=session["user_id"],
        )
        db.session.add(new_contact)
        db.session.commit()
        flash("Contact added successfully.", "success")

    return redirect(url_for("dashboard"))


@app.route("/cancel_pending")
def cancel_pending():
    session.pop("pending_contact", None)
    return redirect(url_for("dashboard"))


@app.route("/merge_suggestions")
def merge_suggestions():
    if "user_id" not in session:
        return redirect(url_for("login"))
    user_id = session["user_id"]
    duplicates = scan_all_duplicates(user_id)
    return render_template("merge_suggestions.html", duplicates=duplicates)


@app.route("/merge", methods=["GET", "POST"])
def merge_contacts():
    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]
    id1 = request.args.get("id1", type=int)
    id2 = request.args.get("id2", type=int)
    is_pending = request.args.get("pending", "false") == "true"

    contact1 = Contact.query.filter_by(id=id1, user_id=user_id).first_or_404()

    contact2_data = None
    contact2_id = None

    if is_pending:
        pending = session.get("pending_contact")
        if not pending:
            flash("No pending contact found to merge.", "error")
            return redirect(url_for("dashboard"))
        contact2_data = {
            "name": pending["name"],
            "email": pending["email"],
            "phone": pending["phone"],
        }
    elif id2:
        c2 = Contact.query.filter_by(id=id2, user_id=user_id).first_or_404()
        contact2_id = c2.id
        contact2_data = {"name": c2.name, "email": c2.email, "phone": c2.phone}
    else:
        flash("Invalid merge request.", "error")
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        merged_name = request.form.get("name")
        merged_email = request.form.get("email")
        merged_phone = request.form.get("phone")

        # Update contact1
        contact1.name = merged_name
        contact1.email = merged_email
        contact1.phone = merged_phone

        # Delete contact2 if it's an existing DB contact
        if contact2_id:
            c2_to_delete = Contact.query.filter_by(
                id=contact2_id, user_id=user_id
            ).first()
            if c2_to_delete:
                db.session.delete(c2_to_delete)

        db.session.commit()

        if is_pending:
            session.pop("pending_contact", None)

        flash("Contacts merged successfully.", "success")

        from_suggestions = request.args.get("from_suggestions", "false") == "true"
        if from_suggestions:
            return redirect(url_for("merge_suggestions"))
        return redirect(url_for("dashboard"))

    # Pre-fill with the best representation (e.g. longer name, non-empty phone/email)
    prefilled = {
        "name": (
            contact1.name
            if len(contact1.name or "") >= len(contact2_data.get("name") or "")
            else contact2_data.get("name")
        ),
        "email": contact1.email if contact1.email else contact2_data.get("email"),
        "phone": contact1.phone if contact1.phone else contact2_data.get("phone"),
    }

    return render_template(
        "merge_form.html",
        contact1=contact1,
        contact2_data=contact2_data,
        prefilled=prefilled,
        is_pending=is_pending,
        contact2_id=contact2_id,
    )


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

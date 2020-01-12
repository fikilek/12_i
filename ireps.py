
from flask import Flask, render_template, jsonify, request, flash, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import logging
from wtforms import StringField, SubmitField, TextAreaField, DateTimeField, FileField, IntegerField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Email, EqualTo, ValidationError
from datetime import datetime, timezone
import os
from flask_wtf import FlaskForm
import pandas as pd
import numpy as np
from sqlalchemy import func
import collections
import uuid
from flask_login import login_user, current_user, logout_user, login_required, UserMixin, LoginManager
from flask_bcrypt import Bcrypt
from werkzeug.utils import secure_filename
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_mail import Message, Mail

app = Flask(__name__)
app.config['SECRET_KEY'] = 'cc5738ac48c81fb7d502409a3b6c3d0d'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://fikilek@innopen.co.za:FkInoPen!2#@localhost/ireps'
app.config['ALLOWED_EXTENSIONS'] = set(['csv'])

app.config['MAIL_SERVER'] = 'smtp.innopen.co.za'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'ireps@innopen.co.za'
app.config['MAIL_PASSWORD'] = 'FkInoPen!2#'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
mail = Mail(app)

login_manager = LoginManager(app)
login_manager.login_view = 'unp_signin'
login_manager.login_message_category = 'info'


########################################################################################################################
# model - UsersNaturalPerson
########################################################################################################################

class UsersNaturalPerson(db.Model, UserMixin):
    __tablename__ = 'users_natural_person_unp'
    unp_a01_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    unp_a02_surname = db.Column(db.String())
    unp_a03_name = db.Column(db.String())
    unp_a04_identity_no = db.Column(db.String())
    unp_a05_email = db.Column(db.String(), unique=True, nullable=False)
    unp_a06_email_verified_on_datetime = db.Column(db.DateTime())
    unp_a07_mobile_no = db.Column(db.String())
    unp_a08_mobile_no_verified_on_datetime = db.Column(db.DateTime())
    unp_a09_home_adr_id = db.Column(db.Integer)
    unp_a10_password = db.Column(db.String())
    unp_a11_password_reset_on_datetime = db.Column(db.DateTime())
    unp_a12_log_on_at_datetime = db.Column(db.DateTime())
    unp_a13_log_out_at_datetime = db.Column(db.DateTime())
    unp_a14_urs_id = db.Column(db.String())
    unp_a15_created_on_datetime = db.Column(db.DateTime())
    unp_a16_active = db.Column(db.Boolean())

    def get_id(self):
        return self.unp_a01_id

    def is_active(self):
        """True, as all users are active."""
        # return True
        return UsersNaturalPerson.query.filter_by(unp_a01_id=self.unp_a01_id).first().unp_a16_active

    def is_authenticated(self):
        """Return True if the user is authenticated."""
        return self.authenticated

    def is_anonymous(self):
        """False, as anonymous users aren't supported."""
        return False


class UsersNaturalPersonSchema(ma.ModelSchema):
    class Meta:
        model = UsersNaturalPerson



#**********************************************************************************************************************#
#                                                                                                                      #
# START                                            ireps forms                                                         #
#                                                                                                                      #
#**********************************************************************************************************************#


########################################################################################################################
# form - UnpEmailSignUpForm
########################################################################################################################

class UnpEmailSignUpForm(FlaskForm):
    email = StringField("email", validators=[DataRequired(), Email()])
    submit = SubmitField("Sign UP")

    def validate_email(self, email):
        if UsersNaturalPerson.query.filter_by(unp_a05_email=email.data).first():
            raise ValidationError('email adr already taken. choose another one')

########################################################################################################################
# form - UnpPwdSignUpForm
########################################################################################################################


class UnpPwdSignUpForm(FlaskForm):
    email = StringField("email", validators=[DataRequired(), Email()])
    password = PasswordField("password", validators=[DataRequired()])
    confirm_password = PasswordField("confirm password", validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField("Sign UP")

########################################################################################################################
# form - UnpPwdEmailResetForm
########################################################################################################################


class UnpPwdEmailResetForm(FlaskForm):
    email = StringField("email", validators=[DataRequired(), Email()])
    submit = SubmitField("Submit email adr for pwd reset")


########################################################################################################################
# form - UnpPwdResetForm
########################################################################################################################


class UnpPwdResetForm(FlaskForm):
    email = StringField("email", validators=[DataRequired(), Email()])
    password = PasswordField("password", validators=[DataRequired()])
    confirm_password = PasswordField("confirm password", validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField("Reset Password")

########################################################################################################################
# form - UnpPwdSignInForm
########################################################################################################################


class UnpSignInForm(FlaskForm):
    email = StringField("email", validators=[DataRequired(), Email()])
    password = PasswordField("password", validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField("Sign In")

#**********************************************************************************************************************#
#                                                                                                                      #
# end                                              ireps forms                                                         #
#                                                                                                                      #
#**********************************************************************************************************************#




#**********************************************************************************************************************#
#                                                                                                                      #
# START                                              unp                                                               #
#                                                                                                                      #
#**********************************************************************************************************************#


@app.route("/unp_email_signup", methods=["GET", "POST"])
def unp_email_signup():
    """starting unp_email_signup function"""

    form = UnpEmailSignUpForm()
    if request.method == "POST":
        if form.validate_on_submit():
            email = form.email.data
            # form validates. write the email adr into the unp_users table
            try:
                # import pdb; pdb.set_trace()
                user = UsersNaturalPerson(unp_a05_email=email)
                db.session.add(user)
                db.session.commit()
            except Exception as e:
                # TODO: come back to fix the exception
                flash(f'something went wrong. could not write email "{email}" to the database.'
                      f'kindly contact iREPS admin at admin@ireps.co.za', 'danger')
                return render_template("unp_email_signup_form.html", form=form)
            # the new user email adr is now in the ireps unp_users db table.

            # user record creation datetime
            user.unp_a15_created_on_datetime = datetime.now()
            db.session.add(user)
            db.session.commit()
            # generate email msg to send to the user
            confirm_serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
            confirm_url = url_for(
                'unp_confirm_email',
                token=confirm_serializer.dumps(email, salt='email-confirmation-salt'),
                _external=True)
            html = render_template('unp_email_signup_confirm_email.html', confirm_url=confirm_url)
            email_subject = "iREPS user account - email activation"
            # import pdb; pdb.set_trace()
            try:
                msg = Message(email_subject, sender="admin@innopen.za", recipients=[email])
                msg.body = html
                mail.send(msg)
                flash(f'email adr "{email}" is available. Check inbox to confirm email adr and'
                      f' activate user account', 'success')
            except:
                # TODO: come back to fix this exception
                flash(f'something went wrong and confirmation email "{email}" could not be sent.'
                      f'kindly contact iREPS admin at admin@ireps.co.za', 'danger')

            return redirect(url_for("index"))
        else:
            flash(f'invalid form data submitted. do correction and resubmit', 'danger')
    return render_template("unp_email_signup_form.html", form=form)


@app.route("/unp_confirm_email/<token>", methods=["GET", "POST"])
def unp_confirm_email(token):
    """starting unp_confirm_email function"""
    try:
        confirm_serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
        email = confirm_serializer.loads(token, salt='email-confirmation-salt', max_age=33600)
        # import pdb; pdb.set_trace()
    except SignatureExpired:
        # TODO email confirmation link has expired, delete the record with email from the unp_table
        # user = UsersNaturalPerson.query.filter_by(unp_email=email).first()
        # db.session.delete(user)
        # db.session.commit()
        flash('The confirmation link has expired.', 'danger')
        return redirect(url_for('unp_email_signup'))
    except:
        # TODO come back to this exception. use SignatureExpired exception.
        #  more exceptioons at https://itsdangerous.palletsprojects.com/en/1.1.x/exceptions/
        flash('The confirmation link is invalid.', 'danger')
        return redirect(url_for('unp_email_signup'))

    try:
        user = UsersNaturalPerson.query.filter_by(unp_a05_email=email).first()
    except:
        flash('Something went wrong.', 'danger')
        return redirect(url_for('unp_signin', email=email))

    if user.unp_a06_email_verified_on_datetime is not None:
        flash('Account already confirmed. Please login.', 'success')
        return redirect(url_for('unp_signin', email=email)) # this is a logon route
    else:
        # import pdb; pdb.set_trace()
        user.unp_a06_email_verified_on_datetime = datetime.now()
        db.session.add(user)
        db.session.commit()
        flash('Thank you for confirming your email address! choose a password to fully register.', 'success')
    return redirect(url_for('unp_pwd_signup', email=email))


@app.route("/unp_pwd_signup/<email>", methods=["GET", "POST"])
def unp_pwd_signup(email):
    """starting upn_pwd_signup function. this is when a user provides a password and conform it"""
    # import pdb; pdb.set_trace();
    form = UnpPwdSignUpForm(email=email)
    if request.method == "POST":
        if form.validate_on_submit():
            hashed_pwd = bcrypt.generate_password_hash(password=form.password.data).decode('utf-8')
            # get the record of the email supplied from the unp_users
            email = form.email.data
            try:
                # import pdb; pdb.set_trace();
                user = UsersNaturalPerson.query.filter_by(unp_a05_email=email).first()
            except:
                # TODO: come back to polish
                flash(f'email {email} does not exist in ireps database', 'success')
                return redirect(url_for('unp_pwd_signup', email=email))
            else:
                # import pdb; pdb.set_trace();
                user.unp_a10_password = hashed_pwd
                db.session.add(user)
                db.session.commit()
                flash(f'user email [{email}] successfully registered. you may sign in', 'success')
                return redirect(url_for("unp_signin"))
        else:
            flash(f'form fails to validate. please try again', 'danger')
    return render_template("unp_pwd_signup_form.html", form=form)


@app.route("/unp_signin", methods=["GET", "POST"])
def unp_signin():
    """starting unp_signin function"""
    form = UnpSignInForm()
    if request.method == "POST":
        if form.validate_on_submit():
            email = form.email.data
            password = form.password.data
            # import pdb; pdb.set_trace()
            try:
                user_record = UsersNaturalPerson.query.filter_by(unp_a05_email=email).first()
            except:
                # TODO: come back to polish the generic except
                flash(f'email {email} does not exist in ireps users database table', 'danger')
                return redirect(url_for('unp_signin', email=email))
            else:
                # user email is in the ireps urs_table. see if passwords match
                if user_record and bcrypt.check_password_hash(user_record.unp_a10_password, password):
                    # email and passwords do match, so log the user in and update user logon time
                    login_user(user_record, remember=form.remember.data)
                    user_record.unp_a12_log_on_at_datetime = datetime.now()
                    db.session.add(user_record)
                    db.session.commit()
                    # import pdb; pdb.set_trace()
                    # next_page = request.args.get('next')
                    # TODO : fix the redirect problem. at the moment it redirect only to mn_ireps irrespective.
                    #  It should redirect to next page
                    flash(f'user successfully logged in', 'success')
                    return redirect(request.args.get('next') or url_for('unp_profile'))
                else:
                    flash(f'could not logon, either email adr incorrect or not exist, or password mismatch, '
                          f'try again', 'danger')
        else:
            flash(f'some form input data is not valid, try again', 'danger')
    return render_template("unp_signin_form.html", form=form)


@app.route("/unp_pwd_reset_email", methods=["GET", "POST"])
def unp_pwd_reset_email():
    """starting unp_pwd_reset_email function"""
    form = UnpPwdEmailResetForm()
    if request.method == "POST":
        if form.validate_on_submit():
            email = form.email.data
            # the form does validate. now check if the email adr exists in the ireps usr_users table
            try:
                # import pdb; pdb.set_trace();
                user = UsersNaturalPerson.query.filter_by(unp_a05_email=email).first()
            except:
                # TODO: come back to polish
                flash(f'something went wrong, contact admin@innopen.co.za', 'danger')
                render_template("usr_pwd_reset_form_email.html", form=form)
            else:
                # import pdb; pdb.set_trace();
                if user is not None:
                    # email adr is in the db
                    return redirect(url_for('unp_pwd_reset', email=email))
                else:
                    flash(f'email {email} does not exist in ireps database', 'danger')
    return render_template("unp_pwd_reset_email_form.html", form=form)


@app.route("/unp_pwd_reset/<email>", methods=["GET", "POST"])
def unp_pwd_reset(email):
    """starting usr_pwd_reset function"""
    # import pdb; pdb.set_trace();
    form = UnpPwdResetForm(email=email)
    if request.method == "POST":
        if form.validate_on_submit():
            email = form.email.data
            password = form.password.data
            # get the record of the email supplied from the usr_users
            try:
                # import pdb; pdb.set_trace();
                user = UsersNaturalPerson.query.filter_by(unp_a05_email=email).first()
            except:
                # TODO: come back to polish
                flash(f'email {email} does not exist in ireps database', 'danger')
                return redirect(url_for('usr_pwd_reset_email', email=email))
            else:
                # import pdb; pdb.set_trace();
                if user is not None:
                    # email adr exixt in the ireps db
                    hashed_pwd = bcrypt.generate_password_hash(password=password).decode('utf-8')
                    user.unp_a10_password = hashed_pwd
                    # TODO : fix the utcnow time. its behind by 2 hrs
                    user.unp_a11_password_reset_on_datetime = datetime.now()
                    # import pdb; pdb.set_trace()
                    db.session.add(user)
                    db.session.commit()
                    flash(f'user password for email [{email}] successfully updated. you may sign in', 'success')
                    return redirect(url_for("unp_signin"))
                else:
                    flash(f'email {email} does not exist in ireps database', 'success')
        else:
            flash(f'form fails to validate. please try again', 'danger')
    return render_template("unp_pwd_reset_form.html", form=form)


@app.route("/unp_boqs")
def unp_boqs():
    return render_template("unp_boqs.html")


@app.route("/unp_emails")
def unp_emails():
    return render_template("unp_emails.html")


@app.route("/unp_logon_history")
def unp_logon_history():
    return render_template("unp_logon_history.html")


@app.route("/unp_profile")
def unp_profile():
    return render_template("unp_profile.html")


@app.route("/unp_smss")
def unp_smss():
    return render_template("unp_smss.html")


@app.route("/unp_stats")
def unp_stats():
    return render_template("unp_stats.html")


@login_manager.user_loader
def load_user(unp_a01_id):
    return UsersNaturalPerson.query.get(int(unp_a01_id))


@app.route("/unp_signout")
@login_required
def unp_signout():
    """starting unp_signout function"""
    user = current_user
    user.authenticated = False
    user.unp_a13_log_out_at_datetime = datetime.now()
    db.session.add(user)
    db.session.commit()
    logout_user()
    return redirect(url_for('index'))


#**********************************************************************************************************************#
#                                                                                                                      #
# START                                                wos, asts, trns                                                 #
#                                                                                                                      #
#**********************************************************************************************************************#

# idt is ireps datatable,
# op_code is either assets(asts) or transactions(trns),
# arc is asset (register) category
# trc is transaction code
@app.route("/idt/<op_code>/<arc>/<trc>")
def idt(op_code='', arc='', trc=''):
    return render_template("idt.html", op_code=op_code, arc=arc, trc=trc)

#**********************************************************************************************************************#
#                                                                                                                      #
# END                                               wos, asts, trns                                                    #
#                                                                                                                      #
#**********************************************************************************************************************#



#**********************************************************************************************************************#
#                                                                                                                      #
# START                                                knowledge bas                                                   #
#                                                                                                                      #
#**********************************************************************************************************************#


@app.route("/knowledge_base")
def knowledge_base():
    return render_template("knowledge_base.html")

#**********************************************************************************************************************#
#                                                                                                                      #
# END                                               wos, asts, trns                                                    #
#                                                                                                                      #
#**********************************************************************************************************************#





#**********************************************************************************************************************#
#                                                                                                                      #
# START                                                dbd                                                             #
#                                                                                                                      #
#**********************************************************************************************************************#


@app.route("/dbd_asts")
def dbd_asts():
    return render_template("dbd_asts.html", )


@app.route("/dbd_erfs")
def dbd_erfs():
    return render_template("dbd_erfs.html")


@app.route("/dbd_trns")
def dbd_trns():
    return render_template("dbd_trns.html")


@app.route("/dbd_unp")
def dbd_unp():
    return render_template("dbd_unp.html")



#**********************************************************************************************************************#
#                                                                                                                      #
# END                                                dbd                                                               #
#                                                                                                                      #
#**********************************************************************************************************************#



@app.route("/")
def index():
    """stating index function. this is the landing page for all visitor to ireps. it does not need authentication"""
    return render_template("index.html", filename="index")


########################################################################################################################
# flask main
########################################################################################################################


if __name__ == "__main__":
    app.run(debug=True)




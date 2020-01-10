from flask import Flask, render_template


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("unp.html")


@app.route("/unp_boqs")
def unp_boqs():
    return render_template("unp_boqs.html")


@app.route("/unp_emails")
def unp_emails():
    return render_template("unp_emails.html")


@app.route("/unp_logon_history")
def unp_logon_history():
    return render_template("unp_logon_history.html")


@app.route("/unp")
@app.route("/unp_profile")
def unp_profile():
    return render_template("unp_profile.html")


@app.route("/unp_smss")
def unp_smss():
    return render_template("unp_smss.html")


@app.route("/unp_stats")
def unp_stats():
    return render_template("unp_stats.html")


if __name__ == "__main__":
    app.run(debug=True)

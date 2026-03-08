# English Academy

An Italian-language educational platform for learning English, with a specialized section for Naval English (Marina Militare).

## Architecture

- **Backend**: Python / Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (served via Flask templates/static)
- **Production server**: Gunicorn

## Project Structure

```
app.py              # Flask application entry point
templates/
  index.html        # Main HTML template (Jinja2)
static/
  style.css         # All site styling
  script.js         # Quiz logic and navigation
requirements.txt    # Python dependencies (flask, gunicorn)
```

## Running the App

The app runs on port 5000 via the "Start application" workflow:
```
python app.py
```

## Deployment

Configured for Autoscale deployment with Gunicorn:
```
gunicorn --bind=0.0.0.0:5000 --reuse-port app:app
```

## Features

- Home page with course overview
- Course catalog (Base, Intermediate, Business, IELTS, Naval)
- Naval Military English section with ship types and terminology
- Interactive quizzes (multiple categories including Naval)
- Team/About page
- Contact form

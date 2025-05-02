from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import User, MeetingMinute
from app.services.openai_service import process_content
from app.utils.file_processing import read_docx
from sqlalchemy.exc import IntegrityError


summarization_bp = Blueprint('summarization', __name__)


def save_meeting_minute(title, summary, user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            raise ValueError("User  not found")

        new_minute = MeetingMinute(
            title=title,
            summary=summary,
            user_id=user_id
        )
        db.session.add(new_minute)
        db.session.commit()
        return new_minute

    except IntegrityError as e:
        db.session.rollback()
        current_app.logger.error(f"Integrity error: {str(e)}")
        raise ValueError("Failed to save meeting minute due to integrity error.")
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error saving meeting minute: {str(e)}")
        raise


@summarization_bp.route('/summarize', methods=['POST'])
@jwt_required()
def summarize():
    try:
        # Get user ID from JWT
        current_user_id = get_jwt_identity()

        content = None
        title = "Meeting Summary"

        if request.is_json:
            data = request.get_json()
            content = data.get('content')
            title = data.get('title', title)
        else:
            content = request.data.decode('utf-8').strip()

        if not content:
            return jsonify({"success": False, "message": "No content provided"}), 400

        result = process_content(content)

        # Check if the result indicates success and contains the expected keys
        if not result.get("success", False):
            return jsonify({"success": False, "message": result.get("message", "Failed to process content.")}), 422

        # Check for the presence of the 'minutes' key and its sub-keys
        if 'minutes' not in result or 'overview' not in result['minutes']:
            return jsonify({"success": False, "message": "Summary not generated correctly."}), 422

        # Save with JWT user ID
        minute = save_meeting_minute(title, result['minutes']['overview'], current_user_id)

        result['minute_id'] = minute.id
        return jsonify(result)

    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 422
    except Exception as e:
        current_app.logger.error(f"Error in summarize: {str(e)}")
        return jsonify({"success": False, "message": "An error occurred while processing your request."}), 500


@summarization_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    try:
        current_user_id = get_jwt_identity()

        if 'file' not in request.files:
            return jsonify({"success": False, "message": "No file provided"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"success": False, "message": "No file selected"}), 400

        title = file.filename.rsplit('.', 1)[0]

        if file.filename.endswith('.txt'):
            content = file.read().decode('utf-8')
        elif file.filename.endswith('.docx'):
            content = read_docx(file)
        else:
            return jsonify({"success": False, "message": "Unsupported file type"}), 400

        result = process_content(content)

        # Check if the result indicates success and contains the expected keys
        if not result.get("success", False):
            return jsonify({"success": False, "message": result.get("message", "Failed to process content.")}), 422

        # Check for the presence of the 'minutes' key and its sub-keys
        if 'minutes' not in result or 'overview' not in result['minutes']:
            return jsonify({"success": False, "message": "Summary not generated correctly."}), 422

        # Save with JWT user ID
        minute = save_meeting_minute(title, result['minutes']['overview'], current_user_id)

        result['minute_id'] = minute.id
        return jsonify(result)

    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 422
    except Exception as e:
        current_app.logger.error(f"Error in upload_file: {str(e)}")
        return jsonify({"success": False, "message": "An error occurred while processing your request."}), 500

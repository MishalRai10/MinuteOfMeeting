from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, MeetingMinute  # Import your User and MeetingMinute models

profile_bp = Blueprint('profile', __name__)


@profile_bp.route('/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        current_user_id = get_jwt_identity()

        # Convert string ID to integer for database lookup
        try:
            user_id_int = int(current_user_id)
        except ValueError:
            return jsonify({'message': 'Invalid user ID format'}), 422

        user = User.query.get(user_id_int)  # Query with integer ID

        if not user:
            return jsonify({'message': 'User  not found'}), 404

        return jsonify({
            'id': user.id,  # Returns as integer
            'username': user.username
        }), 200

    except Exception as e:
        print(f"Profile Error: {str(e)}")
        return jsonify({'message': 'Server error'}), 500


# Get User Meeting Minutes
@profile_bp.route('/user/minutes', methods=['GET'])
@jwt_required()
def get_user_minutes():
    try:
        current_user_id = get_jwt_identity()

        # Convert string ID to integer for database lookup
        try:
            user_id_int = int(current_user_id)
        except ValueError:
            return jsonify({'message': 'Invalid user ID format'}), 422

        minutes = MeetingMinute.query.filter_by(user_id=user_id_int).all()  # Fetch user's minutes

        return jsonify([{
            'id': minute.id,
            'title': minute.title,
            'summary': minute.summary,
            'created_at': minute.created_at.isoformat()  # Format date as ISO string
        } for minute in minutes]), 200

    except Exception as e:
        print(f"Error fetching user minutes: {str(e)}")
        return jsonify({'message': 'Server error'}), 500


# Delete Meeting Minute
@profile_bp.route('/user/minutes/<int:minute_id>', methods=['DELETE'])
@jwt_required()
def delete_meeting_minute(minute_id):
    try:
        current_user_id = get_jwt_identity()

        # Convert string ID to integer for database lookup
        try:
            user_id_int = int(current_user_id)
        except ValueError:
            return jsonify({'message': 'Invalid user ID format'}), 422

        minute = MeetingMinute.query.filter_by(id=minute_id, user_id=user_id_int).first()
        if minute:
            minute.delete()  # Assuming you have a delete method in your MeetingMinute model
            return jsonify({'message': 'Meeting minute deleted successfully'}), 200

        return jsonify({'message': 'Minute not found'}), 404

    except Exception as e:
        print(f"Error deleting meeting minute: {str(e)}")
        return jsonify({'message': 'Server error'}), 500

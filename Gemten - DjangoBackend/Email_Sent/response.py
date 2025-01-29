def get_user_not_found_response(**kwargs):
    response = {
        "status": False,
        "title": "Opps! User not found! ",
        "message": kwargs.get('message') or "User not found! ",
    }
    return response
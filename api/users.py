from api_manager import api_manager
from preprocessors import is_admin
from models import User

users = api_manager.create_api_blueprint(
    User,
    methods=['GET', 'PUT'],
    collection_name='users',
    preprocessors = {
        'GET_SINGLE'   : [is_admin],
        'GET_MANY'     : [is_admin],
        'PATCH_SINGLE' : [is_admin]
    },
    exclude_columns=['password_hash'],
    results_per_page=None)


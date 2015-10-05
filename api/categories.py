from api_manager import api_manager
from preprocessors import is_admin
from models import Category

categories = api_manager.create_api_blueprint(
    Category, 
    methods=['GET', 'DELETE', 'POST'], 
    preprocessors = {
        'DELETE_SINGLE': [is_admin],
        'PATCH_SINGLE': [is_admin]},
    collection_name='categories',
    results_per_page=None)

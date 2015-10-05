from api_manager import api_manager
from preprocessors import logged_in
from models import Tag

tags = api_manager.create_api_blueprint(
    Tag,
    methods=['GET', 'POST', 'PUT', 'DELETE'],
    preprocessors = {
        'PATCH_SINGLE'  : [logged_in],
        'POST'          : [logged_in],
        'DELETE_SINGLE' : [logged_in]},
    collection_name='tags',
    results_per_page=None)



from api_manager import api_manager
from preprocessors import refs_get_many_preprocessor, logged_in, set_user_ids, is_admin
from models import Ref

refs = api_manager.create_api_blueprint(
    Ref, 
    methods=['GET','PUT', 'DELETE'], 
    collection_name='refs', 
    preprocessors = {
        'GET_MANY'      : [refs_get_many_preprocessor],
        'PATCH_SINGLE'  : [logged_in, set_user_ids],
        'DELETE_SINGLE' : [is_admin]},
    include_methods=['img.href', 'tags.category'],
    results_per_page=None)



from models import Img
from api_manager import api_manager

imgs = api_manager.create_api_blueprint(
    Img,
    methods=['GET'],
    collection_name='imgs',
    include_methods=['href'])

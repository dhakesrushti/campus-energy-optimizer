import logging
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database.mongo import db
from routes.prediction_routes import prediction_bp
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Load config
    app.config.from_object(Config)
    
    # Create required directories
    os.makedirs(os.path.join(os.path.dirname(__file__), 'models'), exist_ok=True)
    os.makedirs(os.path.join(os.path.dirname(__file__), 'logs'), exist_ok=True)
    
    # Initialize DB
    with app.app_context():
        db.initialize(app.config['MONGO_URI'], app.config['DATABASE_NAME'], app.config['COLLECTION_NAME'])

    # Register blueprints
    app.register_blueprint(prediction_bp)

    @app.route('/', methods=['GET'])
    def health_check():
        return jsonify({
            "message": "Campus Energy Optimizer Backend Running"
        })

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)

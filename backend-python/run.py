# ==========================================
# RUN FLASK APP
# ==========================================
import os
from dotenv import load_dotenv
from app import create_app

load_dotenv()

app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    port = int(os.getenv('PYTHON_PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"""
╔════════════════════════════════════════╗
║   STRIPE PAGOS - PYTHON BACKEND        ║
╠════════════════════════════════════════╣
║   Port: {port}                          
║   Environment: {os.getenv('FLASK_ENV', 'development')}
║   API: http://localhost:{port}/api
║   Health: http://localhost:{port}/health
╚════════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=port, debug=debug)

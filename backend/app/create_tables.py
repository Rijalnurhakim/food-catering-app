from app.database import engine, Base
from app.models import Product, Order, OrderItem

def create_tables():
    print("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")
    except Exception as e:
        print(f"❌ Error: {e}")
        raise

if __name__ == "__main__":
    create_tables()
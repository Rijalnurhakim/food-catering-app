from app.database import SessionLocal
from app.models import Product


def seed_data():
    db = SessionLocal()
    try:
        sample_products = [
            Product(name="Nasi Goreng Spesial", description="Nasi goreng spesial", price=25000, category="Paket Harian",
                    stock=50),
            Product(name="Paket Salad Diet", description="Salad diet", price=35000, category="Paket Diet", stock=30),
            Product(name="Lumpiah Vegan", description="Lumpiah vegan", price=20000, category="Paket Vegan", stock=40),
            Product(name="Brownies Coklat", description="Brownies coklat", price=15000, category="Snack", stock=100),
            Product(name="Ayam Bakar Madu", description="Ayam bakar madu", price=30000, category="Paket Harian",
                    stock=25)
        ]

        db.query(Product).delete()
        db.add_all(sample_products)
        db.commit()
        print("✅ Sample data inserted successfully!")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
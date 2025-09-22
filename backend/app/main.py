from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .database import get_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="BiteSwift API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to BiteSwift Catering API"}


@app.get("/products", response_model=List[schemas.Product])
def get_products(category: str = None, sort: str = None, db: Session = Depends(get_db)):
    print(f"DEBUG: Category='{category}', Sort='{sort}'")

    query = db.query(models.Product)

    if category:
        # Normalize category input
        category = category.replace('+', ' ').replace('%20', ' ').strip().lower()

        # Get all products and filter case-insensitively
        all_products = query.all()
        results = [p for p in all_products if p.category.lower() == category]
    else:
        results = query.all()

    # Apply sorting
    if sort == "price_asc":
        results = sorted(results, key=lambda x: x.price)
    elif sort == "price_desc":
        results = sorted(results, key=lambda x: x.price, reverse=True)
    else:
        results = sorted(results, key=lambda x: x.created_at, reverse=True)

    print(f"DEBUG: Found {len(results)} products")
    return results


@app.post("/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    total_amount = 0

    # Validasi produk dan hitung total
    for item in order.order_items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        total_amount += product.price * item.quantity

    # Create order
    db_order = models.Order(
        customer_email=order.customer_email,
        customer_name=order.customer_name,
        shipping_address=order.shipping_address,
        total_amount=total_amount
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Create order items
    for item in order.order_items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        order_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_time=product.price
        )
        # Update stock
        product.stock -= item.quantity
        db.add(order_item)

    db.commit()
    db.refresh(db_order)
    return db_order


@app.get("/orders", response_model=List[schemas.Order])
def get_orders(email: str, db: Session = Depends(get_db)):
    orders = db.query(models.Order).filter(models.Order.customer_email == email).all()
    return orders


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: str
    stock: int = 0


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # Ganti dari orm_mode


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    order_id: int
    price_at_time: float

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_email: EmailStr
    customer_name: str
    shipping_address: str
    order_items: List[OrderItemCreate]


class OrderCreate(OrderBase):
    @field_validator('order_items')
    @classmethod
    def check_order_items(cls, v):
        if not v:
            raise ValueError('Order must have at least one item')
        return v


class Order(OrderBase):
    id: int
    total_amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
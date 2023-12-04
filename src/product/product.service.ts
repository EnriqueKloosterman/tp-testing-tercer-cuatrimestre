import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { v4 as uuidv4 } from 'uuid';
const DB_URL = 'http://localhost:3030/products';

@Injectable()
export class ProductService {
  async create(createProductDto: CreateProductDto): Promise<any> {
    // This action creates a new product
    const id = await uuidv4();
    const productName = await createProductDto.product_name;
    const price = await createProductDto.price;
    const description = await createProductDto.description;
    const category = await createProductDto.category;
    const image = await createProductDto.image;
    const stock = await createProductDto.stock;
    const newProduct = {
      id,
      product_name: productName,
      price,
      description,
      category,
      stock,
      image,
    };
    const res = await fetch(DB_URL, {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  }

  async findAllProducts(): Promise<any> {
    // This action returns all products
    const res = await fetch(DB_URL);
    const parsed = await res.json();
    const showProduct = parsed.map((product: CreateProductDto) => ({
      name: product.product_name,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.stock,
      image: product.image,
    }));
    return showProduct;
  }

  async findOneProduct(id: string): Promise<any> {
    // This action returns product by its id
    const res = await fetch(`${DB_URL}/${id}`);
    const parsed = await res.json();
    return parsed;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<any> {
    //This action updates a product 
    const productExist = await this.findOneProduct(id);
    if (!Object.keys(productExist).length) return;
    const productUpdate = { ...productExist, ...updateProductDto };
    await fetch(`${DB_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productUpdate)
    })
  }

  async deleteProduct(id: string): Promise<any> {
    // `This action removes a product by id
    const res = await fetch(`${DB_URL}/${id}`, {
      method: 'DELETE',
    });
    const parsed = await res.json();
    return parsed;
  }
}

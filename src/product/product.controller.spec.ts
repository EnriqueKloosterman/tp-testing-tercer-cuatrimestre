import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Response } from 'express';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });
  
  it('deberia crear un producto', async ()=>{
    const mockedResult: CreateProductDto = {
      product_name: 'producto 1',
      price: 100,
      stock: 10,
      description: 'descripcion del producto',
      category: 'categoria 1',
      image: 'imagen del producto'
    }
    jest.spyOn(service, 'create').mockResolvedValue(mockedResult)
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    try {
      await controller.create(mockedResult, res as Response);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockedResult);
    } catch (error) {
      expect(error).toBe(error);
    }
  })

  it('deberia manejar la falla en la creacion', async ()=>{
    const mockedResult: CreateProductDto = {
      product_name: 'producto 1',
      price: 100,
      stock: 10,
      description: 'descripcion del producto',
      category: 'categoria 1',
      image: 'imagen del producto'
    }
    jest.spyOn(service, 'create').mockRejectedValue(new Error('fallo la creacion del producto'));
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    try {
      await controller.create(mockedResult, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({message: 'fallo la creacion del producto'});
    } catch (error) {
      expect(error.message).toBe('fallo la creacion del producto');
    }
  })

  it('deberia devolver un array de productos', async ()=>{
    const mockedResult: CreateProductDto[] =[
      {
        product_name: 'producto 1',
        price: 100,
        stock: 10,
        description: 'descripcion del producto',
        category: 'categoria 1',
        image: 'imagen del producto'
      }
    ];
    jest.spyOn(service, 'findAllProducts').mockResolvedValue(mockedResult);
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    try {
      await controller.findAllProducts(res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedResult)
    } catch (error) {
      expect(error).toBe(error);
    }
  })

  it('deberia manejar el error en la peticion', async ()=> {
    jest.spyOn(service, 'findAllProducts').mockRejectedValue(new Error('fallo la peticion'));
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    try {
      await controller.findAllProducts(res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: 'fallo la peticion'});
    } catch (error) {
      expect(error).toBe(error);
    }
  })

  it('deberia devolver un producto por su id', async ()=>{
    const mockedResult: CreateProductDto = {
      product_name: 'producto 1',
      price: 100,
      stock: 10,
      description: 'descripcion del producto',
      category: 'categoria 1',
      image: 'imagen del producto'
    }
    jest.spyOn(service, 'findOneProduct').mockResolvedValue(mockedResult);
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    try{
      await controller.findOneProduct('1', res as Response);
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockedResult);
    }catch(error){
      expect(error).toBe(error)
    }
  });

  it('deberia delvorver un mensajen de error si el id no es correcto', async ()=>{
    jest.spyOn(service, 'findOneProduct').mockRejectedValue(new Error('product not found'));
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    try {
      await controller.findOneProduct('1', res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({message: 'product not found'});
    } catch (error) {
      expect(error).toBe(error);
    }
  })

  it('deberia eliminar un producto existente', async () => {
    const productId = '1';
    const deletedProduct: CreateProductDto = {
      product_name: 'Producto Eliminado',
      price: 100,
      stock: 10,
      description: 'Descripción del producto eliminado',
      category: 'Categoría del producto eliminado',
      image: 'imagen-eliminada.jpg'
    };
    jest.spyOn(service, 'deleteProduct').mockResolvedValue(deletedProduct);
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    try {
      await controller.remove(productId, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedProduct);
    } catch (error) {
      expect(error).toBe(error);
    }
  });
  it('deberia manejar el error al intentar eliminar un producto', async () => {
    const productId = 'invalid_id';
    jest.spyOn(service, 'deleteProduct').mockRejectedValue(new Error('Error al eliminar el producto'));
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    try {
      await controller.remove(productId, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al eliminar el producto' });
    } catch (error) {
      expect(error.message).toBe('Product with id invalid_id not found');
    }
  });
  it('deberia actualizar un producto existente', async () => {
    const productId = '1';
    const updateProduct: CreateProductDto = {
      product_name: 'Producto Actualizado',
      price: 150,
      stock: 20,
      description: 'Nueva descripción',
      category: 'Nueva Categoría',
      image: 'nueva-imagen.jpg'
    };
    jest.spyOn(service, 'updateProduct').mockResolvedValue(updateProduct);
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    try {
      await controller.updateProduct(productId, updateProduct);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updateProduct);
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});


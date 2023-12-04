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
    await controller.create(mockedResult, res as Response);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockedResult);
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
    await controller.findAllProducts(res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockedResult)
  })

  it('deberia manejar el error en la peticion', async ()=> {
    // const mockedResult: CreateProductDto[] =[
    //   {
    //     product_name: 'producto 1',
    //     price: 100,
    //     stock: 10,
    //     description: 'descripcion del producto',
    //     category: 'categoria 1',
    //     image: 'imagen del producto'
    //   }
    // ];
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

});


import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Response } from 'express'

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

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
      // id: 'xxxxxxxxxx',
      product_name: "nombre del producto",
      description: "descripcion del producto",
      category: "categoria del producto",
      price: 1000,
      stock: 10,
      image: "imagen del producto"
      };

      const mockServiceResponse = {}; // Mock the service response here

      jest.spyOn(service, 'create').mockResolvedValue(mockServiceResponse);

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.create(createProductDto, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockServiceResponse);
    });
});
});


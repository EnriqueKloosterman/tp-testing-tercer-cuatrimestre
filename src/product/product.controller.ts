import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe, HttpStatus, Res, BadRequestException, NotFoundException } from '@nestjs/common';
import { Response } from 'express'; 
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response): Promise<any> {
    // return this.productService.create(createProductDto);
    try {
      const serviceResponse = await this.productService.create(createProductDto);
      res.status(HttpStatus.CREATED).json(serviceResponse)
      console.log('Producto creado exitosamente');
    } catch (error) {
        throw new BadRequestException('fallo la creacion del producto')
    }
  }

  @Get()
  @UsePipes(new ValidationPipe({transform: true}))
  async findAllProducts(@Res() res: Response): Promise<any> {
    // return this.productService.findAllProducts();
    try {
        const serviceResponse = await this.productService.findAllProducts();
        return res.status(HttpStatus.OK).json(serviceResponse)
    } catch (error) {
      throw res.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({transform: true}))
  async findOneProduct(@Param('id') id: string, @Res() res: Response): Promise<any>  {
    try {
      const serviceResponse = await this.productService.findOneProduct(id);
      if(Object.keys(serviceResponse).length){
        return res.status(HttpStatus.OK).json(serviceResponse)
      }else{
        throw new NotFoundException(`product with id ${id} not found`)
      }
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({transform: true}))
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<UpdateProductDto> {
    // return this.productService.updateProduct(id, updateProductDto);
    try {
      const serviceResponse = this.productService.updateProduct(id, updateProductDto);
      if(!serviceResponse){
        throw new NotFoundException(`product not found`)
      }
      return this.productService.updateProduct(id, updateProductDto);
    } catch (error) {
      throw new BadRequestException(`product not found`)
    }
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({transform: true}))
  async remove(@Param('id') id: string, @Res() res: Response): Promise<any> {
    try {
      const serviceResponse = await this.productService.deleteProduct(id);
      return res.status(HttpStatus.NO_CONTENT).json(serviceResponse);
    } catch (error) {
        throw new BadRequestException(`Product with id ${id} not found`)
    }
  }
}

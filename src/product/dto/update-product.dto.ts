import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsString, IsNumber } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    
    @IsString()
    product_name: string;

    @IsNumber()
    price: number;

    @IsString()
    description: string;

    @IsString()
    category: string;
    
    @IsString()
    image: string;
}

import { IsString, IsNotEmpty, IsNumber } from "class-validator";


export class CreateProductDto {
    // @IsString()
    // @IsNotEmpty()
    // id?: string;//!

    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    category: string;
    
    @IsString()
    @IsNotEmpty()
    image: string;

    @IsNumber()
    @IsNotEmpty()
    stock: number;
}

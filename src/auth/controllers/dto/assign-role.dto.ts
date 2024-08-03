import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AssignRoleDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  roleName: string;
}

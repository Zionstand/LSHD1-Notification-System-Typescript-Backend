import { IsNumber } from 'class-validator';

export class CreateScreeningDto {
  @IsNumber()
  clientId: number;

  @IsNumber()
  notificationTypeId: number;
}

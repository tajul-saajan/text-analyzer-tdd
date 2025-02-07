import { validate, ValidationError } from 'class-validator';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { Response } from 'express';

export const validateRequest = async <T>(DtoClass: ClassConstructor<T>, object: object, res: Response): Promise<T | null> => {
  const dtoObject = plainToClass(DtoClass, object);

  const errors: ValidationError[] = await validate(dtoObject as object);

  if (errors.length === 0) return dtoObject;

  return res.status(422).json({
    message: 'Validation failed',
    errors: errors.map(err => ({
      property: err.property,
      constraints: err.constraints,
    })),
  }) as any;
};

import { Transform } from 'class-transformer';
import * as mongoose from 'mongoose';

/**
 * transform string to TYpes.ObjectId
 */
export function ObjectIdTransformer(): PropertyDecorator {
  return Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((item: string) => new mongoose.Types.ObjectId(item));
    }
    return new mongoose.Types.ObjectId(value);
  });
}
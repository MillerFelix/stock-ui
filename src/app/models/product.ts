import { Supplier } from './supplier';
import { Type } from './type';

export interface Product {
  id?: number;
  name?: string;
  type?: Type;
  value?: number;
  supplier?: Supplier;
  amount?: number;
  description?: string;
}

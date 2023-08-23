import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Page } from '../models/page';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_STOCK_PRODUCTS = 'http://localhost:8080/products';

  http = inject(HttpClient);

  getCombinationProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_STOCK_PRODUCTS);
  }

  getPaginatedListProducts(
    page: number,
    size: number
  ): Observable<Page<Product>> {
    const url = `${this.API_STOCK_PRODUCTS}/products`;
    const params = { page: page.toString(), size: size.toString() };

    return this.http.get<Page<Product>>(url, { params });
  }

  filterProduct(id: string | number): Observable<Product> {
    return this.http.get<Product>(`${this.API_STOCK_PRODUCTS}/${id}`);
  }

  filterProductsByType(id: string | number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_STOCK_PRODUCTS}/type/${id}`);
  }

  create(data: Product) {
    return this.http.post<Product>(this.API_STOCK_PRODUCTS, data);
  }

  update(data: Product) {
    return this.http.put(this.API_STOCK_PRODUCTS, data);
  }

  delete(id: string | number) {
    return this.http.delete(`${this.API_STOCK_PRODUCTS}/${id}`, {
      responseType: 'text',
    });
  }

  getGraphAmountByType(): Observable<any> {
    return this.http.get<any>(`${this.API_STOCK_PRODUCTS}/types-amount`);
  }

  getGraphValuesByType(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      `${this.API_STOCK_PRODUCTS}/types-values`
    );
  }

  getGraphProductsValues(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      `${this.API_STOCK_PRODUCTS}/products-values`
    );
  }

  findProductValue(id: string | number): Observable<number> {
    const url = `${this.API_STOCK_PRODUCTS}/product-value/${id}`;
    return this.http.get<number>(url);
  }
}

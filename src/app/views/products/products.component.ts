import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  form!: FormGroup;

  productsService = inject(ProductsService);
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService
      .getCombinationProducts()
      .subscribe((data) => (this.products = data));
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [''],
      nome: ['', [Validators.required]],
      type: [],
      value: ['', [Validators.required]],
      supplier: [''],
      amount: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  createProduct(): void {
    this.productsService.create(this.form.value).subscribe(() => {
      console.log('Produto Criado!');
    });
  }
}

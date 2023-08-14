import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
      .getProducts()
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

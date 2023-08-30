import { Page } from './../../models/page';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Type } from 'src/app/models/type';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { Supplier } from 'src/app/models/supplier';
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from 'primeng/api';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  listProducts: Product[] = [];
  selectedProducts: Product[] = [];
  selectedProduct: any;
  filteredProducts: any;

  types: Type[] = [];
  listTypes: Type[] = [];
  selectedTypes: Type[] = [];
  selectedTypeByProduct: any;
  filteredTypes: any;

  type?: Type;
  visibleFormProduct: boolean = false;
  visibleFormType: boolean = false;
  selectedTypeCreate: Type | undefined;

  suppliers: Supplier[] = [];

  page!: Page;
  formProduct!: FormGroup;
  formType!: FormGroup;
  buttonClearDisable?: boolean;
  buttonFindDisable?: boolean;

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  productsService = inject(ProductsService);
  suppliersService = inject(SuppliersService);
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.findAll();
    this.createFormNewProduct();
    this.createFormNewType();
  }

  findAll(): void {
    if (this.selectedProduct) {
      this.buttonClearDisable = false;
      this.buttonFindDisable = true;
      this.filterProduct(this.selectedProduct);
    } else if (this.selectedTypeByProduct) {
      this.buttonClearDisable = false;
      this.buttonFindDisable = true;
      this.filterProductsByType(this.selectedTypeByProduct);
    } else {
      this.buttonClearDisable = true;
      this.buttonFindDisable = false;
      this.loadGridProducts();
    }
    this.loadGridTypes();
    this.loadListProducts();
    this.loadListTypes();
  }

  // PRODUCTS:

  createFormNewProduct(): void {
    this.suppliersService.getListSuppliers().subscribe((data) => {
      this.suppliers = data;
    });
    this.formProduct = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      type: [],
      value: ['', [Validators.required]],
      supplier: [''],
      amount: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  loadGridProducts(): void {
    this.productsService.getPaginatedListProducts().subscribe((data) => {
      this.products = data;
    });
  }

  loadListProducts(): void {
    this.productsService.getListProducts().subscribe((data) => {
      this.listProducts = data;
    });
  }

  loadFilterProduct(event: AutoCompleteCompleteEvent): void {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.listProducts as any[]).length; i++) {
      let product = (this.listProducts as any[])[i];
      if (product.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.filteredProducts = filtered;
  }

  filterProduct(product: string): void {
    this.selectedProduct = product;
    const id = this.selectedProduct.id;
    this.productsService.filterProduct(id).subscribe((data) => {
      this.products = [];
      this.products = data;
    });
  }

  filterProductsByType(type: string): void {
    this.selectedTypeByProduct = type;
    const id = this.selectedTypeByProduct.id;
    this.productsService.filterProductsByType(id).subscribe((data) => {
      this.products = [];
      this.products = data;
    });
  }

  createProduct(): void {
    this.visibleFormProduct = true;
  }

  saveProduct(): void {
    this.productsService
      .createProduct(this.formProduct.value)
      .subscribe(() => {});
  }

  editProduct(product: Product): void {}

  openDeleteProduct() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
        });
      },
    });
  }

  deleteProduct(id: number): void {
    this.productsService.deleteProduct(id).subscribe(
      () => {
        console.log('Product deleted successfully.');
        // Adicionar comportamento de sucesso após exclusão.
      },
      (error) => {
        console.error('Error deleting product:', error);
        // Adicionar comportamento de erro após exclusão.
      }
    );
  }

  // TYPES:

  createFormNewType(): void {
    this.formType = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  loadGridTypes(): void {
    this.productsService.getPaginatedListTypes().subscribe((data) => {
      this.types = data;
    });
  }

  loadListTypes(): void {
    this.productsService.getListTypes().subscribe((data) => {
      this.listTypes = data;
    });
  }

  loadFilterTypes(event: AutoCompleteCompleteEvent): void {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.listTypes as any[]).length; i++) {
      let type = (this.listTypes as any[])[i];
      if (type.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(type);
      }
    }
    this.filteredTypes = filtered;
  }

  createType(): void {
    this.visibleFormType = true;
  }

  saveType(): void {
    this.productsService.createType(this.formType.value).subscribe(() => {});
  }

  editType(type: Type): void {}

  deleteType(id: number): void {
    this.productsService.deleteType(id).subscribe(
      () => {
        console.log('Type deleted successfully.');
        // Adicionar comportamento de sucesso após exclusão.
      },
      (error) => {
        console.error('Error deleting type:', error);
        // Adicionar comportamento de erro após exclusão.
      }
    );
  }

  clear() {
    this.selectedProduct = null;
    this.selectedTypeByProduct = null;
    this.findAll();
  }
}

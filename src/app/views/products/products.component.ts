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
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, switchMap } from 'rxjs';

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
  formProduct!: FormGroup;
  selectedProducts: Product[] = [];
  editedProductId: any;
  viewInfoProduct?: Product[];
  selectedProduct: any;
  filteredProducts: any;
  selectedProductDelete: any;
  visibleFormProduct: boolean = false;
  visibleEditFormProduct: boolean = false;

  valueProductsCard: number = 0;
  amountProductsCard: number = 0;
  amountSuppliersCard: number = 0;
  suppliersCard: Supplier[] = [];
  cardSupplier: boolean = false;

  types: Type[] = [];
  listTypes: Type[] = [];
  selectedTypes: Type[] = [];
  selectedTypeByProduct: any;
  editedTypeId: any;
  filteredTypes: any;
  visibleEditFormType: boolean = false;
  type?: Type;
  visibleFormType: boolean = false;
  selectedTypeCreate: Type | undefined;
  selectedTypeDelete: any;
  formType!: FormGroup;

  suppliers: Supplier[] = [];
  page!: Page;
  viewVisible: { [key: string]: boolean } = {};

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  productsService = inject(ProductsService);
  suppliersService = inject(SuppliersService);
  fb = inject(FormBuilder);
  supplierName?: any;
  supplierCountry?: any;
  supplierState?: any;
  product?: any;

  ngOnInit(): void {
    this.findAll();
    this.createFormNewProduct();
    this.createFormNewType();
  }

  findAll(): void {
    if (this.selectedProduct) {
      this.filterProduct(this.selectedProduct);
    } else if (this.selectedTypeByProduct) {
      this.filterProductsByType(this.selectedTypeByProduct);
    } else {
      this.loadGridProducts();
    }
    this.loadGridTypes();
    this.loadListProducts();
    this.loadListTypes();
    this.countSuppliers();

    setTimeout(() => {
      this.calculateCards();
    }, 200);
  }

  clear() {
    this.selectedProduct = null;
    this.selectedTypeByProduct = null;
    this.cardSupplier = false;
    this.findAll();
  }

  calculateCards() {
    this.valueProductsCard = this.products.reduce((total, product) => {
      if (product.value !== undefined && product.amount !== undefined) {
        return total + product.value * product.amount;
      } else {
        return total;
      }
    }, 0);
    this.amountProductsCard = this.products.reduce((total, product) => {
      if (product.amount !== undefined) {
        return total + product.amount;
      } else {
        return total;
      }
    }, 0);
  }

  countSuppliers(): void {
    this.suppliersService.getListSuppliers().subscribe((data) => {
      this.suppliersCard = data;
      if (this.suppliersCard && Array.isArray(this.suppliersCard)) {
        this.amountSuppliersCard = this.suppliersCard.length;
      } else {
        this.amountSuppliersCard = 0;
      }
    });
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
    this.productsService
      .getPaginatedListProducts()
      .pipe(
        switchMap((data) => {
          this.products = data;
          return of(data);
        })
      )
      .subscribe(() => {
        this.calculateCards();
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
    this.selectedTypeByProduct = null;
    this.selectedProduct = product;
    const id = this.selectedProduct.id;
    this.productsService.filterProduct(id).subscribe(
      (data) => {
        this.products = [];
        this.products = data;
        if (this.products.length > 0) {
          this.cardSupplier = true;
          this.product = this.products[0];

          this.supplierName = this.product.supplier.name;
          this.supplierState = this.product.supplier.state;
          this.supplierCountry = this.product.supplier.country;
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          key: 'filterProduct',
          detail: 'Este Produto não Existe!',
        });
      }
    );
  }

  filterProductsByType(type: string): void {
    this.selectedProduct = null;
    this.selectedTypeByProduct = type;
    const id = this.selectedTypeByProduct.id;
    this.productsService.filterProductsByType(id).subscribe(
      (data) => {
        this.products = [];
        this.products = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          key: ' filterProductsByType',
          detail: 'Não há Produtos com este Tipo!',
        });
      }
    );
  }

  createProduct(): void {
    this.formProduct.reset();
    this.visibleFormProduct = true;
  }

  saveProduct(): void {
    if (this.formProduct.valid) {
      this.productsService.createProduct(this.formProduct.value).subscribe({
        complete: () => {
          this.visibleFormProduct = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            key: 'saveProduct',
            detail: 'Produto Salvo!',
          });
        },
      });
      this.calculateCards();
      setTimeout(() => {
        this.findAll();
      }, 1000);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro!',
        key: 'saveProduct',
        detail: 'Preencha todos os Campos Obrigatórios antes de Salvar.',
      });
    }
  }

  viewProduct(id: string) {
    this.productsService.filterProduct(id).subscribe((data) => {
      this.viewInfoProduct = data;
      this.viewVisible[id] = true;
    });
  }

  editProduct(product: Product): void {
    this.formProduct.patchValue({
      name: product.name,
      amount: product.amount,
      value: product.value,
      type: product.type,
      supplier: product.supplier,
      description: product.description,
    });
    this.editedProductId = product.id;
    this.visibleEditFormProduct = true;
  }

  updateProduct(): void {
    if (this.formProduct.valid && this.editedProductId !== null) {
      const updatedProduct: Product = {
        id: this.editedProductId,
        ...this.formProduct.value,
      };

      this.productsService
        .updateProduct(this.editedProductId, updatedProduct)
        .subscribe(
          (response: any) => {
            if (
              response &&
              response.message === 'Product updated successfully!'
            ) {
              this.visibleEditFormProduct = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso!',
                key: 'updateProduct',
                detail: updatedProduct.name + ' Editado!',
              });
              this.findAll();
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro!',
              key: 'updateProduct',
              detail: 'Erro ao atualizar produto!',
            });
          }
        );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro!',
        key: 'updateProduct',
        detail: 'Preencha todos os Campos Obrigatórios antes de Atualizar.',
      });
    }
  }

  openDeleteProduct(product: any) {
    this.selectedProductDelete = product;
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      header: 'Excluir',
      icon: 'pi pi-info-circle',
      key: 'product',
    });
  }

  deleteProduct(confirmProduct: boolean) {
    this.confirmationService.close();
    if (confirmProduct) {
      const productIdToDelete = this.selectedProductDelete.id;
      this.productsService.deleteProduct(productIdToDelete).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            key: 'deleteProduct',
            detail:
              'Produto ' + this.selectedProductDelete.name + ' Excluído...',
          });

          this.loadGridProducts();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'deleteProduct',
            detail: 'Erro ao excluir produto!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelou...',
        key: 'deleteProduct',
        detail: 'A Exclusão foi Cancelada!',
      });
      this.loadGridProducts();
    }
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
    this.formType.reset();
    this.visibleFormType = true;
  }

  saveType(): void {
    if (this.formType.valid) {
      this.productsService.createType(this.formType.value).subscribe({
        complete: () => {
          this.visibleFormType = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            key: 'saveType',
            detail: 'Tipo de Produto Salvo!',
          });
          this.findAll();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'saveType',
            detail: 'Erro ao salvar o tipo de produto!',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro!',
        key: 'saveType',
        detail: 'Preencha todos os Campos Obrigatórios antes de Salvar.',
      });
    }
  }

  editType(type: Type): void {
    this.formType.patchValue({
      name: type.name,
      description: type.description,
    });
    this.editedTypeId = type.id;
    this.visibleEditFormType = true;
  }

  updateType(): void {
    if (this.formType.valid && this.editedTypeId !== null) {
      const updatedType: Type = {
        id: this.editedTypeId,
        ...this.formType.value,
      };

      this.productsService.updateType(this.editedTypeId, updatedType).subscribe(
        (response: any) => {
          if (response && response.message === 'Type updated successfully!') {
            this.visibleEditFormType = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso!',
              key: 'updateType',
              detail: updatedType.name + ' Editado!',
            });
            this.findAll();
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'updateType',
            detail: 'Erro ao atualizar o Tipo!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro!',
        key: 'updateType',
        detail: 'Preencha todos os Campos Obrigatórios antes de Atualizar.',
      });
    }
  }

  openDeleteType(type: any) {
    this.selectedTypeDelete = type;
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      header: 'Excluir',
      icon: 'pi pi-info-circle',
      key: 'type',
    });
  }

  deleteType(confirmType: boolean) {
    this.confirmationService.close();
    if (confirmType) {
      const typeIdToDelete = this.selectedTypeDelete.id;
      this.productsService.deleteType(typeIdToDelete).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            key: 'deleteType',
            detail: this.selectedTypeDelete.name + ' ' + 'Excluído...',
          });
          setTimeout(() => {
            this.findAll();
          }, 2600);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            key: 'deleteType',
            detail: 'Tipo em Uso!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelou...',
        key: 'deleteType',
        detail: 'A Exclusão foi Cancelada!',
      });
    }
  }
}

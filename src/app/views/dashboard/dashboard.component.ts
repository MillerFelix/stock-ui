import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ProductsService } from 'src/app/services/products.service';
import { SuppliersService } from 'src/app/services/suppliers.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  productService = inject(ProductsService);
  supplierstService = inject(SuppliersService);

  dataGraphAmountByType: any;
  optionsGraphAmountByType: any;

  dataGraphValuesByType: any;
  optionsGraphValuesByType: any;

  dataGraphProductsValues: any;
  optionsGraphProductsValues: any;

  optionsGraphAmountByStates: any;
  dataGraphAmountByStates: any;

  dataGraphAmountByCategory: any;
  optionsGraphAmountByCategory: any;

  dataGraphAmountByProduct: any;
  optionsGraphAmountByProduct: any;

  ngOnInit(): void {
    this.generateGraphAmountByType();
    this.generateGraphValuesByType();
    this.generateGraphProductsValues();
    this.generateGraphAmountByStates();
    this.generateGraphAmountByCategory();
    this.generateGraphAmountByProduct();
  }

  generateGraphAmountByType() {
    this.productService.getGraphAmountByType().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map((item: { typeName: string }) => item.typeName);
      const data = res.map((item: { amount: number }) => item.amount);

      this.dataGraphAmountByType = {
        labels: labels,
        datasets: [
          {
            label: 'Quantidade em estoque',
            data: data,
            backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            hoverBackgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphAmountByType = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
    });
  }

  generateGraphValuesByType() {
    this.productService.getGraphValuesByType().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map((item: { typeName: string }) => item.typeName);
      const data = res.map((item: { value: number }) => item.value);

      this.dataGraphValuesByType = {
        labels: labels,
        datasets: [
          {
            label: 'Valor (R$) em estoque',
            data: data,
            backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphValuesByType = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
    });
  }

  generateGraphProductsValues() {
    this.productService.getGraphProductsValues().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map(
        (item: { productName: string }) => item.productName
      );
      const data = res.map((item: { value: number }) => item.value);

      this.dataGraphProductsValues = {
        labels: labels,
        datasets: [
          {
            label: 'Valor (R$) em estoque',
            backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            data: data,
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphProductsValues = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
    });
  }

  generateGraphAmountByStates() {
    this.supplierstService.getGraphAmountByStates().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map((item: { state: string }) => item.state);
      const data = res.map((item: { amount: number }) => item.amount);

      this.dataGraphAmountByStates = {
        labels: labels,
        datasets: [
          {
            label: 'Fornecedores por Estado',
            data: data,
            backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphAmountByStates = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        cutout: '80%',
      };
    });
  }

  generateGraphAmountByCategory() {
    this.supplierstService.getGraphAmountByCategory().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map((item: { category: string }) => item.category);
      const data = res.map((item: { amount: number }) => item.amount);

      this.dataGraphAmountByCategory = {
        labels: labels,
        datasets: [
          {
            label: 'Quantidade por Categoria de Fornecedor',
            data: data,
            backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphAmountByCategory = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
    });
  }

  generateGraphAmountByProduct() {
    this.supplierstService.getGraphAmountByProducts().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map(
        (item: { nameSupplier: string }) => item.nameSupplier
      );
      const data = res.map(
        (item: { amountProducts: number }) => item.amountProducts
      );
      this.dataGraphAmountByProduct = {
        labels: labels,
        datasets: [
          {
            label: 'Quantidade de Produto por Fornecedor',
            data: data,
            backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphAmountByProduct = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit{

  searchKey:string = ''
  constructor(private api:ApiService){}
  allProducts:any=[];
  ngOnInit(): void {
    this.api.getAllProducts().subscribe((result) => {
      console.log(result); //arrayy(20)
      this.allProducts = result;
      
    })
    // this.searchKey = this.api.searchTerm
this.api.searchTerm.subscribe((result:any) => {
    this.searchKey = result
    console.log(this.searchKey);
    
})
  }
  
}

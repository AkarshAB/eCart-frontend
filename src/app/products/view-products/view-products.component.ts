import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit{

  productId: string = ''; //to hold a particular product id
  product:any = {}; //to hold product information 

  constructor(private viewActivatedRoute:ActivatedRoute, private api:ApiService){}
  ngOnInit(): void {
    this.viewActivatedRoute.params.subscribe((data:any) => {
      console.log(data); //{id : 2}
      console.log(data.id); //2

      this.productId = data.id
      
      //call viewProduct api
      this.api.viewProduct(this.productId).subscribe((result:any) => {
        console.log(result); //product details
        this.product = result
      },
      (result:any) => {
        alert (result.error)
      })
      
    })
  }

  addToWishlist(){
    const {id,title,price,image} = this.product

    this.api.addToWishlist(id,title,price,image).subscribe((result:any) => {
      alert (result)
    },
    (result:any) => {
      alert(result.error)
    })
  }



  addToCart(product:any){
    
    //add quantity to product
    Object.assign(product,{quantity:1})

    console.log(product);

    //api call to add quantity to cart
    this.api.addToCart(product).subscribe((result:any) => {
      alert (result)
    },
    (result:any) => {
      alert (result.error)
    })
  }
}

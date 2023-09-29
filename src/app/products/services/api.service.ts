import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  cartItemCount = new BehaviorSubject(0)
 //to hold the cart item count
  searchTerm = new BehaviorSubject(''); //to hold search value
  //using BehaviorSubject to pass stream of data from one component to another component

  constructor(private http:HttpClient) {
    this.cartCount()
  }

  //api function to get all products from the database
  BASE_URL = 'https://ecart-8v18.onrender.com'
  getAllProducts(){
    return this.http.get(`${this.BASE_URL}/products/all-products`)
  }

  //api function to view a particular product from database 
viewProduct(id:any){
  return this.http.get(`${this.BASE_URL}/products/view-product/${id}`)
}

//api function to add to wishlist
addToWishlist(id:any,title:any,price:any,image:any){

  const body = {
    id,
    title,
    price,
    image
  }
  return this.http.post(`${this.BASE_URL}/wishlists/add-to-wishlist`,body)
}

//view wihlist products
viewWishlist(){
  return this.http.get(`${this.BASE_URL}/wishlists/view-all-wishlists`)
}

//add to cart
addToCart(product:any){ //product is an object with properties
  //get the product details - id, title, price, image, quantity
  const body = {
    id : product.id,
    title : product.title,
    price: product.price,
    image: product.image,
    quantity: product.quantity
  }
  return this.http.post(`${this.BASE_URL}/carts/add-to-cart`,body)
}

//delete wishlist products
deleteWishlistProducts(id:any){
  return this.http.delete(`${this.BASE_URL}/wishlists/delete-wishlist-product/${id}`)
}
//get cart products
getCart(){
  return this.http.get(`${this.BASE_URL}/carts/get-cart`)
}

//to get cart products' count
cartCount(){
  this.getCart().subscribe((result:any) => {
    this.cartItemCount.next(result.length)
  })
}

//delete cart product
deleteProduct(id:any){
return this.http.delete(`${this.BASE_URL}/cart/delete-product/${id}`)
}

//increment cart product
incrementProduct(id:any){
  return this.http.get(`${this.BASE_URL}/cart/increment-product/${id}`)
}

//decrement cart product
decrementProduct(id:any){
  return this.http.get(`${this.BASE_URL}/cart/decrement-product/${id}`)
}
}



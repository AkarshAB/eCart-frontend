import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{


  allWishlist:any = [];
  constructor(private api:ApiService){}
  ngOnInit(): void {
    this.api.viewWishlist().subscribe((result:any) => {
      console.log(result); //wishlist product details
      this.allWishlist = result
    },
    (result:any) => {
      console.log(result.error);
      
    })
  }
  //delete wishlist product from wishlists
  deleteWishlistItem(id:any){
    this.api.deleteWishlistProducts(id).subscribe((result:any) => {
      this.allWishlist = result //assign remaining wishlist items to allWishlist
      alert('Product removed successfully')
    })
  }
}

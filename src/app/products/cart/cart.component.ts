import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  //paypal variable
  public payPalConfig?: IPayPalConfig;

  cartItems: any = []; //to hold cart of products
  cartTotalPrice: any;

  //used to hold delivry details
  name: string = ''
  houseNumber: string = ''
  streetName: string = ''
  state: string = ''
  pinNumber: string = ''
  mobileNumber: string = ''

  //paypal boolean
  showSuccess:boolean = false

  showPaypal:boolean = false;

  //used to hide address form
  proceedToPaymentStatus: boolean = false;

  //used to show offers
  offerClicked: boolean = false;

  //for hide discunt coupon
  discountCoupon: boolean = false;


  constructor(private api: ApiService, private cartfb: FormBuilder) { }
  ngOnInit(): void {
    this.api.getCart().subscribe((result: any) => {
      console.log(result);
      this.cartItems = result
      this.getCartTotal()

      //paypal function
      this.initConfig();

    },
      (result: any) => {
        console.log(result.error);
      })
  }
  deleteCartProduct(id: any) {
    this.api.deleteProduct(id).subscribe((result: any) => {
      //result? - remaining products
      this.cartItems = result;
      this.api.cartCount() //updates cart count on delete
      this.getCartTotal()
    },
      (result: any) => {
        alert(result.error)
      })
  }

  //get grand total
  getCartTotal() {
    let total = 0
    this.cartItems.forEach((item: any) => {
      total += item.grandTotal
      this.cartTotalPrice = Math.ceil(total)
    })
  }

  //increment product
  incrementCartProduct(id: any) {
    this.api.incrementProduct(id).subscribe((result: any) => {
      console.log(result);
      this.cartItems = result;
      this.getCartTotal()
    },
      (result: any) => {
        alert(result.error)
      })
  }

  //decrement product
  decrementCartProduct(id: any) {
    this.api.decrementProduct(id).subscribe((result: any) => {
      this.cartItems = result;
      this.getCartTotal()
    })
  }

  //address form
  addressForm = this.cartfb.group({
    name: [''],
    houseNumber: [''],
    streetName: [''],
    state: [''],
    pinNumber: [''],
    mobileNumber: ['']
  })

  submitForm() {
    if (this.addressForm.valid) {

      this.proceedToPaymentStatus = true

      this.name = this.addressForm.value.name || ''
      this.houseNumber = this.addressForm.value.houseNumber || ''
      this.streetName = this.addressForm.value.streetName || ''
      this.state = this.addressForm.value.state || ''
      this.pinNumber = this.addressForm.value.pinNumber || ''
      this.mobileNumber = this.addressForm.value.mobileNumber || ''
    }
    else {
      alert('please enter details')
    }
  }

  offers() {
    this.offerClicked = true;
  }

  discountCalc(value: any) {
    this.cartTotalPrice = this.cartTotalPrice * (100 - value) / 100
    this.discountCoupon = true

  }

  //paypal function
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details:any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  paymentClicked(){
    this.showPaypal = true;
  }
}

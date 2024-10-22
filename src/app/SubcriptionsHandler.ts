import {Subscription} from "rxjs";

// Remove and subscription
// This function is used to stop repetitive code if and unsubscribe method
export function removeAngularSubscription(subscription:Subscription | undefined) {
  if(subscription){
    subscription.unsubscribe()
  }
}

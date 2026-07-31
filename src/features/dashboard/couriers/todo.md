# Shipping Module Progress

# Database Table
 - shipping_couriers
   - id
   - name 
   - description
   - logo
   - code
   - phone
   - email
   - api_endpoint
   - api_key
   - account_number
   - tracking_url
   - base_cost
   - supports_cod
   - is_active

 - cities
  - id
  - name
  - country_id
  - city_code
  - is_active

 - city_shipping_courier
  - id
  - city_id
  - shipping_courier_id
  - shipping_fee
  - delivery_days
  - cod_fee
  - base_weight
  - extra_per_kg
  - is_active

## Relashshps
 - shipping couriers (many) to City
 - city  (many) to shipping couriers 
    shippingCouriers and City = Many to Many

# Any data that depends on the "correlation" of the two parties with each other, we put it in the Pivot Table.


## Controll
 - shipping_couriers => index, trashed, show, store, update, 
   toggleStatus, restore, destroy, forceDestroy
 - cities => index, store, update, getShippingOptions, toggleStatus, destroy
 - city_shipping_courier => show, store, setShippingRate, destroy
 


## [Done] ✅
- [x] Create Cities and Couriers migrations.
- [x] Setup Many-to-Many relationship with Pivot data.
- [x] Fix Array to String conversion error in City controller.
- [x] API to show couriers by city ID.

## [In Progress] ⏳
- [ ] Shipping fee update logic (Syncing cities).
- [ ] Form request validation for courier creation.

## [Planned] 🚀
- [ ] Integration with Checkout page.
- [ ] Courier Logo upload feature.
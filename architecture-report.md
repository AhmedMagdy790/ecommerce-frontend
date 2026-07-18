# تقرير هيكلية المشروع

## شجرة المجلدات (src)
```
src
 |App.tsx
 |assets
 | |hero.png
 | |react.svg
 | |vite.svg
 |components
 | |Admin
 | |cart
 | |Cart
 | | |CartItem.tsx
 | | |CartList.tsx
 | | |CartSummary.tsx
 | | |CartTotals.tsx
 | | |CheckoutButton.tsx
 | | |CouponForm.tsx
 | | |EmptyCart.tsx
 | | |ShippingCalculator.tsx
 | |Checkout
 | | |BillingAddress.tsx
 | | |CheckoutContact.tsx
 | | |CheckoutProgress.tsx
 | | |CheckoutSummary.tsx
 | | |OrderNotes.tsx
 | | |PaymentMethod.tsx
 | | |PlaceOrderButton.tsx
 | | |ShippingAddress.tsx
 | | |ShippingMethod.tsx
 | |Common
 | | |Header.tsx
 | |Layout
 | | |CartDrawer.tsx
 | | |Footer.tsx
 | | |Navbar
 | | |Topbar.tsx
 | | |UserLayout.tsx
 | |Products
 | | |GenderCollectionSection.tsx
 | |Search
 | | |index.ts
 | | |SearchBrandCard.tsx
 | | |SearchButton.tsx
 | | |SearchCategoryCard.tsx
 | | |SearchEmpty.tsx
 | | |SearchInput.tsx
 | | |SearchLoading.tsx
 | | |SearchModal.tsx
 | | |SearchProductCard.tsx
 | | |SearchResults.tsx
 | |ui
 | | |Button.tsx
 | | |Skeleton.tsx
 |config
 | |app.ts
 | |site.ts
 |constants
 | |navigation.ts
 |context
 | |AuthProvider.tsx
 | |CartProvider.tsx
 | |DirectionProvider.tsx
 | |LanguageProvider_old.tsx
 | |SettingsProvider.tsx
 | |ThemeContext.tsx
 |data
 | |hero.ts
 | |search.ts
 | |topbar.ts
 |hooks
 | |useAuth.ts
 | |useLanguage.ts
 | |useSettings.ts
 | |useTheme.ts
 |i18n
 | |index.ts
 |index.css
 |locales
 | |ar
 | | |auth.json
 | | |cart.json
 | | |checkout.json
 | | |common.json
 | | |home.json
 | | |order.json
 | | |product.json
 | | |profile.json
 | | |shop.json
 | |en
 | | |admin.json
 | | |auth.json
 | | |cart.json
 | | |checkout.json
 | | |common.json
 | | |home.json
 | | |order.json
 | | |product.json
 | | |profile.json
 | | |shop.json
 | |index.ts
 |main.tsx
 |mocks
 | |user.ts
 |pages
 | |Auth
 | | |ForgotPasswordPage.tsx
 | | |LoginPage.tsx
 | | |RegisterPage.tsx
 | | |ResetPasswordPage.tsx
 | |Cart
 | | |CartPage.tsx
 | |Category
 | | |CategoryPage.tsx
 | |Checkout
 | | |CheckoutPage.tsx
 | |Errors
 | | |NotFoundPage.tsx
 | |Home
 | | |components
 | | |data
 | | |HomePage.tsx
 | | |services
 | |Order
 | | |components
 | | |MyOrdersPage.tsx
 | | |OrderDetailsPage.tsx
 | | |OrderSuccessPage.tsx
 | |Product
 | | |components
 | | |ProductPage.tsx
 | |Profile
 | | |components
 | | |ProfilePage.tsx
 | |Search
 | | |components
 | | |SearchPage.tsx
 | |Shop
 | | |components
 | | |ShopPage.tsx
 | |Wishlist
 | | |components
 | | |WishlistPage.tsx
 |providers
 | |AppProviders.tsx
 | |QueryProvider.tsx
 |routes
 | |index.tsx
 |services
 | |checkoutService.ts
 |styles
 | |theme.css
 | |variables.css
 |types
 | |sections.ts
```

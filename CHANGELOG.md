# 🚀 RELEASE NOTES

## Release Overview [1.7.0](https://github.com/bora001/pro-store/compare/v1.6.0...v1.7.0) (2025-05-19)
This release includes several enhancements, such as new features, code refactoring.

### 🚀 New Features
* (autocomplete): support keyboard navigation ([e5c74fd](https://github.com/bora001/pro-store/commit/e5c74fd8b08a9cd386b318e524bb8cf5d37967c1))

### 🔧 Code Refactoring
* (header) : enhance code readability ([e309184](https://github.com/bora001/pro-store/commit/e3091846ea62573de0d2c83660e3ea4f63f2742c))

## Release Overview [1.6.0](https://github.com/bora001/pro-store/compare/v1.5.0...v1.6.0) (2025-05-19)
This release includes several enhancements, such as new features, bug fixes, code refactoring.

### 🚀 New Features
* (order-detail): add responsive layout ([a2b5868](https://github.com/bora001/pro-store/commit/a2b5868c9ff906b839ed79f436d1d42abfe5c2d8))

* (prisma): refactor Cart model to use relation with CartItem ([e5cac73](https://github.com/bora001/pro-store/commit/e5cac736a82977c7ac7e35469cffd0d7d373d3c0))

* apply handleAsync to server actions ([0958b13](https://github.com/bora001/pro-store/commit/0958b132a6e61fd1b30a36af843af55b0b2ab73d))

* apply validProduct filter to product related query ([edfdf15](https://github.com/bora001/pro-store/commit/edfdf157c9dee697075cb02bc70fc412906b8e18))

### 🐛 Bug Fixes
* (cart): update item quantity logic in handleModifyItemQtyToCart ([ab33a6c](https://github.com/bora001/pro-store/commit/ab33a6c26c862501d7181a9c6b4f20514f32168d))

* (search): relocate validProduct to appropriate position ([9ca0a63](https://github.com/bora001/pro-store/commit/9ca0a63933624d1e3e9f428d0babadf5b77eb12f))

### 🔧 Code Refactoring
* (cart) : cart.actions, userId ([a69992a](https://github.com/bora001/pro-store/commit/a69992ad8263745d41862000f2222b496244fac9))

* (lib) : enhance code readability ([6ce8081](https://github.com/bora001/pro-store/commit/6ce80817963d0bcff2c558188836df12fb76c8e8))

* apply naming convention to types ([17d591f](https://github.com/bora001/pro-store/commit/17d591f98ec32b11d5379cffee2c66f7e67101ba))

* clean up duplicate type declarations ([58fb258](https://github.com/bora001/pro-store/commit/58fb2583c69e533b7a1d7ed5576ba8b40cb39bf2))

* PAYMENT_METHODS into a typed constant ([ed9b13d](https://github.com/bora001/pro-store/commit/ed9b13d61445029acc3727d81fc0e67acc39d3e2))

* rename fetch functions to handle in admin.deal ([664ac2b](https://github.com/bora001/pro-store/commit/664ac2b239a1a6de17836fee9606b029c360aadb))

* rename fetch functions to handle in admin.order ([354cb96](https://github.com/bora001/pro-store/commit/354cb96a042e6eb3a198124d7a177003c075cf92))

* restructure components/customs and apply file naming convention ([5e41bc2](https://github.com/bora001/pro-store/commit/5e41bc2c6ffa4b8c5e56e7dc2ae62a66611c9cac))

* revise add-to-cart logic and improve structure ([3d29358](https://github.com/bora001/pro-store/commit/3d29358f0c7e5a55b87e15284e90ed1747844d50))

* separate admin actions ([521dd19](https://github.com/bora001/pro-store/commit/521dd19f33bcb6bb7ff12a8e236b940d214a1ff2))

* separate admin controls and refactor order-detail component ([3e00d17](https://github.com/bora001/pro-store/commit/3e00d17be42f26d227e0faeef8bcb5846245bb19))

## Release Overview [1.5.0](https://github.com/bora001/pro-store/compare/v1.4.2...v1.5.0) (2025-05-05)
This release includes several enhancements, such as new features, code refactoring.

### 🚀 New Features
* (chat): recommend items based on prompt and tags ([319878a](https://github.com/bora001/pro-store/commit/319878a7750f30bf71546e44745038f6ec04ed27))

* add OpenAI API integration and admin setting for chat ([422afe3](https://github.com/bora001/pro-store/commit/422afe3e3a3d45a3323b4cb5ee03d2ac9c7e78a1))

* add tag list field to product schema and form ([53b7872](https://github.com/bora001/pro-store/commit/53b787244f5ed46e596bb54230154ecbb705eb88))

* chat-ui ([64fcfab](https://github.com/bora001/pro-store/commit/64fcfabca7e252c5148902d91b61f5b8bfd3a5d0))

### 🔧 Code Refactoring
* (header) : edit drawer, nav-bar ([2748875](https://github.com/bora001/pro-store/commit/27488759d60a21bc97884e19d3c7517efcdd8ff9))

* (typesense): clean up and unify setup logic ([e79027b](https://github.com/bora001/pro-store/commit/e79027b961294c030eec2ef7064ca660b4986c82))

* taglist ([31f61ed](https://github.com/bora001/pro-store/commit/31f61ed2d5ba718db33e81f13feea2278e21c50b))

## Release Overview [1.4.2](https://github.com/bora001/pro-store/compare/v1.4.1...v1.4.2) (2025-04-29)
This release includes several enhancements, such as bug fixes, performance improvements, code refactoring.

### 🐛 Bug Fixes
* prevent input scrolling, edit search input autocomplete ([7d5938f](https://github.com/bora001/pro-store/commit/7d5938f444f6520ffba92b815bfc16d6aaf82972))

### ⚡ Performance Improvements
* (admin): add Redis caching (products, deals) ([4307526](https://github.com/bora001/pro-store/commit/43075260f4fcfee34a315cebdc7056afbab9cf17))

* (home): add Redis caching (Banner, Dealcount) ([753f2eb](https://github.com/bora001/pro-store/commit/753f2eb1b59ad00541649812c3f0df1120e1016e))

### 🔧 Code Refactoring
* - dealCountDown ([2dabe9d](https://github.com/bora001/pro-store/commit/2dabe9d161fa6cfa99f48d8a6bbe1858cfa33193))

## Release Overview [1.4.1](https://github.com/bora001/pro-store/compare/v1.4.0...v1.4.1) (2025-04-28)
This release includes several enhancements, such as performance improvements.

### ⚡ Performance Improvements
* Optimize Prisma query by selecting only required fields in ProductCarousel ([8f08043](https://github.com/bora001/pro-store/commit/8f080439dcbb0f7d4d5cf3c47a6ef8442986968f))

## Release Overview [1.4.0](https://github.com/bora001/pro-store/compare/v1.3.2...v1.4.0) (2025-04-26)
This release includes several enhancements, such as new features.

### 🚀 New Features
* Add pnpm audit to pre-push hook for security checks ([3e05774](https://github.com/bora001/pro-store/commit/3e057743330a48718e12c977ba1797c9a01729d8))

## Release Overview [1.3.2](https://github.com/bora001/pro-store/compare/v1.3.1...v1.3.2) (2025-04-26)
This release includes several enhancements, such as styles and formatting.

### 💄 Styles and Formatting
* complete dark mode styling in previously unstyled areas ([6db464f](https://github.com/bora001/pro-store/commit/6db464f677cdcd94ebac28b65308b8ed73fd262b))

## Release Overview [1.3.1](https://github.com/bora001/pro-store/compare/v1.3.0...v1.3.1) (2025-04-26)
This release includes several enhancements, such as bug fixes.

### 🐛 Bug Fixes
* include productId when editing deal product ([b858f24](https://github.com/bora001/pro-store/commit/b858f247b41ce37b1a78a654ebbd9bc2a13eb3bb))

## Release Overview [1.3.0](https://github.com/bora001/pro-store/compare/v1.2.1...v1.3.0) (2025-04-25)
This release includes several enhancements, such as new features.

### 🚀 New Features
* (user): add userDelete function and implement email service ([5fdef98](https://github.com/bora001/pro-store/commit/5fdef983c81feb914fa99ae1c56767b748e7e636))

## Release Overview [1.2.1](https://github.com/bora001/pro-store/compare/v1.2.0...v1.2.1) (2025-04-25)
This release includes several enhancements, such as bug fixes.

### 🐛 Bug Fixes
* prevent email change before verification after verification email is sent ([00a2e92](https://github.com/bora001/pro-store/commit/00a2e920baef9781ae5c9b3547ac3d6ed7821cfa))

## Release Overview [1.2.0](https://github.com/bora001/pro-store/compare/v1.1.0...v1.2.0) (2025-04-25)
This release includes several enhancements, such as new features, bug fixes.

### 🚀 New Features
* email verification step added to sign-up process ([2a29737](https://github.com/bora001/pro-store/commit/2a29737b0cbf04f3582ccb8e6ad8e9892b7d7dc0))

* update responsive layout for mobile and tablet ([42317a3](https://github.com/bora001/pro-store/commit/42317a32f5d396eef8ab3a2b3ca754be0769a12c))

### 🐛 Bug Fixes
* add secret ([6a46f79](https://github.com/bora001/pro-store/commit/6a46f792fe6f4cb9a0cda316d18139bbc65a3265))

## Release Overview [1.1.0](https://github.com/bora001/pro-store/compare/v1.0.0...v1.1.0) (2025-04-23)
This release includes several enhancements, such as new features.

### 🚀 New Features
* set up typesense and implement autocomplete feature ([802f1c4](https://github.com/bora001/pro-store/commit/802f1c4568a80467a8e42241c1cbd05a362cd8d2))

* update Typesense product index after product update ([6e44eee](https://github.com/bora001/pro-store/commit/6e44eeea62af59fd2066fb6fda4e42a6af99a48e))

## Release Overview [1.0.0](https://github.com/bora001/pro-store/compare/...v1.0.0) (2025-04-23)
This release includes several enhancements, such as new features, bug fixes, code refactoring.

### 🚀 New Features
* add admin products page ([09ba64b](https://github.com/bora001/pro-store/commit/09ba64b343a97e7cefe19d6357f137b28d403e84))

* add admin-dashboard ([c5d8fc3](https://github.com/bora001/pro-store/commit/c5d8fc35ebaef56fd47bab513c9531b7febd204c))

* add admin-orders ([d5ea2fd](https://github.com/bora001/pro-store/commit/d5ea2fd76eea30fea1ca133a8e2086491cd1bc83))

* add admin-users(edit,delete) ([c2a3560](https://github.com/bora001/pro-store/commit/c2a3560731fc864f30b0d8fe63ffd6b17cbe0712))

* add all-product (search, filter) ([2b22b7c](https://github.com/bora001/pro-store/commit/2b22b7ceec0cd287fb2c2af39290ca99e5fb7e14))

* add benefits section and clean up code ([600e3c3](https://github.com/bora001/pro-store/commit/600e3c345582cffe3de164cb1b59b5ccf379ae5e))

* add deal actions and DB schema ([b44b1ae](https://github.com/bora001/pro-store/commit/b44b1ae2b622b0b9dc341ee89e25b4606f4d43ee))

* add deal-admin page ([0063db9](https://github.com/bora001/pro-store/commit/0063db97cefc4307556bae9a1377470382fc092d))

* add deal-client page ([ba78199](https://github.com/bora001/pro-store/commit/ba7819925a3bcd11f7a2b17460493e6ff3a94915))

* add product-page(delete,edit,create) ([df991f1](https://github.com/bora001/pro-store/commit/df991f165b769baaf7362cb10d9514d91af7d34d))

* add purchase email receipt ([af0ce1d](https://github.com/bora001/pro-store/commit/af0ce1d99ddfdf37e394aa9a319206d43f3a6933))

* add review (create, edit, delete) ([8d7f7b5](https://github.com/bora001/pro-store/commit/8d7f7b5b0221d1218e8a7c264cc9d3858c4a184a))

* add s3-image delete feature (db,bucket) ([a4132ae](https://github.com/bora001/pro-store/commit/a4132ae6ec91cb9bd8d067e4806a3af3265fd0d4))

* add search in deal-admin-page ([f1db2f1](https://github.com/bora001/pro-store/commit/f1db2f131630a7e4ef42836907d6a2eb2db2dedf))

* add stripe payment ([d4fb220](https://github.com/bora001/pro-store/commit/d4fb220f43052d1424a493d2832c7fc9462fdb65))

* automate release note generation ([2d43598](https://github.com/bora001/pro-store/commit/2d4359867e2998bfc639abe92bd9f57d0ae235e6))

* home - add drawer & carousel ([491dca4](https://github.com/bora001/pro-store/commit/491dca4584e059ae94da4ef828f4f16eb16d8521))

* migrate uploadthing to S3 ([4b2996b](https://github.com/bora001/pro-store/commit/4b2996b95232806a82ec4c6618905e59bd176358))

### 🐛 Bug Fixes
* (cart): resolve concurrency issue by locking stock during checkout (fixes [#8](https://github.com/bora001/pro-store/issues/8)) ([a7d26a3](https://github.com/bora001/pro-store/commit/a7d26a390dbbe75a4d4281a4f1451db5ed0b1c64))

* adjust UI for closed deals ([b97fa24](https://github.com/bora001/pro-store/commit/b97fa24dea3b6c7f1a040fdced06a923204a676a))

* allow only one active deal at a time ([9e0a285](https://github.com/bora001/pro-store/commit/9e0a2852b981ebac67eedb81a918c58a0c9957b8))

* display product-timer-deal & payment select error ([0cc8313](https://github.com/bora001/pro-store/commit/0cc8313749db5c2938a313247e50f9813c31c788))

### 🔧 Code Refactoring
* edit style & button, receipt ([9110326](https://github.com/bora001/pro-store/commit/9110326143c6c8eac194f3bec46ab48c09761096))

* improve empty state handling ([6e69d5a](https://github.com/bora001/pro-store/commit/6e69d5a4410d7097bcfb29560462c58126fff750))

* item-qty-changer ([7a9748f](https://github.com/bora001/pro-store/commit/7a9748fdb1b76674313e93c822f94335058f20b0))

* product page ([aadaaeb](https://github.com/bora001/pro-store/commit/aadaaebdbbe92b543925d5dd6ba8a179a11ccae1))

* refactor price calculation and add tests (Fixes [#7](https://github.com/bora001/pro-store/issues/7)) ([2b73587](https://github.com/bora001/pro-store/commit/2b73587864c2d561f59b77167d28c3ec3e17e6ee))

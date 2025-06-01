# Pro-store
<img src="https://img.shields.io/badge/Next.js-061629?style=flat-square&logo=Next.js&logoColor=white"/> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/> <img src="https://img.shields.io/badge/Typescript-127EFA?style=flat-square&logo=Typescript&logoColor=white"/> <img src="https://img.shields.io/badge/Tailwindcss-38bdf8?style=flat-square&logo=Tailwindcss&logoColor=white"/>  <img src="https://img.shields.io/badge/Shadcn/ui-061629?style=flat-square&logo=Shadcnui&logoColor=white"/> <img src="https://img.shields.io/badge/ReactHookForm-ec5990?style=flat-square&logo=ReactHookForm&logoColor=white"/>  <img src="https://img.shields.io/badge/Zod-1A73E8?style=flat-square&logo=Zod&logoColor=white"/> <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=Vercel&logoColor=white"/> <img src="https://img.shields.io/badge/Jest-c21325?style=flat-square&logo=Jest&logoColor=white"/> <img src="https://img.shields.io/badge/Redis-FF4438?style=flat-square&logo=Redis&logoColor=white"/> <img src="https://img.shields.io/badge/Prisma-16a394?style=flat-square&logo=Prisma&logoColor=white"/> <img src="https://img.shields.io/badge/PostgreSQL-699eca?style=flat-square&logo=PostgreSQL&logoColor=white"/> <img src="https://img.shields.io/badge/Render-8A05FF?style=flat-square&logo=Render&logoColor=white"/> <img src="https://img.shields.io/badge/GithubActions-181717?style=flat-square&logo=GithubActions&logoColor=white"/> <img src="https://img.shields.io/badge/Stripe-a960ee?style=flat-square&logo=Stripe&logoColor=white"/> <img src="https://img.shields.io/badge/Paypal-003087?style=flat-square&logo=Paypal&logoColor=white"/> 
<img src="https://img.shields.io/badge/OpenAI-10A37F?style=flat-square&logo=OpenAI&logoColor=white"/> 

![image](https://github.com/user-attachments/assets/c8bd1fb9-b1bd-4c6a-83a5-9b5ca644647f)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Database](#database)
- [Basic Features](#basic-features)
- [Extra Implement](#extra-implement)
- [License](#license)
<br/>

## Tech stack
<p align="center">
  <img src="https://github.com/user-attachments/assets/efdac9a9-fc03-4ada-8569-6a5acec36436" width="700" />
</p>

## Database

<img width="413" alt="image" src="https://github.com/user-attachments/assets/3d36d918-94c3-4dfb-b13d-f6c62f371a82" />

- To improve system performance and maintain clear separation of concerns, I divided the data into three specialized databases:
  - **Product Database**: Stores core product information such as title, price, stock, and category.
  - **Search Database**: Optimized for fast, full-text search and filtering.
  - **Recommendation Database**: Manages algorithm-based recommended products by categorizing them based on the product’s tag field
    

## Basic Features
  - Next Auth authentication
  - Admin area with stats & chart using Recharts
  - Order, product and user management
  - User area with profile and orders
  - Stripe & PayPal integration
  - Cash on delivery option
  - Interactive checkout process
  - Featured products with banners
  - Ratings & reviews system
  - Search form (customer & admin)
  - Sorting, filtering & pagination
  - Dark/Light mode

## Extra Implement
- This project is based on the [Udemy course: Next.js Ecommerce 2025 - Shopping Platform From Scratch](https://www.udemy.com/course/nextjs-ecommerce-course/?couponCode=KEEPLEARNING) (FullStack : e-commerce + admin) by Traversy Media ([GitHub Repo](https://github.com/bradtraversy/prostore)). After completing the course, I enhanced and customized various features to better align the project with real-world use cases and modern development practices. These improvements include:

  - Replaced Uploadthing with AWS S3 
  - Enhanced Product Review system 
  - Built a Deal Database system with CRUD
  - Developing Unit / E2E tests using Jest and Playwright
  - Achieved 100 scores in all Lighthouse categories on the Main Page, Cart Page, and Product Detail Page
  - Implemented search autocomplete functionality to improve UX
  - Automated versioning and release note generation system
  - Implemented Signup Email Flow with Google SMTP
  - Improving Response Time and User Experience through Redis-based Data Caching
  - Implemented a product recommendation chatbot using OpenAI and Typesense.

This project continues to follow the MIT License as originally provided.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

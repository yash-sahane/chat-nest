
# 🍽️ Epic Eats - Food Ordering MERN Application

Welcome to Epic Eats! This food ordering application is designed to provide a seamless experience from browsing the menu to placing an order. Developed using the powerful MERN stack (MongoDB, Express.js, React.js, Node.js), Epic Eats offers a smooth and efficient platform for both users and administrators.

Whether you're a customer looking to order your favorite meal or an admin managing the menu and orders, Epic Eats has you covered!
## 🔗 Links

- GitHub: [Epic Eats](https://github.com/yash-sahane/epic-eats)

- User Interface: [Epic Eats User](https://epic-eats-client.vercel.app/)

- Admin Interface: [Epic Eats Admin](https://epic-eats-admin.vercel.app/) 
    - (Email: yashsahane23@gmail.com | Password: 12345678)

- Components Flow: [Flow](https://miro.com/app/board/uXjVKimg8ZA=/?moveToWidget=3458764599264814558&cot=14) 
## 📸 Screenshots

![Home Page](https://github.com/yash-sahane/epic-eats/raw/main/assets/1.png)

![Home Page](https://github.com/yash-sahane/epic-eats/raw/main/assets/2.png)

![Home Page](https://github.com/yash-sahane/epic-eats/raw/main/assets/3.png)

![Home Page](https://github.com/yash-sahane/epic-eats/raw/main/assets/4.png)

![Home Page](https://github.com/yash-sahane/epic-eats/raw/main/assets/5.png)

![Home Page](https://github.com/yash-sahane/epic-eats/raw/main/assets/6.png)

![Home Page](https://github.com/yash-sahane/epic-eats/raw/main/assets/7.png)

![Home Page](https://github.com/yash-sahane/epic-eats/raw/main/assets/8.png)

![Home Page](https://github.com/yash-sahane/epic-eats/raw/main/assets/9.png)

![Home Page](https://github.com/yash-sahane/epic-eats/raw/main/assets/10.png)



## 🌟 Features

- **User Authentication**: Secure user registration and login.
- **Browse Menu**: Explore a variety of delicious food items.
- **Cart Management**: Add or remove items from your cart effortlessly.
- **Order Placement**: Seamlessly place orders and track their status.
- **Admin Console**: Manage menu items, users, and order statuses efficiently.
- **Stripe Integration**: Secure payment processing with Stripe.
- **Image Upload**: Upload food item images using Multer.


## 🛠️ Tech Stack

- **Frontend**: React.js (Context API, React Router), Tailwind CSS
- **Backend**: Node.js, Express.js, Multer, Stripe
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)


## 🛠️ Installation

#### Prerequisites
- Node.js
- MongoDB

#### Steps:
- Clone the repository:

```bash
  https://github.com/yash-sahane/epic-eats.git
```
- Install dependencies for client, server and admin:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Install admin dependencies
cd ../admin
npm install
```

- Create a `config.env` file in the `server/database` directory and add the following:

```bash
PORT = <port_for_development> 

FRONTEND_URI = <frontend_uri_for_development>

MONGO_URI = <your_mongo_db_connection_string>

SECRET_KEY = <your_jwt_secret>

STRIPE_SECRET_KEY = <your_stripe_secret_key>

ADMIN_SECRET_KEY = <secret_key_for_admin_registration>
```

- Run the application:

```bash
# Run server
cd server
npm run dev

# Run client
cd ../client
npm run dev

# Run admin
cd ../admin
npm run dev
```


    
## 📑 API Reference

### User Routes

#### Login

```http
  POST /api/user/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. User's email address |
| `password` | `string` | **Required**. User's password |

#### Register

```http
  POST /api/user/register
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. User's full name |
| `email`      | `string` | **Required**. User's email address |
| `password`      | `string` | **Required**. User's password |

#### Admin Register

```http
  POST /api/user/admin_register
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Admin's full name |
| `email`      | `string` | **Required**. Admin's email address |
| `password`      | `string` | **Required**. Admin's password |
| `adminSecretKey`      | `string` | **Required**. Admin secret key for registration |


### Order Routes

#### Place Order

```http
  POST /api/order/place
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `orderData` | `object` | **Required**. Contains order details like items, amount, and address |

#### Verify Order

```http
  POST /api/order/verify
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderId`      | `string` | **Required**. Order ID |
| `success`      | `string` | **Required**. Payment success status (true or false) 

#### Fetch Orders

```http
  POST /api/order/orders
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `none`      | `none` | **Required**. Authentication required |

#### Fetch Orders (Admin)

```http
  GET /api/order/list
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `none`      | `none` | **Required**. Admin authentication required |

#### Update Order Status

```http
  POST /api/order/status
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `orderId`      | `string` | **Required**. ID of the order to update |
| `status`      | `string` | **Required**. New status of the order |


### Food Routes
#### Add Food

```http
  POST /api/food/add
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Food name |
| `description`      | `string` | **Required**. Food description |
| `price`      | `number` | **Required**. Food price |
| `category`      | `string` | **Required**. Food category |
| `image`      | `file` | **Required**. Food image (uploaded file) |

#### Remove Food

```http
  POST /api/food/remove
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID of the food item to remove |

#### List Food Items

```http
  GET /api/food/list
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `none`      | `none` | **Required**. Authentication required |

### Cart Routes
#### Add to Cart

```http
  POST /api/cart/add
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `itemId`      | `string` | **Required**. ID of the item to add |

#### Remove from Cart

```http
  POST /api/cart/remove
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `itemId`      | `string` | **Required**. ID of the item to add |

#### #### Get Cart Data

```http
  GET /api/cart/get
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `none`      | `none` | **Required**. Authentication required |

## 📁 Folder Structure

~~~text
epic-eats
├── admin
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   │   ├── Header.jsx
│   │   │   ├── HrLine.jsx
│   │   │   ├── LoginPopup.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── SignupPopup.jsx
│   │   ├── context
│   │   │   └── StoreContext.jsx
│   │   ├── Pages
│   │   │   ├── Add.jsx
│   │   │   ├── List.jsx
│   │   │   └── Order.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
├── client
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   │   ├── ExploreMenu.jsx
│   │   │   ├── FoodItem.jsx
│   │   │   ├── FoodItems.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── HrLine.jsx
│   │   │   ├── LoginPopup.jsx
│   │   │   ├── MobileApp.jsx
│   │   │   └── SignupPopup.jsx
│   │   ├── context
│   │   │   └── StoreContext.jsx
│   │   ├── pages
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Order.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Verify.jsx
│   │   ├── utils
│   │   │   └── ProtectedRoutes.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
└── server
│   ├── controller
│   │   ├── Cart.js
│   │   ├── Food.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── database
│   │   ├── config.env
│   │   └── connect.js
│   ├── middlewares
│   │   ├── adminAuth.js
│   │   ├── auth.js
│   │   └── error.js
│   ├── model
│   │   ├── Food.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes
│   │   ├── Cart.js
│   │   ├── Food.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── uploads
│   ├── app.js
│   └── server.js
└── assets
~~~
## 🎬 Scripts

#### Server Scripts
`npm run dev` - Start the server in development mode using nodemon

`npm start` - Start the server in production mode

#### Client Scripts
`npm run dev` - Start the client in development mode using Vite

`npm run build` - Build the client for production
## 🤝 Contributing

We welcome contributions! Feel free to fork the repository and submit a pull request with your improvements.

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


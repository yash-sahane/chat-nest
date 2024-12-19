# 💬️ ChatNest - Real-time Chat Application with MERN Stack and Socket.io

Welcome to ChatNest! ChatNest is your go-to chat application, designed to offer a seamless and engaging experience for connecting with friends, family, and colleagues. Developed using the MERN stack (MongoDB, Express.js, React.js, Node.js) & Socket.io, ChatNest ensures a smooth and efficient platform for real-time communication.

## 🔗 Links

- GitHub: [Chat Nest](https://github.com/yash-sahane/chat-nest)

- User Interface: [Chat Nest](https://chat-nest-domniic.vercel.app/)

## 📸 Screenshots

![Home Page](https://github.com/yash-sahane/chat-nest/raw/main/assets/1.png)

![Home Page](https://github.com/yash-sahane/chat-nest/raw/main/assets/2.png)

![Home Page](https://github.com/yash-sahane/chat-nest/raw/main/assets/3.png)

![Home Page](https://github.com/yash-sahane/chat-nest/raw/main/assets/4.png)

![Home Page](https://github.com/yash-sahane/chat-nest/raw/main/assets/5.png)

![Home Page](https://github.com/yash-sahane/chat-nest/raw/main/assets/7.png)

![Home Page](https://github.com/yash-sahane/chat-nest/raw/main/assets/6.png)

![Home Page](https://github.com/yash-sahane/chat-nest/raw/main/assets/8.png)

![Home Page](https://github.com/yash-sahane/chat-nest/raw/main/assets/9.png)

![Home Page](https://github.com/yash-sahane/chat-nest/raw/main/assets/10.png)

![Home Page](https://github.com/yash-sahane/chat-nest/raw/main/assets/11.png)

## 🌟 Features

- **User Authentication**: Secure user registration and login using JWT.
- **Real-time Messaging**: Instant messaging with real-time updates powered by Socket.io.
- **User Presence**: See which users are online and active.
- **Direct and Group Chats**: Create and manage direct messages and group chats.
- **Emoji Support**: Send and receive emojis in messages.
- **Media Sharing**: Share images, videos, and files within the chat.
- **Message History**: Persistent message history for continuous conversations.

## 🛠️ Tech Stack

- **Frontend**: React.js (React Router), TypeScript, Tailwind CSS, Emoji Picker React
- **Backend**: Node.js, Express.js, Socket.io, Multer
- **Database**: MongoDB
- **State Management**: Redux Toolkit (RTK), Context Api (Theme, Socket)
- **UI Components**: Aceternity UI, Chadcn
- **Authentication**: JWT (JSON Web Tokens)

## 🛠️ Installation

#### Prerequisites

- Node.js
- MongoDB

#### Steps:

- Clone the repository:

```bash
  https://github.com/yash-sahane/chat-nest.git
```

- Install dependencies for client, server and admin:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

```

- Create a `.env` file in the `server` directory and add the following:

```bash
PORT = <port_for_development>

ORIGIN = <frontend_uri_for_development>

SERVER_URI = <backend_uri_for_development>

MONGO_URI = <your_mongo_db_connection_string>

SECRET_KEY = <your_jwt_secret>
```

- Create a `.env` file in the `client` directory and add the following:

```bash
VITE_SERVER_URI = <backend_uri_for_development>

```

- Run the application:

```bash
# Run server
cd server
npm run dev

# Run client
cd ../client
npm run dev
```

## 📑 API Reference

### User Routes

#### Login

```http
  POST /api/user/login
```

| Parameter  | Type     | Description                        |
| :--------- | :------- | :--------------------------------- |
| `email`    | `string` | **Required**. User's email address |
| `password` | `string` | **Required**. User's password      |

#### Signup

```http
  POST /api/user/signup
```

| Parameter  | Type     | Description                        |
| :--------- | :------- | :--------------------------------- |
| `email`    | `string` | **Required**. User's email address |
| `password` | `string` | **Required**. User's password      |

#### Profile Setup

```http
  POST /api/user/setup
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `firstName`    | `string` | **Required**. User's first name      |
| `lastName`     | `string` | **Required**. User's last name       |
| `avatar`       | `file`   | **Required**. User's profile picture |
| `profileTheme` | `string` | **Required**. User's profile theme   |

#### Logout

```http
  GET /api/user/logout
```

#### User info

```http
  GET /api/user/
```

#### All users (For Adding members in channel)

```http
  GET /api/user/getAllUsers
```

### Profile Routes

#### Get Profiles (Search Profiles)

```http
  POST /api/profiles/getProfiles
```

| Parameter    | Type     | Description               |
| :----------- | :------- | :------------------------ |
| `searchTerm` | `string` | **Required**. Search term |

#### Get Profiles (Search users already in conversation)

```http
  GET /api/profiles/getProfilesForDMList
```

### Channel Routes

#### Create Channel

```http
  POST /api/channel/create
```

| Parameter      | Type     | Description                   |
| :------------- | :------- | :---------------------------- |
| `name`         | `string` | **Required**. Channel name    |
| `members`      | `Array`  | **Required**. Channel members |
| `admin`        | `Object` | **Required**. Channel admin   |
| `avatar`       | `file`   | **Required**. Channel image   |
| `profileTheme` | `string` | **Required**. Channel theme   |

#### Join Channel

```http
  POST /api/channel/join
```

| Parameter   | Type     | Description              |
| :---------- | :------- | :----------------------- |
| `channelId` | `string` | **Required**. Channel id |
| `userId`    | `string` | **Required**. User id    |

#### Channels

```http
  GET /api/channel/getChannels
```

#### Searched Channels

```http
  POST /api/channel/getSearchedChannels
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name`    | `string` | **Required**. Channel name |

#### User Channels

```http
  GET /api/channel/getUserChannels
```

### Chat Routes

#### Chat Messages

```http
  POST /api/chat
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `user1`   | `string` | **Required**. ID of the user1 |
| `user2`   | `string` | **Required**. ID of the user2 |

#### Channel Chat Messages

```http
  POST /api/chat/getChannelMessages
```

| Parameter   | Type     | Description              |
| :---------- | :------- | :----------------------- |
| `channelId` | `string` | **Required**. Channel Id |

#### Send file

```http
  POST /api/chat/send_file
```

| Parameter  | Type   | Description             |
| :--------- | :----- | :---------------------- |
| `fileName` | `file` | **Required**. File name |

#### Download file

```http
  GET /api/chat/download_file/:filename
```

| Parameter  | Type   | Description             |
| :--------- | :----- | :---------------------- |
| `fileName` | `file` | **Required**. File name |

## 📁 Folder Structure

```text
📁chat-nest
    └── 📁assets
    └── 📁client
        └── .env
        └── .gitignore
        └── components.json
        └── eslint.config.js
        └── index.html
        └── package-lock.json
        └── package.json
        └── postcss.config.js
        └── 📁public
            └── icon.png
        └── README.md
        └── 📁src
            └── App.css
            └── App.tsx
            └── 📁assets
            └── 📁components
                └── ChannelChat.tsx
                └── ChannelChatMain.tsx
                └── ChannelChats.tsx
                └── ChannelsDialog.tsx
                └── Chat.tsx
                └── ChatMain.tsx
                └── Chats.tsx
                └── ChatSidebar.tsx
                └── CreateChannel.tsx
                └── GradientBackground.tsx
                └── HomeSidebar.tsx
                └── ProfilesDialog.tsx
                └── ToggleTheme.tsx
                └── 📁ui
                    └── alert-dialog.tsx
                    └── background-beams-with-collision.tsx
                    └── background-gradient-animation.tsx
                    └── badge.tsx
                    └── button.tsx
                    └── command.tsx
                    └── dialog.tsx
                    └── dropdown-menu.tsx
                    └── 📁extension
                        └── multi-select.tsx
                    └── input.tsx
                    └── skeleton.tsx
                    └── tabs.tsx
                └── UserSkeleton.tsx
            └── 📁context
                └── SocketProvier.tsx
                └── ThemeProvider.tsx
            └── index.css
            └── 📁lib
                └── utils.ts
            └── main.tsx
            └── 📁Pages
                └── Auth.tsx
                └── Home.tsx
                └── Profile.tsx
            └── 📁slices
                └── AuthApi.ts
                └── AuthSlice.ts
                └── ChatApi.ts
                └── ChatSlice.ts
            └── 📁store
                └── store.ts
            └── types.ts
            └── 📁utils
                └── getCookie.ts
                └── profileTheme.ts
                └── profileThemeKeys.ts
                └── ProtectedRoute.tsx
                └── type.ts
                └── UserProfile.tsx
            └── vite-env.d.ts
        └── tailwind.config.js
        └── tsconfig.app.json
        └── tsconfig.json
        └── tsconfig.node.json
        └── vercel.json
        └── vite.config.ts
    └── 📁server
        └── .env
        └── .gitIgnore
        └── app.js
        └── 📁controllers
            └── Channel.js
            └── Chat.js
            └── Profile.js
            └── User.js
        └── 📁cron
            └── cron.js
        └── 📁database
            └── db.js
        └── 📁middleware
            └── auth.js
            └── error.js
        └── 📁model
            └── Channel.js
            └── Message.js
            └── User.js
        └── package-lock.json
        └── package.json
        └── 📁routes
            └── Channel.js
            └── Chat.js
            └── Profile.js
            └── User.js
        └── socket.js
        └── 📁uploads
            └── 📁files
            └── 📁profiles
    └── README.md
```

## </> Scripts

#### Server Scripts

`npm run dev` - Start the server in development mode using nodemon

`npm start` - Start the server in production mode

#### Client Scripts

`npm run dev` - Start the client in development mode using Vite

`npm run build` - Build the client for production

## 🤝 Contributing

We welcome contributions! Feel free to fork the repository and submit a pull request with your improvements.

# E-learning Dashboard

![E-learning Dashboard](https://placehold.co/800x400/334155/e2e8f0?text=E-learning%20Dashboard)

A modern, feature-rich dashboard for online learning platforms. This application provides a seamless experience for both instructors and students to manage courses, track progress, and customize their learning environment.

## ✨ Key Features

- **Course Management:** Instructors can easily create, edit, and manage courses, including lessons and sections.
- **User Authentication:** Secure login and signup functionality for students and instructors.
- **Interactive Dashboard:** A central hub for users to view their enrolled courses, progress, and statistics.
- **Detailed Course View:** In-depth view of each course with a video player for lessons.
- **Customizable Settings:** Users can update their profile details, change passwords, and manage notifications.
- **Responsive Design:** Fully responsive interface that works on desktops, tablets, and mobile devices.

## 🚀 Tech Stack

This project is built with a modern and scalable technology stack:

- **Frontend:** [React](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Backend & Database:** [Supabase](https://supabase.io/)
- **Styling:** CSS Modules & Plain CSS
- **State Management:** React Context API & Redux Toolkit
- **Routing:** [React Router](https://reactrouter.com/)

## 📂 Project Structure

The project follows a feature-based directory structure to keep the codebase organized, scalable, and easy to maintain.

```
src
├── assets
├── components
│   ├── common
│   ├── layouts
│   └── ui
├── context
├── features
│   ├── auth
│   ├── courses
│   ├── dashboard
│   └── settings
├── hooks
├── pages
├── store
└── utils
```

For a detailed breakdown of the structure, please refer to the project documentation.

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/flavasava2022/E-learning-Dashboard.git](https://github.com/flavasava2022/E-learning-Dashboard.git)
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up environment variables**

    Create a `.env` file in the root of your project and add your Supabase project URL and Anon key. You can get these from your Supabase project settings.

    ```env
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

4.  **Run the development server**
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

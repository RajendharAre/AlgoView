# Algorithm Visualizer

<<<<<<< Updated upstream
Run locally:

```bash
npm install
npm run dev
```

Documentation:

- Components: `docs/components.md`
- Hooks: `docs/hooks.md`
- Algorithms: `docs/algorithms.md`
- Utilities and Libraries: `docs/utils-lib.md`

=======
An interactive web application for visualizing algorithms with step-by-step animations.

## Features

- Visualize sorting, searching, and graph algorithms
- Interactive controls to step through algorithms
- Firebase authentication (Email/Password, Google, GitHub)
- Responsive design for all devices
- Modern UI with smooth animations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd algorithm-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Firebase OAuth Setup

To enable Google and GitHub authentication, follow the instructions in [FIREBASE_OAUTH_SETUP.md](FIREBASE_OAUTH_SETUP.md).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- React 18
- Vite
- Firebase Authentication & Firestore
- Tailwind CSS
- Framer Motion
- Lucide React Icons

## Project Structure

```
src/
├── components/
│   ├── Auth/          # Authentication components
│   ├── Common/        # Shared components
│   ├── Layout/        # Layout components
│   └── Visualisation/ # Algorithm visualization components
├── hooks/             # Custom React hooks
├── lib/               # Firebase configuration
├── styles/            # CSS styles
├── utils/             # Utility functions
└── App.jsx            # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
>>>>>>> Stashed changes

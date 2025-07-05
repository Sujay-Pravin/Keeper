# API Vault - Secure API Key Manager

A full-stack web application for securely storing and managing API keys with user authentication and PIN-based verification for viewing sensitive information.

## Features

- User authentication with secure password hashing
- Encrypted storage of API keys
- PIN verification for viewing sensitive data
- Modern React UI with responsive design
- Secure Express.js backend with JWT authentication
- MySQL database storage

## Project Structure

- **Frontend**: React.js with Vite
- **Backend**: Express.js with MySQL

## Prerequisites

- Node.js (v14+ recommended)
- MySQL (via SQL Workbench or other client)
- npm or yarn

## Setup Instructions

### Database Setup

1. Create a MySQL database named `api_vault`
2. The application will automatically create necessary tables on first run

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content (modify as needed):
   ```
   # Server Configuration
   PORT=5000
   FRONTEND_URL=http://localhost:5173

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=api_vault

   # JWT Secret
   JWT_SECRET=your_super_secure_jwt_secret_key_change_in_production
   JWT_EXPIRES_IN=1d

   # Encryption Key for API Keys (32 characters for AES-256)
   ENCRYPTION_KEY=your32characterencryptionkey12345
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:5173`

## Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **API Key Encryption**: Implements AES encryption for API keys
- **JWT Authentication**: Secure token-based authentication for API endpoints
- **PIN Verification**: Secondary authentication layer for accessing sensitive data
- **Parameterized Queries**: Protection against SQL injection

## Bonus Features Implemented

- Session timeout via JWT expiry
- Copy-to-clipboard functionality for API keys
- Responsive UI design

## License

[MIT License](LICENSE) 
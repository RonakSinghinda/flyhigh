# SpendWise MVP - Setup Guide

Complete setup instructions for the SpendWise expense management system.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - Already installed locally
- **Git** (optional, for version control)
- **Postman** (optional, for API testing) - [Download](https://www.postman.com/downloads/)

---

## Project Structure

```
flyhigh/
├── backend/          # Node.js + Express API
├── frontend/         # React application
└── SpendWise_Postman_Collection.json
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```powershell
cd backend
```

### 2. Environment Configuration

The `.env` file has already been created with default values:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/spendwise
JWT_SECRET=spendwise_super_secret_jwt_key_2024_change_me
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**Important**: For production, change the `JWT_SECRET` to a secure random string.

### 3. Start MongoDB

Ensure MongoDB is running on your local machine:

```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# If not running, start it
net start MongoDB
```

### 4. Start Backend Server

**Development mode** (with auto-reload):
```powershell
npm run dev
```

**Production mode**:
```powershell
npm start
```

The backend will start on `http://localhost:5000`

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

---

## Frontend Setup

### 1. Open New Terminal and Navigate to Frontend

```powershell
cd frontend
```

### 2. Start Development Server

```powershell
npm run dev
```

The frontend will start on `http://localhost:5173`

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## First Time Setup

### 1. Access the Application

Open your browser and navigate to: `http://localhost:5173`

### 2. Create Admin Account

1. Click **"Register here"**
2. Fill in the form:
   - Name: Admin User
   - Email: admin@company.com
   - Password: admin123 (or your preferred password)
   - Role: **Admin**
3. Click **Register**

### 3. Create Employee Account

1. Logout from admin account
2. Register another user:
   - Name: John Doe
   - Email: john@company.com
   - Password: employee123
   - Role: **Employee**

---

## Testing the Application

### Option 1: Using the Web Interface

**As Employee:**
1. Login with employee credentials
2. Submit a new expense
3. View your expenses (pending, approved, rejected)
4. Edit or delete pending expenses

**As Admin:**
1. Login with admin credentials
2. View all employee expenses
3. Approve or reject pending expenses
4. Create and manage budgets

### Option 2: Using Postman

1. **Import Collection**
   - Open Postman
   - Click **Import**
   - Select `SpendWise_Postman_Collection.json`

2. **Set Environment Variables**
   - Base URL is already set to `http://localhost:5000/api`
   - Token will be automatically saved after login

3. **Test Workflow**
   ```
   1. Register User → Creates employee
   2. Register Admin → Creates admin
   3. Login → Get JWT token (auto-saved)
   4. Create Expense → Employee submits expense
   5. Get All Expenses → View expenses
   6. Approve Expense (Admin) → Admin approves
   7. Create Budget (Admin) → Set category budget
   ```

---

## Verify Installation

### Backend Health Check

Visit: `http://localhost:5000/api/health`

Expected response:
```json
{
  "success": true,
  "message": "SpendWise API is running",
  "timestamp": "2024-12-03T..."
}
```

### Check MongoDB Connection

1. Open MongoDB Compass (if installed)
2. Connect to `mongodb://localhost:27017`
3. You should see `spendwise` database with collections:
   - `users`
   - `expenses`
   - `budgets`

---

## Default Expense Categories

- Travel
- Meals
- Office Supplies
- Software
- Hardware
- Training
- Other

---

## Common Issues & Troubleshooting

### Issue: MongoDB Connection Failed

**Solution:**
```powershell
# Check if MongoDB is running
Get-Service -Name MongoDB

# Start MongoDB service
net start MongoDB

# Check if port 27017 is in use
netstat -ano | findstr :27017
```

### Issue: Port 5000 Already in Use

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Issue: Port 5173 Already in Use

**Solution:**
```powershell
# Vite will automatically use next available port
# Or manually specify in frontend/vite.config.js
```

### Issue: CORS Errors

**Solution:**
- Ensure backend `CLIENT_URL` in `.env` matches frontend URL
- Default is `http://localhost:5173`

### Issue: JWT Token Invalid/Expired

**Solution:**
- Tokens expire after 7 days (default)
- Logout and login again to get fresh token
- Clear browser localStorage if needed

---

## Stopping the Application

### Stop Backend
Press `Ctrl + C` in the backend terminal

### Stop Frontend
Press `Ctrl + C` in the frontend terminal

### Stop MongoDB
```powershell
net stop MongoDB
```

---

## Next Steps

- Read `DEPLOYMENT.md` for production deployment
- Explore the Postman collection for API testing
- Customize expense categories in backend models
- Add more features as needed

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the implementation plan
- Check console logs for error details

---

## Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Implement rate limiting for production
- Add input sanitization for production
- Use strong passwords for all accounts

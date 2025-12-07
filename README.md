# 💰 SpendWise MVP

A minimal but complete MERN stack application for corporate expense management with role-based access control.

## 🚀 Features

### Employee Features
- ✅ Submit expense claims
- ✅ View personal expense history
- ✅ Edit pending expenses
- ✅ Delete pending expenses
- ✅ Track expense status (Pending/Approved/Rejected)

### Admin Features
- ✅ View all employee expenses
- ✅ Approve or reject expenses
- ✅ Add review notes
- ✅ Create and manage budgets by category
- ✅ Track budget utilization
- ✅ View expense analytics

### Security Features
- ✅ JWT-based authentication
- ✅ Role-based access control (Employee/Admin)
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ Input validation

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management

## 📁 Project Structure

```
flyhigh/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── budgetController.js   # Budget management
│   │   └── expenseController.js  # Expense CRUD
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── errorHandler.js       # Error handling
│   ├── models/
│   │   ├── Budget.js             # Budget schema
│   │   ├── Expense.js            # Expense schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── budgets.js            # Budget routes
│   │   └── expenses.js           # Expense routes
│   ├── .env                       # Environment variables
│   ├── .env.example              # Example env file
│   ├── package.json
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios configuration
│   │   ├── components/
│   │   │   ├── ExpenseCard.jsx   # Expense display component
│   │   │   ├── Layout.jsx        # App layout with nav
│   │   │   └── PrivateRoute.jsx  # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx               # Main app component
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── SpendWise_Postman_Collection.json
├── SETUP.md                       # Setup instructions
├── DEPLOYMENT.md                  # Deployment guide
└── README.md                      # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Expenses
- `POST /api/expenses` - Create expense (Employee)
- `GET /api/expenses` - Get expenses (Employee: own, Admin: all)
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense (Employee: own pending only)
- `DELETE /api/expenses/:id` - Delete expense (Employee: own pending only)
- `PUT /api/expenses/:id/status` - Approve/Reject expense (Admin only)

### Budgets
- `POST /api/budgets` - Create budget (Admin only)
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/:id` - Get single budget
- `PUT /api/budgets/:id` - Update budget (Admin only)
- `DELETE /api/budgets/:id` - Delete budget (Admin only)

## 💾 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['employee', 'admin'],
  createdAt: Date
}
```

### Expense
```javascript
{
  employee: ObjectId (User),
  amount: Number,
  category: Enum [...categories],
  description: String,
  date: Date,
  status: Enum ['pending', 'approved', 'rejected'],
  receiptUrl: String,
  reviewedBy: ObjectId (User),
  reviewedAt: Date,
  reviewNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Budget
```javascript
{
  category: String (unique),
  totalAmount: Number,
  spentAmount: Number,
  period: String,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

## 📦 Installation

See [SETUP.md](SETUP.md) for detailed setup instructions.

### Quick Start

1. **Clone and Navigate**
   ```powershell
   cd flyhigh
   ```

2. **Backend Setup**
   ```powershell
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Setup** (new terminal)
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 🧪 Testing

### Using Postman

1. Import `SpendWise_Postman_Collection.json`
2. Follow the request order:
   - Register User/Admin
   - Login (token auto-saved)
   - Create/Manage Expenses
   - Approve/Reject (Admin)
   - Manage Budgets (Admin)

### Test Credentials

Create accounts via UI or use these sample credentials after registration:

**Admin:**
- Email: admin@company.com
- Password: admin123

**Employee:**
- Email: employee@company.com
- Password: employee123

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

**Recommended Stack:**
- Backend: Railway (free tier)
- Frontend: Vercel (free tier)
- Database: MongoDB Atlas (free tier)

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with expiration
- ✅ Protected routes with middleware
- ✅ Role-based access control
- ✅ Input validation on models
- ✅ CORS configuration
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production

## 📝 Expense Categories

- Travel
- Meals
- Office Supplies
- Software
- Hardware
- Training
- Other

## 🎨 UI Features

- Clean and modern design
- Responsive layout
- Loading states
- Error handling
- Success/Error alerts
- Status badges with colors
- Budget progress indicators
- Role-based navigation

## 🔄 Workflow

1. **Employee** submits expense claim
2. **System** creates expense with "pending" status
3. **Admin** reviews expense in dashboard
4. **Admin** approves or rejects with notes
5. If **approved**, budget's spent amount updates automatically
6. **Employee** can view status and notes

## 📊 Manager Dashboard

- **Expenses Tab**
  - Filter by status (pending/approved/rejected/all)
  - View all employee expenses
  - Approve/reject with notes
  - See employee details

- **Budgets Tab**
  - Create budgets by category
  - Set budget period
  - View spent/remaining amounts
  - Visual progress bars
  - Edit/delete budgets

## 👤 Employee Dashboard

- Submit new expense form
- View expenses by status:
  - Pending (editable/deletable)
  - Approved (view only)
  - Rejected (view only with notes)
- Edit pending expenses
- Delete pending expenses

## 🐛 Troubleshooting

See [SETUP.md](SETUP.md#common-issues--troubleshooting) for common issues and solutions.

## 📚 Documentation

- [SETUP.md](SETUP.md) - Local development setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- `SpendWise_Postman_Collection.json` - API documentation

## 🚧 Future Enhancements

Potential features for future versions:

- [ ] Receipt upload (file storage)
- [ ] Email notifications
- [ ] Expense reports and analytics
- [ ] Multiple approval levels
- [ ] Department-based budgeting
- [ ] Export to CSV/PDF
- [ ] Search and advanced filtering
- [ ] Audit logs
- [ ] Multi-currency support
- [ ] Mobile app

## 📄 License

MIT License - Free to use and modify

## 👥 Roles & Permissions

| Feature | Employee | Admin |
|---------|----------|-------|
| Submit Expense | ✅ | ✅ |
| View Own Expenses | ✅ | ✅ |
| View All Expenses | ❌ | ✅ |
| Edit Pending Expense | ✅ (own) | ❌ |
| Delete Pending Expense | ✅ (own) | ❌ |
| Approve/Reject Expense | ❌ | ✅ |
| Create Budget | ❌ | ✅ |
| View Budgets | ✅ | ✅ |
| Edit Budget | ❌ | ✅ |
| Delete Budget | ❌ | ✅ |

## 🤝 Contributing

This is an MVP. Feel free to fork and enhance!

## 📞 Support

For issues:
1. Check SETUP.md troubleshooting section
2. Review browser/server console logs
3. Verify environment variables
4. Check MongoDB connection

---

**Built with ❤️ using the MERN stack**
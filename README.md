# Civic Issues Admin Dashboard

A comprehensive admin dashboard for managing civic issues reported by citizens. Built with Next.js, TypeScript, and PostgreSQL.

## Features

### 🏛️ Admin Dashboard

- **Issue Management**: View, filter, and manage all civic issues
- **Status Tracking**: Update issue status (pending, in-progress, resolved, rejected)
- **Department Assignment**: Assign issues to appropriate departments
- **Priority Management**: Set and manage issue priorities
- **Admin Notes**: Add internal notes and comments

### 📊 Analytics & Reporting

- **Real-time Statistics**: Overview of total, resolved, and pending issues
- **Category Analysis**: Breakdown of issues by category
- **Priority Distribution**: Analysis of issue priorities
- **Trend Analysis**: Recent activity and performance metrics
- **Interactive Charts**: Visual representation of data

### 👥 User Management

- **User Roles**: Admin and user role management
- **User Profiles**: View and manage user information
- **Access Control**: Role-based permissions

### 🏢 Department Management

- **Department CRUD**: Create, read, update, and delete departments
- **Contact Information**: Manage department contact details
- **Issue Assignment**: Assign issues to specific departments

### 💬 Communication

- **Comments System**: Add and manage comments on issues
- **Status Updates**: Track issue progress with updates
- **Notifications**: Email and push notification settings

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Database Schema

The application uses the following main tables:

- `civic_issues`: Main table for civic issue reports
- `departments`: Government departments
- `profiles`: User profile information
- `report_comments`: Comments on reports
- `updates`: Status updates for issues

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd civic-admin-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Update the database connection details in `.env.local`:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/civic_issues_db
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=civic_issues_db
   DB_USER=username
   DB_PASSWORD=password
   ```

4. **Set up the database**

   - Create a PostgreSQL database
   - Run the provided SQL schema to create tables
   - Ensure the database connection details match your setup

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```text
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Dashboard home page
│   ├── issues/           # Issues management pages
│   ├── departments/      # Department management
│   ├── analytics/        # Analytics dashboard
│   ├── comments/         # Comments management
│   ├── users/           # User management
│   └── settings/        # Application settings
├── components/           # Reusable UI components
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── Header.tsx       # Top header
│   ├── StatsCard.tsx    # Statistics cards
│   └── IssueCard.tsx    # Issue display cards
├── lib/                 # Utility functions
│   ├── database.ts      # Database connection and types
│   └── queries.ts       # Database queries
└── public/              # Static assets
```

## Key Features

### Dashboard Overview

- Real-time statistics and metrics
- Recent issues display
- Category breakdown
- Quick access to all features

### Issue Management

- Comprehensive issue listing with filters
- Search functionality
- Status management
- Priority assignment
- Image viewing
- Location details

### Analytics

- Interactive charts and graphs
- Performance metrics
- Trend analysis
- Export capabilities

### Department Management

- CRUD operations for departments
- Contact information management
- Issue assignment tracking

## API Endpoints

The application uses server-side functions for data fetching:

- `getAllCivicIssues()`: Fetch all civic issues
- `getCivicIssueById(id)`: Get specific issue details
- `updateCivicIssueStatus(id, status, notes)`: Update issue status
- `getCivicIssuesStats()`: Get analytics data
- `getAllDepartments()`: Fetch all departments
- `getCommentsByReportId(id)`: Get comments for an issue

## Customization

### Styling

The application uses Tailwind CSS for styling. You can customize the theme by modifying `tailwind.config.js`.

### Database

The database schema can be extended by adding new tables or columns. Update the TypeScript types in `lib/database.ts` accordingly.

### Features

New features can be added by creating new pages in the `app/` directory and adding corresponding navigation items in `components/Sidebar.tsx`.

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Ensure all environment variables are properly set in your production environment.

### Database

Make sure your production PostgreSQL database is properly configured and accessible.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
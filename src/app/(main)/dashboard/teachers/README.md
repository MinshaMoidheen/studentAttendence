# Teachers Management

This module provides comprehensive teacher management functionality for the school administration system.

## Features

### 📋 **Teacher Management**
- **Add Teachers**: Create new teacher profiles with complete information
- **List Teachers**: View all teachers in a organized table format
- **View Details**: See detailed information about each teacher
- **Edit Teachers**: Update teacher information (coming soon)
- **Delete Teachers**: Remove teachers from the system

### 📊 **Dashboard Statistics**
- **Total Teachers**: Count of all active teachers
- **Divisions Covered**: Number of different divisions
- **Classes Covered**: Number of different classes

## Components

### `TeacherForm` (`_components/teacher-form.tsx`)
Modal form for adding new teachers with the following fields:
- **Name** (required): Teacher's full name
- **Division** (required): Division assignment (A, B, C, D)
- **Class** (required): Class assignment (1-10)
- **Password** (required): Login password
- **Confirm Password** (required): Password confirmation
- **Phone** (optional): Phone number

### `TeacherList` (`_components/teacher-list.tsx`)
Table component displaying all teachers with:
- **Teacher Information**: Name and avatar
- **Assignment Details**: Division and class badges
- **Contact Information**: Phone number
- **Actions Menu**: View, Edit, Delete options

### `TeachersPage` (`page.tsx`)
Main page component featuring:
- **Header Section**: Title, description, and add button
- **Statistics Cards**: Key metrics about teachers
- **Teachers List**: Complete list of all teachers
- **Add Modal**: Integrated teacher form

## API Integration

### RTK Query Endpoints
- `useGetTeachersQuery()`: Fetch all teachers
- `useGetTeacherByIdQuery(id)`: Fetch specific teacher
- `useCreateTeacherMutation()`: Add new teacher
- `useUpdateTeacherMutation()`: Update teacher (coming soon)
- `useDeleteTeacherMutation()`: Delete teacher

### API Endpoints
- `GET /api/v1/users/teachers` - Get all teachers
- `GET /api/v1/users/teachers/:id` - Get teacher by ID
- `POST /api/v1/users/teachers` - Create teacher
- `PUT /api/v1/users/teachers/:id` - Update teacher
- `DELETE /api/v1/users/teachers/:id` - Delete teacher

## Data Structure

```typescript
interface Teacher {
  id: string;
  name: string;
  division: string;
  class: string;
  password: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## Form Validation

The teacher form includes comprehensive validation:
- **Name**: Minimum 2 characters
- **Division**: Required selection
- **Class**: Required selection
- **Password**: Minimum 6 characters
- **Confirm Password**: Must match password
- **Phone**: Optional field

## Usage

1. **Navigate to Teachers**: Click "Teachers" in the sidebar
2. **Add Teacher**: Click "Add Teacher" button to open the modal
3. **Fill Form**: Complete all required fields and optional information
4. **Submit**: Click "Add Teacher" to save
5. **View List**: See all teachers in the table below
6. **Manage Teachers**: Use the actions menu for each teacher

## Future Enhancements

- [ ] Edit teacher functionality
- [ ] Bulk import/export teachers
- [ ] Teacher search and filtering
- [ ] Teacher assignment management
- [ ] Teacher performance tracking
- [ ] Email notifications for new teachers

## Navigation

The teachers page is accessible via:
- **Sidebar**: Pages → Teachers
- **URL**: `/dashboard/teachers`
- **Icon**: UserCheck icon

# 🎉 SAMAROH - Smart Family Event Coordination Platform

## Overview
SAMAROH is a comprehensive web application designed to simplify family event planning and coordination. Whether you're organizing a wedding, birthday, festival, or any family celebration, SAMAROH brings structure to the chaos of multi-day events.

## 🌟 Key Features

### 1. **Guest Management & Attendance Tracking**
- Add guests with their contact information (name, email, phone)
- Track RSVP status: Pending, Confirmed, Declined
- Visual statistics showing guest confirmation rates
- Easy bulk management of invitations

### 2. **Task Management**
- Create and assign tasks to family members
- Organize by categories: Food, Decoration, Venue, Entertainment, Invitations, Other
- Set priorities: Low, Medium, High
- Track task completion status with visual checkboxes
- Set due dates for accountability
- Add descriptions for detailed task information

### 3. **Expense Tracker**
- Record all event expenses collaboratively
- Categorize spending: Food, Decoration, Venue, Entertainment, Guest Gifts, Transport, Other
- Track who paid for each expense
- View total budget at a glance
- See breakdown by category
- Add notes for expense details

### 4. **Event Schedule**
- Create a detailed timeline of events within your celebration
- Add multiple events (ceremony, reception, meals, etc.)
- Set specific times for each event
- Specify locations
- List attendees for each event
- Auto-sorted chronologically

### 5. **Family Members & Role Assignment**
- Add family members to the coordination team
- Assign roles: Organizer, Coordinator, Vendor Manager, Guest Manager, Budget Manager
- Track tasks assigned to each member
- Easy communication visibility

### 6. **Dashboard Analytics**
- Overview of all event metrics at a glance
- Guest confirmation status
- Task completion percentage
- Total expenses and budget breakdown
- Days remaining until event
- Quick statistics and visual indicators

## 🛠️ Tech Stack

- **Frontend**: React 19 with Vite
- **Database**: Firebase Firestore
- **Styling**: CSS Modules for component-scoped styles
- **State Management**: React Context API + Firebase Realtime Updates

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx           # Event metrics overview
│   ├── GuestManagement.jsx     # Guest invitations and tracking
│   ├── TaskManagement.jsx      # Task creation and management
│   ├── ExpenseTracker.jsx      # Budget and expense tracking
│   ├── ScheduleView.jsx        # Event timeline
│   └── FamilyMembers.jsx       # Team member management
├── context/
│   └── EventContext.jsx        # Global event context
├── hooks/
│   └── useFirebaseEvents.js    # Firebase data operations
├── styles/
│   └── components.module.css   # Component styles
├── firebase.js          # Firebase configuration
├── App.jsx              # Main app component
├── App.css              # Global styles
├── index.css            # Root styles
└── main.jsx            # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start the development server**
```bash
npm run dev
```

3. **Open in browser**
Navigate to `http://localhost:5173`

### Build for production
```bash
npm run build
```

## 💻 Usage Guide

### Creating an Event
1. Click "Create New Event" on the home page
2. Enter event name (e.g., "Priya's Wedding")
3. Select event type (Wedding, Birthday, Anniversary, Corporate, Festival)
4. Choose event date
5. Click "Create Event"

### Managing Guests
1. Open an event and go to the **Guests** tab
2. Click "+ Invite Guest"
3. Enter guest name, email, and phone (optional)
4. Update status as responses come in: Pending → Confirmed/Declined
5. View guest statistics (Total, Confirmed, Pending, Declined)

### Creating Tasks
1. Go to **Tasks** tab
2. Click "+ Add Task"
3. Fill in task details:
   - Title (required)
   - Category (Food, Decoration, Venue, etc.)
   - Description
   - Assign to family member
   - Set due date
4. Set priority level
5. Check off as tasks are completed

### Tracking Expenses
1. Go to **Budget** tab
2. Click "+ Add Expense"
3. Enter:
   - Description
   - Category
   - Amount (₹)
   - Who paid
   - Notes (optional)
4. View total expenses and category breakdown

### Planning Timeline
1. Go to **Schedule** tab
2. Click "+ Add Event"
3. Enter:
   - Event name (Ceremony, Reception, Dinner, etc.)
   - Date and time
   - Location
   - Description
   - Attendees (comma-separated)
4. Timeline auto-sorts chronologically

### Team Coordination
1. Go to **Team** tab
2. Click "+ Add Member"
3. Add family member details:
   - Name
   - Phone (optional)
   - Role (Organizer, Coordinator, Vendor Manager, etc.)
4. View assigned tasks per member
5. Update roles as needed

## 🎯 Best Practices

### For Event Organizers
1. Start by adding all family members as coordinators
2. Assign specific roles based on responsibilities
3. Create comprehensive task list early
4. Set realistic deadlines
5. Regular budget reviews

### For Coordination
1. Update guest status promptly
2. Mark tasks as complete immediately
3. Record expenses as they occur
4. Communicate changes to all members
5. Use the dashboard to identify bottlenecks

### For Guests
1. Respond to invitations timely
2. Check the schedule regularly
3. Clarify any location/time details early
4. Update if attendance changes

## 🔒 Data Management

### Cloud Storage (Firebase)
- All data is stored in Firebase Firestore
- Real-time synchronization across devices
- Automatic backups
- Accessible from any device

### Data Structure
Each event contains:
- Event metadata (name, type, date, status)
- Guest list with attendance status
- Task list with assignments
- Expense records
- Schedule timeline
- Family member list

## 🚨 Troubleshooting

### Events not appearing?
- Check your internet connection
- Verify Firebase configuration
- Clear browser cache

### Changes not syncing?
- Refresh the page
- Check Firebase Firestore permissions
- Ensure you're using the latest browser

### Can't add guests/tasks?
- Verify event is properly created
- Check browser console for errors
- Try logging out and back in

## 📱 Mobile Compatibility
- Fully responsive design
- Works on tablets and mobile devices
- Touch-friendly interface
- Optimized for different screen sizes

## 🔄 Future Enhancements
- User authentication and roles
- Email/SMS reminders for pending tasks
- File attachments and media sharing
- Budget forecasting
- Guest seating arrangements
- Vendor contact management
- Event photo gallery
- Export reports (PDF, Excel)
- Calendar integration
- Mobile app

## 📞 Support
For issues or feature requests, check your Firebase console for any errors or contact the development team.

## 📝 License
This project is part of TECHNOTHON's Vibe-Athon 2026 competition.

---

**Made with ❤️ for seamless family celebrations**

Version 1.0.0 | Last Updated: 2026

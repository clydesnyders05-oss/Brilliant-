# Brilliant CS - Progress over Pressure. Stay Brilliant.

A premium, offline-first Progressive Web App (PWA) for student productivity. Built with vanilla HTML, CSS, and JavaScript. Designed to feel calm, modern, and production-ready.

## ✨ Features

### Core Modules
- **Authentication** - Secure sign-up and sign-in with Supabase
- **Dashboard** - Overview of today's tasks, schedule, and progress
- **Subjects** - Organize your courses and subjects
- **Tasks/To-Do** - Create, track, and manage tasks with priorities
- **Timetable** - Weekly and daily schedule views
- **Pomodoro Timer** - Built-in focus sessions with break reminders
- **Calendar** - Monthly overview for planning
- **Vision Board** - Personal goals and inspirational quotes
- **Settings** - Theme control, data export/import, reset options

### Technical Features
- **Offline-First** - Full functionality without internet
- **PWA Installation** - Install as native app on any device
- **IndexedDB Storage** - Persistent offline data
- **Dark Mode** - Beautiful dark theme toggle
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Service Worker** - Automatic caching and background sync
- **Zero Dependencies** - Pure vanilla JavaScript, HTML, CSS

## 🎨 Design

### Aesthetic
- Notion-inspired, premium UI
- Calm color palette: beige, soft greys, warm neutrals
- Smooth animations and micro-interactions
- Clean typography and generous whitespace

### Responsive
- **Mobile First** - Optimized for phones
- **Tablet** - Landscape and portrait support
- **Desktop** - Full-featured desktop experience

## 🚀 Getting Started

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd brilliant-cs
   ```

2. **Configure Supabase** (Optional - for online features)
   - Create a free account at [supabase.com](https://supabase.com)
   - Update credentials in `js/modules/auth.js`:
     ```javascript
     const SUPABASE_URL = 'your-project.supabase.co';
     const SUPABASE_ANON_KEY = 'your-anon-key';
     ```

3. **Deploy to Hosting** (Choose one)

   **GitHub Pages:**
   ```bash
   git push origin main
   # Enable GitHub Pages in repository settings
   ```

   **Netlify:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Deploy
   netlify deploy --prod --dir=.
   ```

   **Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel --prod
   ```

4. **Access Your App**
   - Navigate to your deployed URL
   - Create an account
   - Start being brilliant! ✨

## 📁 Project Structure

```
brilliant-cs/
├── index.html                 # Main HTML file
├── manifest.json             # PWA manifest
├── service-worker.js         # Offline support
│
├── css/
│   ├── reset.css            # CSS reset
│   ├── theme.css            # Color variables & themes
│   ├── layout.css           # Main layout structure
│   ├── components.css       # Component styles
│   ├── animations.css       # Animation keyframes
│   └── responsive.css       # Media queries
│
├── js/
│   ├── utils/
│   │   ├── db.js            # IndexedDB management
│   │   ├── offline.js       # Offline utilities
│   │   └── quotes.js        # Motivational quotes
│   │
│   ├── modules/
│   │   ├── auth.js          # Authentication
│   │   ├── ui.js            # UI management
│   │   ├── subjects.js      # Subjects management
│   │   ├── tasks.js         # Tasks management
│   │   ├── timetable.js     # Timetable management
│   │   ├── pomodoro.js      # Pomodoro timer
│   │   ├── calendar.js      # Calendar
│   │   ├── vision.js        # Vision board
│   │   └── settings.js      # Settings management
│   │
│   └── app.js               # Main app controller
│
└── README.md               # This file
```

## 🔒 Offline Usage

The app is **fully functional offline**:
- All data stored in IndexedDB
- Service Worker caches assets automatically
- Changes sync when you reconnect
- No internet required to be productive

## 🎯 How to Use

### Add a Subject
1. Click "Subjects" in the sidebar
2. Click "+ Add Subject"
3. Enter subject name, code, and color
4. Click "Save Subject"

### Create a Task
1. Click "Tasks" or click "+ Add Task" from Dashboard
2. Fill in task details
3. Select subject and due date
4. Set priority and status
5. Click "Save Task"

### Schedule Classes
1. Click "Timetable"
2. Click "+ Add Class"
3. Select subject, day, and time
4. Enter location and duration
5. Click "Save Class"

### Use Pomodoro Timer
1. Click "Pomodoro"
2. Click "Start" to begin 25-min focus session
3. Concentrate and complete your work
4. Timer alerts when break time starts
5. Repeat for productivity boost

### Track Goals
1. Click "Vision Board"
2. Click "+ Add Goal"
3. Enter your inspiration or goal
4. Click "Save Goal"
5. View all goals together for motivation

### Manage Settings
1. Click ⚙️ Settings
2. Toggle Dark Mode
3. Export data as JSON backup
4. Reset all data if needed

## 🔌 Supabase Integration (Optional)

For cloud sync and authentication across devices:

1. **Create Supabase Account** → [supabase.com](https://supabase.com)
2. **Create New Project** with your preferred region
3. **Get Your Keys**
   - Go to Settings → API
   - Copy Project URL and Anon Key
4. **Update in Code**
   ```javascript
   // js/modules/auth.js
   const SUPABASE_URL = 'your-url';
   const SUPABASE_ANON_KEY = 'your-key';
   ```
5. **Create Tables** (Optional)
   ```sql
   -- Users table
   CREATE TABLE users (
       id UUID PRIMARY KEY,
       email VARCHAR UNIQUE,
       name VARCHAR,
       created_at TIMESTAMP
   );
   ```

## 📱 Install as App

### iOS
1. Open in Safari
2. Tap Share → Add to Home Screen
3. Name it "Brilliant CS"
4. Tap Add

### Android
1. Open in Chrome
2. Tap Menu (three dots)
3. Tap "Install app"
4. Confirm installation

### Desktop (Windows/Mac/Linux)
1. Open in Chrome/Edge
2. Click Install icon (top-right address bar)
3. Confirm
4. App launches as standalone window

## 🌙 Dark Mode

- Click ⚙️ Settings
- Toggle "Dark Mode"
- Preference saves automatically
- Works offline

## 📤 Export & Import Data

### Export
- Settings → "📥 Export Data"
- Saves JSON file to your computer
- Perfect for backup or switching devices

### Import
1. Get a previously exported JSON file
2. Clear current data (if needed)
3. Open browser console
4. Run: `await settings.importData(file)`

## 🛠 Customization

### Change Theme Colors
Edit `css/theme.css`:
```css
:root {
    --color-accent: #8b7355;           /* Primary color */
    --color-success: #6b8e6b;          /* Success green */
    --color-error: #a85a5a;            /* Error red */
    /* ... more colors ... */
}
```

### Adjust Pomodoro Durations
Edit `js/modules/pomodoro.js`:
```javascript
this.WORK_DURATION = 25 * 60;   // 25 minutes
this.BREAK_DURATION = 5 * 60;   // 5 minutes
```

### Add More Quotes
Edit `js/utils/quotes.js`:
```javascript
const quotes = [
    { text: "Your quote", author: "Author" },
    // Add more...
];
```

## 🚀 Performance Tips

- App loads in < 2 seconds
- Minimal file sizes (all minified in production)
- Optimized images and assets
- Service Worker pre-caches critical assets
- IndexedDB for zero-latency data access

## 🔐 Privacy & Security

- ✅ All data stored locally on your device
- ✅ No analytics or tracking
- ✅ No ads or third-party cookies
- ✅ Optional Supabase integration (your choice)
- ✅ Complete data export whenever you want

## 📝 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 90+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 🐛 Troubleshooting

### App Not Loading
1. Clear browser cache
2. Clear IndexedDB: Settings → "🗑️ Reset All Data"
3. Reload page

### Service Worker Issues
1. Open DevTools → Application → Service Workers
2. Unregister old worker
3. Hard refresh (Ctrl+Shift+R)

### Data Not Syncing
1. Check internet connection
2. Check browser console for errors
3. Manually export and re-import data

## 📄 License

Created with ❤️ for students everywhere.

## 🤝 Contributing

Found a bug? Have a feature idea? Feel free to contribute!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🙏 Credits

- Inspired by Notion's elegant design
- Built with vanilla web technologies
- Powered by IndexedDB and Service Workers
- Optional Supabase integration

---

**Progress over pressure. Stay brilliant.** ✨

Made with ❤️ for every student pursuing excellence.

# Brilliant CS - File Structure & Index

Complete guide to every file in the project.

```
brilliant-cs/
│
├── 📄 HTML & PWA
│   ├── index.html                    # Main application (550+ lines)
│   ├── manifest.json                 # PWA configuration
│   └── service-worker.js             # Offline support & caching
│
├── 🎨 CSS (6 files, ~1000 lines)
│   ├── css/
│   │   ├── reset.css                 # Browser defaults & normalization
│   │   ├── theme.css                 # CSS variables, color themes
│   │   ├── layout.css                # Page layout & structure
│   │   ├── components.css            # UI component styles
│   │   ├── animations.css            # Keyframes & transitions
│   │   └── responsive.css            # Media queries & breakpoints
│
├── ⚙️ JavaScript (13 files, ~2500+ lines)
│   └── js/
│       ├── utils/
│       │   ├── db.js                 # IndexedDB manager (CRUD, sync)
│       │   ├── offline.js            # Offline detection, storage
│       │   └── quotes.js             # Motivational quotes database
│       │
│       ├── modules/
│       │   ├── auth.js               # Supabase authentication
│       │   ├── ui.js                 # Navigation & screen management
│       │   ├── subjects.js           # Course/subject management
│       │   ├── tasks.js              # Task/to-do management
│       │   ├── timetable.js          # Schedule/class management
│       │   ├── pomodoro.js           # Focus timer (25/5 min sessions)
│       │   ├── calendar.js           # Monthly calendar view
│       │   ├── vision.js             # Goals & inspiration board
│       │   └── settings.js           # Preferences & data export
│       │
│       └── app.js                    # Main app controller
│
├── 📚 Documentation (4 files)
│   ├── README.md                     # Full documentation (900+ lines)
│   ├── QUICKSTART.md                 # User guide & tips (400+ lines)
│   ├── DEPLOYMENT.md                 # Deployment guide (400+ lines)
│   └── PROJECT_SUMMARY.md            # This summary (500+ lines)
│
├── 📋 Configuration
│   └── .gitignore                    # Git ignore rules
│
└── 📦 Total: 24 files
```

---

## 📄 Core Files

### index.html (550+ lines)
**Main application shell**
- HTML structure for all screens
- Authentication UI
- Welcome screen
- Main app layout
- 8 feature views
- 5 modal dialogs
- Toast notification area

**Key Sections:**
- `#app` - Root container
- `#auth-screen` - Sign in/up
- `#welcome-screen` - Onboarding
- `#main-app` - Main interface
  - Header, sidebar, main content
- Views: Dashboard, Subjects, Tasks, Timetable, Pomodoro, Calendar, Vision, Settings
- Modals: Subject, Task, Class, Goal

### manifest.json
**PWA Configuration**
- App name, short name, description
- Start URL, scope, display
- Theme and background colors
- Icon definitions (SVG)
- App shortcuts
- Screenshot for stores

**Enables:**
- Installation on home screen
- Standalone app mode
- Share target API
- App icons

### service-worker.js (400+ lines)
**Offline Support & Caching**

**Features:**
- Install: Cache core assets
- Activate: Clean old caches
- Fetch: Serve from cache, fallback to network
- Background sync: Sync changes
- Push notifications: App notifications
- Message handler: Client communication

---

## 🎨 CSS Files

### reset.css
**Browser Defaults**
- Remove default margins/padding
- Normalize element styling
- Box sizing for all elements
- Form element defaults

### theme.css
**Design System**
- CSS variables for colors
- Light mode palette
- Dark mode palette
- Typography scales
- Spacing scale
- Border radius presets
- Z-index management
- Transition timings

**Key Variables:**
```css
--color-accent: #8b7355           /* Primary color */
--space-md: 1rem                 /* Spacing unit */
--radius-md: 10px               /* Border radius */
--font-size-lg: 1.125rem        /* Typography */
--transition-base: 250ms ease   /* Animations */
```

### layout.css
**Page Structure**
- App container layout
- Header styling
- Sidebar navigation
- Main content area
- View containers
- Responsive grid layouts
- Card styling
- Screen transitions

### components.css
**UI Components** (~600 lines)
- Buttons (primary, secondary, danger, icon)
- Forms (inputs, selects, toggles)
- Modals (dialog boxes)
- Task items (checkboxes, actions)
- Subject cards
- Filter/view buttons
- Toast notifications
- Auth screens
- Welcome screen
- Progress indicators
- Quote cards

### animations.css
**Movement & Effects**
- Fade in/out
- Slide up/down
- Pulse effect
- Spin rotation
- Scrollbar styling
- Loading states
- Smooth transitions
- Hover effects

### responsive.css
**Mobile & Tablet Optimization**
- Media queries for breakpoints
- Mobile menu handling
- Touch-friendly sizes
- Vertical stacking
- Reduced motion support
- Dark mode preference
- Landscape orientation
- Print styles

---

## ⚙️ JavaScript Modules

### utils/db.js (250+ lines)
**IndexedDB Database Manager**

**Classes:**
- `DatabaseManager` - Main database class

**Methods:**
- `init()` - Initialize database
- `add(store, data)` - Add new record
- `put(store, data)` - Insert/update
- `get(store, key)` - Get single record
- `getAll(store)` - Get all records
- `getAllByIndex(store, index, value)` - Query by index
- `delete(store, key)` - Delete record
- `clear(store)` - Clear all records
- `deleteAllByIndex()` - Delete multiple
- `exportData()` - Full backup as JSON
- `importData(data)` - Restore from JSON
- `clearAll()` - Complete reset

**Stores:**
- `users` - User accounts
- `subjects` - Courses/subjects
- `tasks` - To-do items
- `classes` - Timetable entries
- `goals` - Vision board items
- `pomodoro` - Focus session stats
- `syncQueue` - Offline changes

**Global:** `const db = new DatabaseManager()`

### utils/offline.js (300+ lines)
**Offline Management & Utilities**

**Classes:**
1. `OfflineManager`
   - `isOnline()` - Check internet status
   - `subscribe(callback)` - Listen to changes
   - `syncOfflineChanges()` - Sync when online
   - `queueChange()` - Queue offline change

2. `PreferencesManager`
   - `set(key, value)` - Save preference
   - `get(key)` - Read preference
   - `setTheme(theme)` - Set dark/light
   - `getUser()` - Get current user
   - `setLastLogin()` - Track login time

**Helper Functions:**
- `showToast(msg, type)` - Notifications
- `generateId()` - UUID generator
- `formatDate(date)` - Readable dates
- `formatTime(date)` - Readable times
- `getTodayString()` - Today's date
- `getDayName(day)` - Day of week
- `isToday(date)` - Is today check

**Globals:**
- `const offline = new OfflineManager()`
- `const preferences = new PreferencesManager()`

### utils/quotes.js (50+ lines)
**Motivational Quotes Database**

**Data:**
- 30+ motivational quotes
- Each with text and author
- Diverse topics and themes

**Class:**
- `QuoteManager`
  - `getRandomQuote()` - Get random quote
  - `loadRandomQuote()` - Load & cache quote

**Global:** `const quoteManager = new QuoteManager()`

---

### modules/auth.js (150+ lines)
**Authentication Management**

**Class:** `AuthManager`

**Methods:**
- `init()` - Initialize
- `signUp(email, password, name)` - Register
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `getCurrentUser()` - Get user
- `isAuthenticated()` - Check auth
- `subscribe(callback)` - Auth changes
- `makeAuthRequest()` - API calls

**Features:**
- Supabase integration (optional)
- Local authentication fallback
- User persistence
- Session management
- Auth event listeners

**Global:** `const auth = new AuthManager()`

### modules/ui.js (200+ lines)
**UI & Navigation Management**

**Class:** `UIManager`

**Methods:**
- `switchView(event)` - Change feature
- `showView(viewName)` - Show view
- `showScreen(screenId)` - Show screen
- `showMainApp()` - Show main interface
- `showAuthScreen()` - Show auth
- `showWelcome()` - Show welcome
- `openModal(modalId)` - Open dialog
- `closeModal(modal)` - Close dialog
- `updateUserDisplay()` - Show username
- `updateStatusBar()` - Online/offline
- `updateDate()` - Show today's date

**Features:**
- Screen transitions
- View management
- Modal handling
- Navigation control
- User display
- Status updates

**Global:** `const ui = new UIManager()`

### modules/subjects.js (200+ lines)
**Subject/Course Management**

**Class:** `SubjectsManager`

**Methods:**
- `loadSubjects()` - Load all subjects
- `openAddModal()` - Show add dialog
- `openEditModal(id)` - Show edit dialog
- `handleFormSubmit(e)` - Save subject
- `deleteSubject(id)` - Delete subject
- `render()` - Display subjects
- `getSubjectById(id)` - Get subject
- `getSubjectsByUser(userId)` - Get user's subjects

**Features:**
- CRUD operations
- Color coding
- Course codes
- Task linkage
- Full validation

**Global:** `const subjects = new SubjectsManager()`

### modules/tasks.js (300+ lines)
**Task/To-Do Management**

**Class:** `TasksManager`

**Methods:**
- `loadTasks()` - Load all tasks
- `openAddModal()` - Show add dialog
- `openEditModal(id)` - Show edit dialog
- `handleFormSubmit(e)` - Save task
- `deleteTask(id)` - Delete task
- `toggleTaskStatus(id)` - Mark complete
- `getFilteredTasks()` - Apply filters
- `render()` - Display tasks
- `renderTodayTasks()` - Today's preview
- `renderTaskItem()` - Single task

**Features:**
- Full CRUD
- Priority levels
- Status tracking
- Due dates
- Filtering
- Subject linking
- Today's preview

**Global:** `const tasks = new TasksManager()`

### modules/timetable.js (300+ lines)
**Timetable/Schedule Management**

**Class:** `TimetableManager`

**Methods:**
- `loadClasses()` - Load all classes
- `openAddModal()` - Show add dialog
- `openEditModal(id)` - Show edit dialog
- `handleFormSubmit(e)` - Save class
- `deleteClass(id)` - Delete class
- `getClassesByDay(day)` - Filter by day
- `render()` - Display timetable
- `renderClassCard()` - Single class
- `renderTimetablePreview()` - Today's preview

**Features:**
- Full CRUD
- Weekly view
- Day organization
- Time scheduling
- Location tracking
- Duration management

**Global:** `const timetable = new TimetableManager()`

### modules/pomodoro.js (250+ lines)
**Pomodoro Timer Management**

**Class:** `PomodoroManager`

**Methods:**
- `start()` - Start timer
- `pause()` - Pause timer
- `reset()` - Reset timer
- `completeSession()` - Mark session done
- `updateDisplay()` - Update UI
- `saveSession()` - Save stats
- `loadStats()` - Load stats
- `updateStats()` - Update display
- `requestNotificationPermission()` - Ask user

**Features:**
- 25-min work sessions
- 5-min break periods
- Session tracking
- Total focus time
- Notifications
- Stats persistence

**Global:** `const pomodoro = new PomodoroManager()`

### modules/calendar.js (150+ lines)
**Calendar Management**

**Class:** `CalendarManager`

**Methods:**
- `loadCalendar()` - Load calendar
- `render()` - Display month
- `generateCalendarDays()` - Create grid
- `updateTaskCounts()` - Show task counts

**Features:**
- Monthly view
- Navigation
- Task indicators
- Current day highlight
- Responsive grid

**Global:** `const calendar = new CalendarManager()`

### modules/vision.js (200+ lines)
**Vision Board Management**

**Class:** `VisionManager`

**Methods:**
- `loadGoals()` - Load goals
- `openAddModal()` - Show add dialog
- `openEditModal(id)` - Show edit dialog
- `handleFormSubmit(e)` - Save goal
- `deleteGoal(id)` - Delete goal
- `render()` - Display goals
- `renderGoalCard()` - Single goal

**Features:**
- Goal storage
- Inspirational quotes
- Card layout
- Full CRUD
- Color-coded cards

**Global:** `const vision = new VisionManager()`

### modules/settings.js (100+ lines)
**Settings Management**

**Class:** `SettingsManager`

**Methods:**
- `exportData()` - Export to JSON
- `resetData()` - Clear all data
- `importData(file)` - Import from JSON

**Features:**
- Data export
- Data import
- Complete reset
- Safety prompts

**Global:** `const settings = new SettingsManager()`

### app.js (200+ lines)
**Main Application Controller**

**Class:** `BrilliantCS`

**Methods:**
- `init()` - Initialize app
- `setupAuthFlow()` - Auth handling
- `showAuthScreen()` - Show auth UI
- `setupAuthListeners()` - Auth events
- `showWelcome()` - Show welcome
- `showMainApp(user)` - Show main UI
- `loadAllData()` - Load all data
- `setupQuoteRefresh()` - Quote handling
- `refreshQuote()` - Change quote

**Features:**
- Complete initialization
- Database setup
- Service worker registration
- Auth flow
- Data loading
- Event setup
- Error handling

**Global:** `let app = new BrilliantCS()`

---

## 📚 Documentation Files

### README.md (900+ lines)
**Complete Project Documentation**
- Features overview
- Design principles
- Getting started guide
- Project structure
- Feature walkthroughs
- Offline functionality
- PWA installation
- Customization guide
- Troubleshooting
- License & credits

### QUICKSTART.md (400+ lines)
**User Quick Start Guide**
- 5-minute setup
- Feature walkthroughs
- Step-by-step instructions
- Tips & tricks
- Offline mode guide
- Keyboard shortcuts
- Study tips
- FAQ section

### DEPLOYMENT.md (400+ lines)
**Deployment Instructions**
- GitHub Pages guide
- Netlify deployment
- Vercel deployment
- Firebase hosting
- Domain configuration
- Environment variables
- Performance optimization
- Security checklist
- Troubleshooting
- Monitoring

### PROJECT_SUMMARY.md (500+ lines)
**This File - Project Overview**
- What you've built
- File structure
- Features checklist
- Architecture overview
- Design system
- Technical stack
- Next steps
- Code statistics

---

## 🔍 File Statistics

| Category | Files | Lines | Size |
|----------|-------|-------|------|
| HTML/PWA | 3 | 600 | ~60KB |
| CSS | 6 | 1000 | ~50KB |
| JavaScript | 10 | 2500+ | ~100KB |
| Documentation | 4 | 2000+ | ~200KB |
| Config | 2 | 50 | ~5KB |
| **TOTAL** | **25** | **6000+** | **~415KB** |

---

## 🎯 File Purposes at a Glance

| File | Purpose | Priority |
|------|---------|----------|
| index.html | App shell | Critical |
| app.js | Initialization | Critical |
| service-worker.js | Offline | High |
| manifest.json | PWA | High |
| db.js | Data storage | Critical |
| auth.js | Authentication | High |
| ui.js | Navigation | High |
| subjects.js | Subjects | Medium |
| tasks.js | Tasks | Medium |
| timetable.js | Schedule | Medium |
| pomodoro.js | Timer | Medium |
| calendar.js | Calendar | Medium |
| vision.js | Goals | Medium |
| settings.js | Settings | Medium |
| offline.js | Offline utilities | High |
| quotes.js | Quote data | Low |
| theme.css | Colors | Critical |
| layout.css | Structure | Critical |
| components.css | Styling | Critical |
| responsive.css | Mobile | Critical |
| reset.css | Defaults | Low |
| animations.css | Effects | Low |
| README.md | Docs | Reference |
| QUICKSTART.md | User guide | Reference |
| DEPLOYMENT.md | Deployment | Reference |

---

## ✅ Modification Guide

### To Add a New Feature:
1. Create new file in `js/modules/`
2. Create class with methods
3. Add HTML in `index.html`
4. Add CSS in `css/components.css`
5. Initialize in `app.js`

### To Change Colors:
- Edit `css/theme.css`
- All variables in `:root` section
- Dark mode in `body.dark-mode`

### To Add Quotes:
- Edit `js/utils/quotes.js`
- Add to `quotes` array
- Format: `{ text: "...", author: "..." }`

### To Modify Storage:
- Edit `js/utils/db.js`
- Add stores in `onupgradeneeded`
- Update methods as needed

---

## 🚀 Deployment Checklist

- [ ] Read DEPLOYMENT.md
- [ ] Choose hosting platform
- [ ] Push files to repository
- [ ] Enable deployment
- [ ] Test all features
- [ ] Test offline mode
- [ ] Install as PWA
- [ ] Share link

---

## 📞 File Reference

Quick lookup for where to find things:

**Colors?** → `css/theme.css`
**Layout?** → `css/layout.css`
**UI Components?** → `css/components.css`
**Authentication?** → `js/modules/auth.js`
**Navigation?** → `js/modules/ui.js`
**Database?** → `js/utils/db.js`
**Offline?** → `js/utils/offline.js`
**Tasks?** → `js/modules/tasks.js`
**Subjects?** → `js/modules/subjects.js`
**Timetable?** → `js/modules/timetable.js`
**Timer?** → `js/modules/pomodoro.js`
**Calendar?** → `js/modules/calendar.js`
**Goals?** → `js/modules/vision.js`
**Settings?** → `js/modules/settings.js`
**Quotes?** → `js/utils/quotes.js`
**PWA Setup?** → `manifest.json` & `service-worker.js`
**HTML Structure?** → `index.html`
**Documentation?** → `README.md`, `QUICKSTART.md`, `DEPLOYMENT.md`

---

**Everything you need to know about the Brilliant CS project!** ✨

Last Updated: December 2025

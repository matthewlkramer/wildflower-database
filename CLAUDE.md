# Wildflower Database - AI Assistant Context

## Project Overview
The Wildflower Database is a comprehensive management system for the Wildflower Schools network - a decentralized network of small, teacher-led Montessori schools. It helps administrators track and manage schools, educators, and their relationships over time.

## Technology Stack
- **Frontend**: React 19.1.0 with Vite 5.4.11
- **Backend**: Airtable (as a database service)
- **Styling**: Tailwind CSS utilities (using cyan color scheme)
- **Icons**: Lucide React
- **Deployment**: Vercel
- **State Management**: React Hooks with custom caching layer

## Key Features
1. **Multi-entity Management**: Schools, Educators, and Charters
2. **Advanced Filtering**: Real-time search, column filters, status toggles
3. **Rich Data Relationships**: Many-to-many relationships with time bounds
4. **Performance Optimized**: 5-minute in-memory cache, lazy loading
5. **Detailed Information Tracking**: Demographics, certifications, funding, notes

## Architecture

### Component Structure
```
src/components/
├── WildflowerDatabase.jsx    # Main app component
├── schools/                   # School components
├── educators/                 # Educator components
├── charters/                  # Charter components
├── modals/                    # Modal dialogs
└── shared/                    # Reusable components
```

### Data Flow
1. **AirtableService** → API calls with rate limiting
2. **DataCache** → 5-minute in-memory caching
3. **Custom Hooks** → `useCachedData`, `useUnifiedData`
4. **Data Transformers** → Normalize Airtable fields
5. **Components** → Display transformed data

### Key Hooks
- `useUnifiedData`: Central data fetching
- `useCachedData`: Manages cache retrieval
- `useFilters`: Search and filter state
- `useNavigation`: View state management

## Important Implementation Details

### Airtable Integration
- All data comes from Airtable via REST API
- Tables use formula fields (e.g., `educator_id`, `school_id`) for relationships
- When filtering linked records, use the formula field NOT the linked field:
  ```javascript
  // CORRECT: Use formula field
  records.filter(r => r.educator_id === educatorId)
  
  // WRONG: Don't use linked field
  records.filter(r => r.Educator === educatorId)
  ```

### Color Scheme
- Primary action buttons: `bg-teal-600 hover:bg-teal-700`
- Links: `text-teal-600`
- Active states: `bg-teal-100 text-teal-700`
- Borders: `border-teal-500`

### Recent Updates
1. Header redesigned to show "Wildflower" with entity name as subtitle
2. Tabs (Schools, Educators, Charters) are permanently visible
3. All educator detail tabs now show linked Airtable data
4. Consistent teal color scheme throughout

## Data Model

### Core Tables
- **Schools**: School profiles with status, locations, governance
- **Educators**: Personal info, demographics, contact details
- **Educators x Schools**: Junction table for relationships

### Supporting Tables
- Locations, School Notes, Educator Notes
- Action Steps, Governance Documents
- Grants, Loans, Membership Fees
- Guide Assignments, Montessori Certifications
- Event Attendance, Email Addresses
- SSJ Fillout Forms

### Key Fields to Remember
- Schools: `name`, `shortName`, `status`, `membershipStatus`
- Educators: `fullName`, `firstName`, `lastName`, `email`
- Relationships: Always filtered by formula fields (`educator_id`, `school_id`)

## Common Tasks

### Adding a New Tab
1. Add constant to `EDUCATOR_TABS` or `SCHOOL_TABS` in constants.js
2. Add case to `renderTabContent()` in detail component
3. Create render function for tab content
4. Add data hook if needed

### Adding a New Field
1. Update transformer in `dataTransformers.js`
2. Add field to component display
3. Check Airtable field name matches exactly

### Debugging Data Issues
1. Check if formula fields exist in Airtable
2. Verify field names match exactly (case-sensitive)
3. Check cache isn't stale (5-minute timeout)
4. Ensure hooks are called with correct IDs

## Environment Variables
```
VITE_AIRTABLE_BASE_ID=your_base_id
VITE_AIRTABLE_API_KEY=your_api_key
```

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Known Issues & Solutions
1. **Buttons not showing**: Use `cyan` instead of `teal` (Tailwind config)
2. **Data not loading**: Check formula fields and exact field names
3. **Performance**: Cache timeout is 5 minutes, may need manual refresh

## Future Enhancements
- Write operations (currently read-only)
- Authentication/authorization
- Offline capabilities
- TypeScript migration
- Advanced reporting features

---
*This file helps AI assistants understand the project context after a conversation reset.*
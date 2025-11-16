# Theme & Events Feature Guide

## Dark/Light Theme Toggle

### Overview
Users can now switch between light and dark themes throughout the application. The theme preference is saved in localStorage and persists across sessions.

### Features
- **Theme Toggle Button**: Located in the header next to language and currency switchers
- **Automatic Detection**: Respects system preference on first visit
- **Persistent Storage**: Theme choice is saved and remembered
- **Smooth Transitions**: CSS transitions for seamless theme changes
- **Mobile Support**: Theme toggle accessible in mobile menu

### Implementation Details

#### Theme Provider
- Location: `balkly-web/src/components/ThemeProvider.tsx`
- Context-based implementation for global theme state
- Handles localStorage and system preference detection

#### Theme Toggle Component
- Location: `balkly-web/src/components/ThemeToggle.tsx`
- Simple moon/sun icon toggle button
- Integrated in header (desktop and mobile)

#### CSS Variables
- Location: `balkly-web/src/app/globals.css`
- Dark mode styles defined with `.dark` class
- HSL color values for consistent theming

### Usage
1. Click the moon/sun icon in the header to toggle themes
2. Theme automatically applies to all pages
3. Preference is saved and persists across sessions

---

## Events & Experiences Integration

### Overview
The events system now integrates with Platinumlist.net to display both local Balkly events and partner affiliate events.

### Affiliate Partnership
- **Partner**: Platinumlist.net
- **Referral Link**: `https://platinumlist.net/aff/?ref=zjblytn&link=`
- **Affiliate Ref**: `zjblytn`

### Event Types

#### 1. Own Events (Balkly Tickets)
- Created and managed directly in Balkly
- Tickets sold through Balkly platform
- Full control over pricing and capacity
- Direct revenue to Balkly

#### 2. Affiliate Events (Partner Events)
- Sourced from Platinumlist.net
- Displayed with "FEATURED" badge
- Users redirected to partner site for ticket purchase
- Affiliate commission earned on each referral

### Features

#### Events List Page (`/events`)
- Grid view of all events (own + affiliate)
- Filter by event type (Own/Affiliate)
- Filter by city
- Calendar view available
- Visual badges to distinguish event types

#### Event Detail Page (`/events/[id]`)
- Full event information
- For Own Events:
  - Ticket selection with quantity controls
  - Price calculation with fees
  - Direct checkout through Balkly
- For Affiliate Events:
  - Partner event badge
  - Price preview (if available)
  - "Get Tickets" button with affiliate link
  - Click tracking for analytics
  - Opens in new tab

### Implementation Details

#### Platinumlist Integration
- Location: `balkly-web/src/lib/platinumlist.ts`
- Mock data for 6 featured events (until API is available)
- Affiliate link generation
- Click tracking for analytics
- Event format conversion

#### API Integration
- Location: `balkly-web/src/lib/api.ts`
- Merges local and affiliate events
- Handles both event types seamlessly
- Sorts events by date

#### Backend Support
- Location: `balkly-api/app/Http/Controllers/Api/EventController.php`
- Validation for affiliate events
- Support for `partner_url`, `partner_ref`, and `image_url`
- Event creation and management

### Sample Events
The integration currently includes 6 mock Platinumlist events:
1. **Dubai Jazz Festival 2025** - Music event at Dubai Media City
2. **Abu Dhabi Food Festival** - Culinary celebration at Yas Island
3. **Sharjah Light Festival** - Light and art show (Free entry)
4. **Dubai Comedy Night** - International comedy stars
5. **Emirates Stadium Tour & Museum** - Sports venue experience
6. **Balkan Night Dubai** - Cultural celebration at Madinat Jumeirah

### Analytics & Tracking
- Affiliate clicks are tracked via Google Analytics (if configured)
- Event tracking: `affiliate_click` event with event_label and value
- Console logging for debugging

### Future Enhancements
1. **Real API Integration**: Replace mock data with actual Platinumlist API
2. **Dynamic Filtering**: Add more filter options (date range, price range, category)
3. **Revenue Dashboard**: Track affiliate earnings and conversions
4. **Event Categories**: Organize events by type (Music, Sports, Cultural, etc.)
5. **Favorites**: Allow users to save favorite events
6. **Calendar Sync**: Export events to Google Calendar, iCal

---

## How to Add New Affiliate Events

### Option 1: Manual Creation (Current)
Edit `balkly-web/src/lib/platinumlist.ts` and add to `MOCK_PLATINUMLIST_EVENTS` array:

```typescript
{
  id: 'pl-7',
  title: 'Event Name',
  description: 'Event description',
  image_url: 'https://example.com/image.jpg',
  venue: 'Venue Name',
  city: 'Dubai',
  country: 'AE',
  start_date: '2025-12-01T19:00:00Z',
  end_date: '2025-12-01T23:00:00Z',
  category: 'Category',
  url: 'https://platinumlist.net/events/event-slug',
  price: {
    min: 100,
    max: 300,
    currency: 'AED',
  },
}
```

### Option 2: Via Platinumlist API (Future)
Once the Platinumlist API is available, update the `fetchPlatinumListEvents` function to fetch real data:

```typescript
export async function fetchPlatinumListEvents(filters?: any): Promise<BalklyEvent[]> {
  const response = await fetch('https://api.platinumlist.net/events', {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  });
  const events = await response.json();
  return events.map(convertPlatinumListEvent);
}
```

---

## Testing

### Theme Toggle
1. Visit any page on the site
2. Click the moon icon in the header
3. Verify the theme changes to dark mode
4. Refresh the page - theme should persist
5. Click the sun icon to return to light mode

### Events Integration
1. Visit `/events`
2. Verify both local and affiliate events are displayed
3. Check that affiliate events have "FEATURED" badge
4. Click on an affiliate event
5. Verify the event detail page shows partner information
6. Click "Get Tickets" button
7. Verify it opens Platinumlist in a new tab with affiliate link

### Affiliate Link Format
The generated link should look like:
```
https://platinumlist.net/aff/?ref=zjblytn&link=https%3A%2F%2Fplatinumlist.net%2Fevents%2Fevent-slug
```

---

## Configuration

### Environment Variables
No additional environment variables required for current implementation.

### API Keys (Future)
When Platinumlist API becomes available:
```env
NEXT_PUBLIC_PLATINUMLIST_API_KEY=your_api_key_here
NEXT_PUBLIC_AFFILIATE_REF=zjblytn
```

---

## Support & Maintenance

### Theme Issues
- If theme doesn't persist: Check browser localStorage
- If styles look wrong: Clear browser cache and reload
- Mobile theme issues: Check mobile menu implementation

### Events Issues
- Events not loading: Check browser console for errors
- Affiliate link not working: Verify URL encoding in platinumlist.ts
- Missing events: Check API response and data merging in api.ts

### Contact
For technical support or questions, refer to the main documentation index at `docu/INDEX.md`.


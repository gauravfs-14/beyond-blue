# API Integration Documentation

## Overview

The frontend has been updated to integrate with the new API endpoints for planet filtering and search functionality.

## API Endpoints

The following endpoints are now supported:

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `/ping` | Health check | None |
| `/planets/:id` | Get specific planet | `id` - Planet ID |
| `/confirmed` | Get confirmed planets | `limit`, `skip` |
| `/false_positive` | Get false positive planets | `limit`, `skip` |
| `/candidate` | Get candidate planets | `limit`, `skip` |
| `/search` | Search planets | `pl_name`, `hostname`, `discoverymethod`, `disc_year`, `limit`, `skip` |
| `/summary/:id` | Get planet summary | `id` - Planet ID |
| `/stream-summary/:id` | Get planet summary (streaming) | `id` - Planet ID |

## Environment Configuration

Set the following environment variable in your `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, update this to your actual API URL.

## New Features

### 1. Disposition Filtering

- **Confirmed planets**: Shows only confirmed exoplanets
- **Candidate planets**: Shows only candidate exoplanets  
- **False positive planets**: Shows only false positive planets
- **All planets**: Shows all planets (default)

### 2. Enhanced Search

- Search by planet name (`pl_name`)
- Search by host star name (`hostname`)
- Real-time search with API integration

### 3. Pagination Controls

- Configurable results per page (25, 50, 100, 200)
- API-based pagination using `limit` and `skip` parameters
- Loading states during pagination

### 4. API Service Layer

- Centralized API service functions in `src/lib/utils/api-service.ts`
- Error handling and loading states
- Type-safe API responses

## Implementation Details

### FilterOptions Type

Updated to support new API-based filters:

```typescript
interface FilterOptions {
  // API-based filters
  disposition?: "confirmed" | "false_positive" | "candidate";
  search?: string;
  limit?: number;
  skip?: number;
  
  // Legacy client-side filters (for backward compatibility)
  discoverymethod?: string[];
  disc_year?: { min?: number; max?: number };
  pl_rade?: { min?: number; max?: number };
  pl_bmasse?: { min?: number; max?: number };
  habitableZone?: string[];
}
```

### API Service Functions

- `fetchPlanetsByDisposition()` - Fetch planets by disposition
- `searchPlanets()` - Search planets with multiple criteria
- `fetchPlanetById()` - Get specific planet
- `fetchPlanetSummary()` - Get planet summary
- `fetchPlanetsWithFilters()` - Main function for filtered planet fetching

## Usage

The filters are automatically applied when:

1. User selects a disposition filter (confirmed/candidate/false_positive)
2. User enters a search term
3. User changes pagination settings

The system falls back to client-side filtering for legacy filters (discovery method, year range, etc.) when API-based filters are not active.

## Error Handling

- Loading states during API calls
- Error messages for failed requests
- Retry functionality for failed requests
- Graceful fallback to client-side filtering

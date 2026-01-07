# Credential Schema Builder

A monorepo web application for creating and validating credential schemas for verifiable credentials using KERI (Key Event Receipt Infrastructure) and ACDC (Authentic Chained Data Container) standards.

## Architecture

This project is structured as a monorepo with three main packages:

- **`frontend/`** - Next.js React application (exported as static files)
- **`backend/`** - Express.js API server that serves the frontend and provides API endpoints
- **`shared/`** - Shared TypeScript types and schema building logic

### Project Structure

```
credential-schema-builder/
├── frontend/          # Next.js app (static export)
│   ├── src/
│   │   ├── app/       # Next.js app router
│   │   ├── components/ # React components
│   │   └── lib/       # Frontend utilities
│   └── package.json
├── backend/           # Express API server
│   ├── src/
│   │   └── index.ts   # Express server & API routes
│   └── package.json
├── shared/            # Shared code
│   ├── src/
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── schema-builder.ts  # Schema building logic
│   │   └── index.ts           # Package exports
│   └── package.json
└── package.json       # Root workspace config
```

## Features

- **Interactive Schema Builder**: Create credential schemas with a user-friendly interface
- **RESTful API**: Backend API that can be used by external services
- **SAID Calculation**: Automatically calculates Self-Addressing Identifiers (SAIDs) using `signify-ts`
- **Attribute Management**: Add, edit, and remove custom attributes with type validation
- **JSON Schema Generation**: Generates JSON Schema Draft 07 compliant schemas
- **Schema Validation**: Validates schemas before SAID calculation
- **Export**: Download generated schemas as JSON files

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

Install all dependencies for all workspaces:

```bash
npm install
```

This will install dependencies for:

- Root workspace
- Frontend package
- Backend package
- Shared package

### Development

#### Run Backend (serves frontend + API)

The backend serves the frontend at `/web` and provides API endpoints at `/api`:

```bash
npm run dev
# or
npm run dev:backend
```

This starts the Express server on `http://localhost:3001`:

- Frontend: `http://localhost:3001/web`
- API: `http://localhost:3001/api`

#### Run Frontend Only (development mode)

To run the frontend in Next.js dev mode (with hot reload):

```bash
npm run dev:frontend
```

This starts Next.js dev server on `http://localhost:3000`

**Note**: In dev mode, you'll need to set `NEXT_PUBLIC_API_URL=http://localhost:3001` in your environment or update the API URL in the frontend code.

### Build

Build all packages:

```bash
npm run build
```

Or build individually:

```bash
# Build shared package first (required for other packages)
npm run build:shared

# Build frontend (static export)
npm run build:frontend

# Build backend
npm run build:backend
```

### Production

1. Build all packages:

   ```bash
   npm run build
   ```

2. Start the backend server:
   ```bash
   npm start
   ```

The backend will:

- Serve the static frontend at `http://localhost:3001/web`
- Provide API endpoints at `http://localhost:3001/api`

## API Endpoints

### `POST /api/schemas`

Create a new credential schema and calculate its SAID.

**Request Body:**

```json
{
  "title": "Rare EVO 2024 Attendee",
  "description": "Credential for event attendees",
  "credentialType": "RareEvo2024AttendeeCredential",
  "version": "1.0.0",
  "attributes": [
    {
      "name": "attendeeName",
      "type": "string",
      "description": "The name of the attendee",
      "required": true
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "schema": {
      /* JSON Schema object */
    },
    "said": "EKm7Acf8opkU5bfUcO-8wu29z64rld_Kvqe8K9y-i3wI",
    "attributesSaid": "E..."
  }
}
```

### `GET /api/health`

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Usage

1. **Enter Schema Metadata**:

   - Title (required)
   - Credential Type (required)
   - Version (default: 1.0.0)
   - Description (optional)

2. **Add Attributes**:

   - Click "Add Attribute" to add custom attributes
   - Set attribute name, type (string, number, boolean, array, object)
   - Add description and mark as required if needed

3. **Calculate SAID**:

   - Click "Calculate SAID" to generate the schema SAID
   - The frontend calls the backend API which validates and calculates the SAID

4. **Download Schema**:
   - Once SAID is calculated, download the schema as JSON

## Technical Details

### SAID Calculation

The tool uses `signify-ts` library to calculate SAIDs:

- Uses `$id` field directly with the label parameter (not `d` field)
- Calculates SAID for both the attributes block and the top-level schema
- Uses Blake3_256 hashing algorithm with JSON serialization

### Schema Structure

The generated schemas follow JSON Schema Draft 07 and include:

- Standard credential fields: `v`, `d`, `u`, `i`, `ri`, `s`, `a`
- Attributes block (`a` property) includes:
  - `i`: Issuee AID (required)
  - `dt`: Issuance date time (required)
  - Custom attributes defined by the user
- Proper `$id` field for schema identification

### Monorepo Workspaces

This project uses npm workspaces to manage the monorepo:

- All packages share the same `node_modules` at the root
- Shared package can be imported by both frontend and backend
- Workspace scripts allow running commands across packages

## Technologies

- **Next.js 16** - React framework (frontend)
- **Express.js** - Node.js web framework (backend)
- **TypeScript** - Type safety across all packages
- **signify-ts** - KERI/ACDC implementation
- **Monaco Editor** - Code editor for schema preview
- **Radix UI** - UI components
- **Tailwind CSS** - Styling
- **npm workspaces** - Monorepo management

## Development Workflow

1. Make changes to shared code → Build shared package
2. Make changes to frontend → Frontend automatically uses shared package
3. Make changes to backend → Backend automatically uses shared package
4. Test locally → Run `npm run dev` to start backend with frontend
5. Build for production → Run `npm run build` then `npm start`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

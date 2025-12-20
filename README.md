# Credential Schema Builder

A web-based tool for creating and validating credential schemas for verifiable credentials using KERI (Key Event Receipt Infrastructure) and ACDC (Authentic Chained Data Container) standards.

## Features

- **Interactive Schema Builder**: Create credential schemas with a user-friendly interface
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

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Build

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Start Production Server

```bash
npm start
# or
yarn start
# or
pnpm start
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
   - The schema will be validated and the SAID will be calculated using `$id` field

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
  - `d`: Attributes block SAID (automatically calculated)
  - `i`: Issuee AID (required)
  - `dt`: Issuance date time (required)
  - Custom attributes defined by the user
- Proper `$id` field for schema identification

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **signify-ts** - KERI/ACDC implementation
- **Monaco Editor** - Code editor for schema preview
- **Radix UI** - UI components
- **Tailwind CSS** - Styling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

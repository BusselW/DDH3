# DDH3 - Digitale Handhaving Portal

## Overview
DDH3 is a SharePoint Client-Side Application designed to manage and visualize enforcement locations ("Digitale Handhaving") and their associated problems ("Problemen pleeglocaties"). The application provides a dashboard interface for viewing, filtering, and managing these records directly within a SharePoint 2019 On-Premises environment.

The application is built using **React** (without a build step) and **ES Modules**, making it lightweight and easy to deploy by simply uploading files to a SharePoint library.

## Architecture
*   **Framework**: React (via `window.React` / UMD), no JSX compilation required.
*   **Language**: Modern JavaScript (ES6 Modules).
*   **Data Layer**: SharePoint REST API (`/_api/web/lists/...`).
*   **Environment**: SharePoint 2019 On-Premises.

## SharePoint Lists
The application interacts with the following SharePoint lists (defined in `js/config/lijsten.js`):

### 1. Problemen pleeglocaties
*   **Purpose**: Tracks reported problems at specific enforcement locations.
*   **Key Fields**:
    *   `Title` (Pleeglocatie)
    *   `Gemeente`
    *   `Feitcodegroep` (Choice: Verkeersborden, Parkeren, Rijgedrag)
    *   `Opgelost_x003f_` (Status: Aangemeld, In behandeling, Uitgezet bij OI, Opgelost)
    *   `Probleembeschrijving` (Note)
    *   `Actie_x0020_Beoordelaars` (Choice)
    *   `Beoordelaar` (UserMulti)
    *   `Eigenaar` (User)

### 2. Digitale handhaving
*   **Purpose**: Main registry of enforcement locations and their metadata.
*   **Key Fields**:
    *   `Title` (Locatie/Titel)
    *   `Gemeente`
    *   `Feitcodegroep`
    *   `Status_x0020_B_x0026_S` (Status B&S)
    *   `Waarschuwing` (Boolean)
    *   `Contactpersoon` (User)
    *   `Laatste_x0020_schouw` (DateTime)
    *   `Link_x0020_Algemeen_x0020_PV` (URL)

### Data Relationships
The application links items between the two lists using a calculated key strategy:
*   **Relationship**: One-to-Many (1 Location -> N Problems)
*   **Linking Logic**:
    *   **Digitale handhaving** (Parent): Uses a calculated field `gemeenteID` (derived from `Gemeente` + `Title`).
    *   **Problemen pleeglocaties** (Child): Uses a text field `ProbleemID`.
    *   The application matches these keys to display problems nested under their respective locations.

## Project Structure

```
/
├── Portal-Design2-Tree.aspx  # Standalone entry point (Tree View Portal)
├── css/                      # Stylesheets
│   ├── ddh.css              # Base styles
│   └── ddh-dashboard.css    # Dashboard-specific styles
├── js/                       # Application Logic
│   ├── app.js               # Main application class (DDHApp)
│   ├── index.js             # Entry point for initialization
│   ├── DashboardApp.js      # Dashboard component logic
│   ├── components/          # UI Components (React)
│   │   ├── dashboard.js     # Main dashboard view
│   │   ├── forms.js         # Form components
│   │   ├── icons.js         # Icon definitions
│   │   └── ...
│   ├── config/              # Configuration
│   │   ├── lijsten.js       # SharePoint List definitions & API endpoints
│   │   ├── mockConfig.js    # Mock data configuration
│   │   └── ...
│   └── services/            # Data Services
│       ├── ddhDataService.js # Real SharePoint API service
│       └── mockDataService.js # Local development mock service
```

## How It Works

1.  **Initialization**:
    *   The application starts via `js/app.js` or `js/index.js`.
    *   It detects the environment. If running on `localhost`, it switches to `mockDataService.js` for testing. If on SharePoint, it uses `ddhDataService.js`.
2.  **Data Fetching**:
    *   `ddhDataService.js` uses the configuration from `lijsten.js` to construct REST API calls.
    *   It fetches items from "Digitale handhaving" and "Problemen pleeglocaties".
3.  **Rendering**:
    *   React components (using `h` / `createElement`) render the UI.
    *   `Portal-Design2-Tree.aspx` renders a specific tree-view visualization of locations and their problems.

## Deployment
1.  Upload the entire folder structure (`css`, `js`, and `.aspx` files) to a SharePoint Document Library (e.g., `SiteAssets`).
2.  Navigate to `Portal-Design2-Tree.aspx` in the browser to view the application.
    *   *Note: Ensure the paths in the `.aspx` file point correctly to the uploaded `js` and `css` files relative to the library.*

## Local Development
To run the project locally:
1.  Serve the root directory using a simple HTTP server (e.g., `http-server`, `live-server`, or VS Code Live Server).
2.  Open `Portal-Design2-Tree.aspx` (or the relevant HTML entry point).
3.  The application will detect `localhost` and automatically use **Mock Data**, allowing you to develop without a SharePoint connection.

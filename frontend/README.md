# Frontend README

# Yolandita Dashboard

React-based frontend for the Yolandita security monitoring system.

## Features

- 📊 Real-time analytics dashboard
- 🎥 Live video stream display
- 📈 ROI metrics visualization
- 🗺️ Risk heatmaps
- 🚨 Alert notifications
- 📱 Responsive design

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Access at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/      # Reusable React components
├── pages/          # Page-level components
├── services/       # API integration
├── App.jsx        # Root component
├── main.jsx       # Entry point
└── index.css      # Global styles
```

## Components to Implement

- [ ] Dashboard.jsx
- [ ] VideoFeed.jsx
- [ ] AlertNotification.jsx
- [ ] MetricsChart.jsx
- [ ] HeatmapViewer.jsx
- [ ] IncidentList.jsx
- [ ] ROICalculator.jsx
- [ ] CameraManager.jsx

## API Integration

The frontend communicates with the backend via REST API.

See `src/services/api.js` for all available endpoints.

**Example:**

```javascript
import { getRoiMetrics } from './services/api';

const roiData = await getRoiMetrics('STORE-001', 30);
```

## Styling

- **Framework**: Tailwind CSS
- **Colors**: Dark theme optimized for surveillance
- **Responsive**: Mobile-first design

## Testing

```bash
npm run test
```

## Deployment

Build and deploy to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Custom server

See root README for full deployment guide.

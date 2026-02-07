# CardSpotlight Component Integration - Complete Guide

## ✅ What Was Installed

### 1. File Structure Created
```
frontend/src/
├── lib/
│   └── utils.js                         # Tailwind merge utility (cn function)
├── components/
│   ├── ui/
│   │   ├── canvas-reveal-effect.jsx    # WebGL animation effect
│   │   └── card-spotlight.jsx          # Main spotlight card component
│   ├── CriticalRegionCard.jsx          # DSS-themed critical region card
│   └── GovernanceAlertCard.jsx         # DSS-themed governance alert card
```

### 2. Dependencies Installed
```json
{
  "framer-motion": "^latest",    // Animation library
  "three": "^latest",            // 3D graphics library
  "@react-three/fiber": "^latest", // React renderer for Three.js
  "clsx": "^latest",             // Conditional classnames
  "tailwind-merge": "^latest"    // Merge Tailwind classes
}
```

### 3. Configuration Changes
- **vite.config.js**: Added path alias `@` pointing to `./src`
- Allows imports like: `import { cn } from "@/lib/utils"`

---

## 🎨 Component Overview

### CardSpotlight (Base Component)
An interactive card with a spotlight effect that follows your mouse cursor and reveals an animated particle effect on hover.

**Features:**
- Mouse-tracking spotlight effect
- WebGL particle animation on hover
- Customizable colors and radius
- Full Tailwind CSS support

**Props:**
```javascript
{
  children: React.ReactNode,    // Card content
  radius: number,               // Spotlight radius (default: 350px)
  color: string,                // Spotlight color (default: "#262626")
  className: string,            // Additional Tailwind classes
  ...HTMLDivAttributes          // All standard div props
}
```

### CriticalRegionCard (DSS-Themed)
Specialized card for displaying critical disaster regions with the spotlight effect.

**Props:**
```javascript
{
  region: string,        // Region name (e.g., "Region Alpha")
  riskLevel: string,     // 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  riskScore: number,     // Risk score (0.0 - 1.0)
  confidence: number     // Confidence level (0.0 - 1.0)
}
```

### GovernanceAlertCard (DSS-Themed)
Card for displaying governance alerts and escalations with spotlight effect.

**Props:**
```javascript
{
  title: string,         // Alert title
  message: string,       // Alert description
  status: string,        // 'ESCALATE' | 'PROCEED'
  rules: string[]        // Array of triggered rule descriptions
}
```

---

## 🚀 Usage Examples

### Basic CardSpotlight Usage
```jsx
import { CardSpotlight } from "@/components/ui/card-spotlight";

function MyComponent() {
  return (
    <CardSpotlight 
      radius={400}
      color="#7A3B3B"
      className="h-96 w-96"
    >
      <h2 className="text-xl font-bold text-white">
        Your Content Here
      </h2>
      <p className="text-gray-300 mt-4">
        The spotlight will follow your mouse cursor
      </p>
    </CardSpotlight>
  );
}
```

### Using CriticalRegionCard in Dashboard
```jsx
import { CriticalRegionCard } from '@/components/CriticalRegionCard';

function Dashboard() {
  const criticalRegions = assessments.filter(a => a.risk_level === 'CRITICAL');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {criticalRegions.map(region => (
        <CriticalRegionCard
          key={region.region}
          region={region.region}
          riskLevel={region.risk_level}
          riskScore={region.risk_score}
          confidence={region.confidence}
        />
      ))}
    </div>
  );
}
```

### Using GovernanceAlertCard
```jsx
import { GovernanceAlertCard } from '@/components/GovernanceAlertCard';

function GovernancePanel() {
  return (
    <GovernanceAlertCard
      title="Critical Decision Required"
      message="Region Alpha requires immediate evacuation approval"
      status="ESCALATE"
      rules={[
        'High risk level with moderate confidence',
        'Critical infrastructure affected',
        'Human oversight mandatory'
      ]}
    />
  );
}
```

---

## 🔧 Integration Into Your DSS App

### Option 1: Enhanced Dashboard with Critical Alerts Section
**File:** `frontend/src/components/SituationalDashboard.jsx`

```jsx
import { CriticalRegionCard } from './CriticalRegionCard'

export default function SituationalDashboard() {
  // ... your existing code

  return (
    <div>
      {/* Add Critical Alerts Section */}
      {assessments.some(a => a.risk_level === 'CRITICAL') && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-textPrimary mb-4 uppercase tracking-wide">
            ⚠️ Critical Situations Requiring Immediate Attention
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assessments
              .filter(a => a.risk_level === 'CRITICAL')
              .map(assessment => (
                <CriticalRegionCard
                  key={assessment.region}
                  region={assessment.region}
                  riskLevel={assessment.risk_level}
                  riskScore={assessment.risk_score}
                  confidence={assessment.confidence}
                />
              ))
            }
          </div>
        </div>
      )}

      {/* Your existing grid of all regions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ... existing code */}
      </div>
    </div>
  );
}
```

### Option 2: Governance Panel with Alert Cards
**File:** `frontend/src/components/GovernancePanel.jsx`

```jsx
import { GovernanceAlertCard } from './GovernanceAlertCard'

export default function GovernancePanel() {
  // ... your existing code

  return (
    <div>
      {/* Add before summary cards */}
      {status.some(s => s.governance_status === 'ESCALATE') && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">
            🛡️ Governance Escalations
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {status
              .filter(s => s.governance_status === 'ESCALATE')
              .map((item, idx) => (
                <GovernanceAlertCard
                  key={idx}
                  title="Critical Decision Required"
                  message={item.reason}
                  status={item.governance_status}
                  rules={[
                    'High risk level detected',
                    'Human oversight mandatory',
                    'Approval required before proceeding'
                  ]}
                />
              ))
            }
          </div>
        </div>
      )}

      {/* Your existing content */}
    </div>
  );
}
```

---

## 🎯 Best Practices & Recommendations

### When to Use CardSpotlight

✅ **Good Use Cases:**
- Highlighting critical/high-priority information
- Drawing attention to items requiring urgent action
- Creating visual hierarchy for important data
- Interactive dashboards and status displays

❌ **Avoid:**
- Forms or input fields (can be distracting)
- Dense information grids (performance impact)
- Mobile-only displays (hover effect requires mouse)

### Performance Considerations

1. **Limit instances**: WebGL rendering is intensive. Use 2-4 spotlight cards max per view.
2. **Conditional rendering**: Only show for critical items, not every card.
3. **Mobile**: Consider disabling effect on mobile devices:
   ```jsx
   const isMobile = window.innerWidth < 768;
   
   {isMobile ? (
     <div className="border bg-panel p-6">{content}</div>
   ) : (
     <CardSpotlight>{content}</CardSpotlight>
   )}
   ```

### Customization Tips

**Theme Integration:**
```jsx
// Use your existing DSS color scheme
<CardSpotlight color="#7A3B3B">  {/* riskHigh */}
<CardSpotlight color="#8A6A2F">  {/* riskMedium */}
<CardSpotlight color="#64748B">  {/* accent */}
```

**Sizing:**
```jsx
// Adjust radius based on card size
<CardSpotlight radius={300} className="w-80">    {/* Small card */}
<CardSpotlight radius={500} className="w-full">  {/* Large card */}
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module @/lib/utils"
**Solution:** Make sure you restarted your dev server after updating vite.config.js
```bash
# Stop server (Ctrl+C) then restart:
npm run dev
```

### Issue: WebGL/Canvas errors
**Solution:** The canvas-reveal-effect requires WebGL support. Check browser compatibility.
```javascript
// Add error boundary in production
try {
  return <CardSpotlight>{content}</CardSpotlight>
} catch (error) {
  console.error('WebGL not supported:', error);
  return <div className="border bg-panel p-6">{content}</div>
}
```

### Issue: Spotlight not appearing
**Solution:** Ensure parent container allows overflow:
```jsx
// Don't use overflow-hidden on parent
<div className="relative"> {/* ✅ Good */}
  <CardSpotlight>...</CardSpotlight>
</div>

<div className="overflow-hidden"> {/* ❌ Hides spotlight */}
  <CardSpotlight>...</CardSpotlight>
</div>
```

### Issue: Performance lag with multiple cards
**Solution:** Reduce animation speed or limit instances:
```jsx
// In canvas-reveal-effect.jsx, reduce animationSpeed:
<CanvasRevealEffect animationSpeed={3} />  // Lower = better performance
```

---

## 📋 Testing Checklist

- [ ] Restart dev server after configuration changes
- [ ] Test spotlight follows mouse cursor
- [ ] Verify particle animation appears on hover
- [ ] Check responsiveness on different screen sizes
- [ ] Confirm colors match your DSS theme
- [ ] Test with data from "Load Flood Scenario" button
- [ ] Verify performance with multiple cards
- [ ] Check browser console for errors

---

## 🎓 Understanding the Components

### How It Works

1. **Mouse Tracking**: `useMotionValue` from framer-motion tracks cursor position
2. **Spotlight Effect**: CSS `mask-image` with radial gradient follows cursor
3. **Particle Animation**: Three.js + WebGL renders animated dot matrix
4. **Conditional Reveal**: Particles only render when hovering (`isHovering` state)

### Key Technologies

- **Framer Motion**: Smooth animations and motion values
- **Three.js**: 3D graphics rendering
- **React Three Fiber**: React bindings for Three.js
- **WebGL Shaders**: Custom GLSL shaders for particle effects

---

## 📚 Further Customization

### Modify Particle Colors
Edit `card-spotlight.jsx`:
```jsx
<CanvasRevealEffect
  colors={[
    [100, 150, 200],  // Light blue RGB
    [150, 100, 200],  // Purple RGB
  ]}
/>
```

### Adjust Animation Speed
```jsx
<CanvasRevealEffect
  animationSpeed={5}  // 1-10, higher = faster
/>
```

### Change Spotlight Behavior
```jsx
<CardSpotlight
  radius={500}           // Larger spotlight
  color="#4B7F52"        // Green from your theme
/>
```

---

## 🤝 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all dependencies installed: `npm list framer-motion three @react-three/fiber`
3. Ensure dev server restarted after config changes
4. Review integration examples in this guide

---

## 📌 Quick Start Summary

1. ✅ Dependencies installed
2. ✅ Components created in `/components/ui`
3. ✅ DSS-themed cards created
4. ✅ Path aliases configured
5. 🎯 **Next:** Copy integration examples into your dashboard files
6. 🚀 **Test:** Restart dev server and check the effect

Happy coding! 🎉

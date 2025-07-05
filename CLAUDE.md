# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "grishas-space" - a MySpace revival project built with modern React, featuring Three.js for 3D graphics, collaborative editing capabilities, and live music integration.

## Current State

This repository is in its initial state with only basic documentation files (README.md, LICENSE). No build system, dependencies, or source code has been established yet.

# Claude.md - Grishas Space

## Project Overview

Grishas Space is a creative personal website that reimagines the nostalgic MySpace aesthetic through a modern lens, incorporating cutting-edge web technologies. This project is part of a larger portfolio ecosystem and serves as a creative playground that showcases technical skills through playful, nostalgic design.

## Portfolio Ecosystem Context

This project exists as part of a multi-domain portfolio strategy:

### Domain Architecture

- **grishalr.dev** - Professional portfolio site (clean, modern, recruiter-friendly)
- **grishas.space** - This project: Creative MySpace revival with experimental features

### How This Project Fits In

1. **Technical Showcase**: Demonstrates ability to build complex, interactive applications
2. **Creative Expression**: Shows personality beyond traditional portfolio constraints
3. **Full-Stack Thinking**: Integrates multiple APIs and real-time features
4. **Portfolio Piece**: Featured prominently on grishalr.dev as a standout project

### Key Differentiator: MySpace × Fantasy Premier League

The most unique aspect of grishas.space is the Fantasy Premier League integration styled as a MySpace module. This mashup demonstrates:

- **API Integration Skills**: Working with complex third-party APIs
- **Creative Problem Solving**: Merging disparate concepts into cohesive UX
- **Niche Appeal**: Shows depth of interests and ability to create for specific audiences
- **Technical Complexity**: Real-time data, 3D visualizations, drag-and-drop interfaces

## Core Concept

A MySpace-inspired personal website that blends nostalgia with modern web capabilities:

- **Visual Identity**: Early 2000s web aesthetics with contemporary polish
- **Technical Showcase**: Demonstrates proficiency in React, Three.js, real-time collaboration, and audio APIs
- **Personal Touch**: Authentic self-expression while maintaining professional credibility

## Key Features & Technical Implementation

### 1. MySpace-Style Profile Page

- **Three.js Integration**: Interactive 3D elements that respond to user interaction
  - Floating profile picture with particle effects
  - Animated background that shifts based on mouse movement
  - Optional: 3D visualization of music currently playing
- **Audio Player**: Custom audio player for profile music
  - Web Audio API for visualizations
  - Playlist functionality
  - Auto-play considerations (with user consent)
- **Profile Sections**: About me, Top friends, Interests, Music taste

### 2. Collaborative Poetry with Tiptap

- **Real-time Collaboration**: Visitors can contribute to ongoing poems
- **Moderation System**: Review queue for contributions
- **Visual Design**: Typewriter aesthetic with paper texture background
- **Archive**: Gallery of completed collaborative works

### 3. Photo Gallery

- **Layout**: Polaroid-style photo grid with hover effects
- **Interactions**: Click to expand, swipe navigation on mobile
- **Categories**: Personal shots, design work, random moments

### 4. Resume Section

- **Dual View**: Toggle between "MySpace style" and professional format
- **Interactive Elements**: Skill bars that animate on scroll
- **Download Option**: PDF export of traditional resume

### 5. Blog/Articles

- **Writing Style**: Technical posts with personality
- **Categories**: Dev thoughts, tutorials, life updates
- **Comments**: Optional Tiptap-powered comment system

## Technical Architecture

### Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules or Styled Components (avoid Tailwind for this project - embrace custom styles)
- **State Management**: Zustand or Context API for simplicity
- **Testing**: Vitest + React Testing Library
- **3D**: Three.js with React Three Fiber
- **Rich Text**: Tiptap with Yjs for collaboration
- **Audio**: Web Audio API with custom React hooks

### Project Structure

```
grishas-space/
├── src/
│   ├── components/
│   │   ├── MySpaceProfile/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ProfilePicture.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── TopFriends.tsx
│   │   │   ├── MusicPlayer.tsx
│   │   │   └── index.tsx
│   │   ├── CollabPoetry/
│   │   │   ├── PoemEditor.tsx
│   │   │   ├── PoemArchive.tsx
│   │   │   ├── ContributorList.tsx
│   │   │   └── index.tsx
│   │   ├── PhotoGallery/
│   │   │   ├── PhotoGrid.tsx
│   │   │   ├── PhotoModal.tsx
│   │   │   ├── PhotoCard.tsx
│   │   │   └── index.tsx
│   │   ├── Resume/
│   │   │   ├── ResumeToggle.tsx
│   │   │   ├── MySpaceResume.tsx
│   │   │   ├── ProfessionalResume.tsx
│   │   │   └── index.tsx
│   │   ├── Blog/
│   │   │   ├── BlogList.tsx
│   │   │   ├── BlogPost.tsx
│   │   │   ├── BlogComments.tsx
│   │   │   └── index.tsx
│   │   ├── Three/
│   │   │   ├── FloatingProfile.tsx
│   │   │   ├── ParticleField.tsx
│   │   │   ├── AudioVisualizer.tsx
│   │   │   └── BackgroundScene.tsx
│   │   └── common/
│   │       ├── Layout.tsx
│   │       ├── Navigation.tsx
│   │       ├── Footer.tsx
│   │       └── LoadingScreen.tsx
│   ├── hooks/
│   │   ├── useAudio.ts
│   │   ├── useThree.ts
│   │   ├── useCollaboration.ts
│   │   ├── useAnimations.ts
│   │   └── useMediaQuery.ts
│   ├── styles/
│   │   ├── themes/
│   │   │   ├── myspace.css
│   │   │   └── professional.css
│   │   ├── animations/
│   │   │   ├── glitch.css
│   │   │   ├── float.css
│   │   │   └── transitions.css
│   │   ├── globals.css
│   │   └── variables.css
│   ├── utils/
│   │   ├── audio.ts
│   │   ├── three-helpers.ts
│   │   ├── date.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── models.ts
│   │   ├── api.ts
│   │   └── components.ts
│   ├── lib/
│   │   ├── tiptap-config.ts
│   │   ├── three-config.ts
│   │   └── api-client.ts
│   ├── assets/
│   │   ├── fonts/
│   │   ├── images/
│   │   ├── audio/
│   │   └── models/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Profile.tsx
│   │   ├── Poetry.tsx
│   │   ├── Gallery.tsx
│   │   ├── Resume.tsx
│   │   └── Blog.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── public/
│   ├── favicon.ico
│   └── assets/
├── tests/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── README.md
└── claude.md
```

### Vite Configuration with Aliases

This is a critical part of the project setup. The alias configuration makes imports cleaner and more maintainable:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@three": path.resolve(__dirname, "./src/components/Three"),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "three-vendor": ["three", "@react-three/fiber", "@react-three/drei"],
          "tiptap-vendor": [
            "@tiptap/react",
            "@tiptap/starter-kit",
            "@tiptap/extension-collaboration",
          ],
        },
      },
    },
  },
});
```

### TypeScript Configuration for Aliases

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@styles/*": ["./src/styles/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"],
      "@lib/*": ["./src/lib/*"],
      "@assets/*": ["./src/assets/*"],
      "@pages/*": ["./src/pages/*"],
      "@three/*": ["./src/components/Three/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Import Examples with Aliases

```typescript
// Instead of: import ProfileHeader from '../../../components/MySpaceProfile/ProfileHeader'
import ProfileHeader from "@components/MySpaceProfile/ProfileHeader";

// Instead of: import { useAudio } from '../../../../hooks/useAudio'
import { useAudio } from "@hooks/useAudio";

// Instead of: import styles from '../../../styles/themes/myspace.css'
import styles from "@styles/themes/myspace.css";

// Clean Three.js imports
import { FloatingProfile } from "@three/FloatingProfile";
import { BackgroundScene } from "@three/BackgroundScene";
```

## Design Philosophy

### Visual Language

- **Color Palette**:
  - Primary: Electric blue (#0066FF)
  - Accent: Hot pink (#FF0066)
  - Background: Dark grey (#1a1a1a) with subtle gradients
  - Text: Off-white (#f0f0f0)
- **Typography**: Mix of system fonts and custom web fonts
  - Headers: Bold, slightly distorted (CSS transforms)
  - Body: Clean, readable but with personality
- **Effects**:
  - Glitch effects on hover
  - Subtle animations throughout
  - Particle systems for emphasis

### UX Principles

1. **Nostalgic but Usable**: Balance MySpace chaos with modern UX expectations
2. **Performance First**: Three.js and animations should not compromise load times
3. **Mobile Responsive**: Full experience on all devices
4. **Accessibility**: Screen reader support, keyboard navigation

## Code Style Guidelines

### General Principles

- **Concise Variables**: Use short, meaningful names (e.g., `el`, `ctx`, `idx`)
- **Functional Approach**: Prefer functional components and hooks
- **Type Safety**: Leverage TypeScript fully - no `any` types
- **Comments**: Only when logic isn't self-evident

### React Patterns

```typescript
// Component structure
export const ProfileSection: FC<ProfileProps> = ({ user, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  return <section className={styles.profile}>{/* Content */}</section>;
};
```

### Three.js Integration

```typescript
// Keep Three.js logic in custom hooks
export const useFloatingAnimation = (ref: RefObject<Mesh>) => {
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    ref.current.rotation.y += 0.01;
  });
};
```

## Portfolio Context

This project demonstrates:

1. **Creative Problem Solving**: Merging nostalgia with modern tech
2. **Technical Breadth**: React, 3D graphics, real-time collaboration, audio processing
3. **Attention to Detail**: Polished animations and interactions
4. **Full-Stack Thinking**: Even in frontend, considering data flow and state management
5. **User-Centric Design**: Balancing creativity with usability

## Development Approach

### Phase 1: Foundation

- Set up Vite + React + TypeScript
- Create basic routing and layout
- Implement MySpace profile structure
- Add basic Three.js scene

### Phase 2: Core Features

- Integrate Tiptap collaborative editor
- Build custom audio player with visualizations
- Create photo gallery with animations
- Design resume toggle system

### Phase 3: Polish

- Add sophisticated Three.js effects
- Implement page transitions
- Optimize performance
- Add easter eggs and delightful interactions

### Phase 4: Content & Launch

- Write initial blog posts
- Curate photo collection
- Set up collaborative poem seeds
- Deploy with proper SEO and social sharing

## Key Differentiators

1. **Not Just Nostalgic**: Uses MySpace as inspiration, not limitation
2. **Technical Sophistication**: Showcases modern web capabilities
3. **Personal Brand**: Authentic personality shines through
4. **Interactive Experience**: Visitors participate, not just consume
5. **Mobile-First MySpace**: Something that never existed originally

## Success Metrics

- Page load time under 3 seconds
- Three.js scenes run at 60fps on mid-range devices
- Collaborative poems get genuine contributions
- Resume section leads to actual opportunities
- Blog posts demonstrate technical expertise

## Future Enhancements

- WebRTC video chat in "friend space"
- AI-powered poem suggestions
- WebGL shader effects for profile customization
- Integration with Spotify API for real-time music updates
- Virtual "room" using Three.js for 3D navigation

Remember: This project should feel like discovering a secret corner of the internet - personal, creative, and unexpectedly sophisticated.

## Development Setup

Since this is a new project without existing build tools or dependencies, you'll need to:

1. Determine the appropriate technology stack based on the project description (React, Three.js, etc.)
2. Initialize the appropriate package manager and build system -- !important always use pnpm
3. Set up the project structure for a modern React application with 3D graphics capabilities

## Architecture Notes

The project aims to combine:

- Modern React frontend framework
- Three.js for 3D graphics and animations
- Collaborative editing features (likely requiring real-time synchronization)
- Music integration capabilities
- MySpace-inspired UI/UX design

## Repository Information

- **License**: MIT
- **Author**: Greg Levine-Rozenvayn
- **Main Branch**: main
- **Initial State**: Empty repository with basic documentation

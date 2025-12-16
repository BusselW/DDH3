---
applyTo: '**'
description: General HTML/JS/CSS Development Guidelines

# Technology Stack
- HTML5 with semantic elements
- Modern JavaScript (ES6+) with React patterns
- CSS3 with modular architecture
- React declared as 'H' for compatibility
- Inline SVG icons

# Core Principles

## DRY (Don't Repeat Yourself)
- Extract reusable components and functions
- Use shared utilities and helper functions
- Centralize configuration and constants

## Modular Architecture
- Organize code into self-contained modules
- Each file should have a single responsibility
- Use clear import/export patterns

## React Pattern Usage
- Use functional components with hooks pattern
- Declare React as 'H' (e.g., `const H = React`)
- Component structure: `H.createElement()` or JSX-like patterns
- Manage state with hooks-style patterns
- Keep components small and focused

# Code Structure

## JavaScript
- Use ES6+ features (arrow functions, destructuring, modules)
- Prefer `const` over `let`, avoid `var`
- Use template literals for string interpolation
- Implement proper error handling
- Add JSDoc comments for complex functions

## CSS
- Use BEM or component-scoped naming conventions
- Organize styles by component
- Leverage CSS variables for theming
- Keep specificity low
- Mobile-first responsive design

## HTML
- Use semantic HTML5 elements
- Maintain proper heading hierarchy
- Include ARIA attributes for accessibility
- Keep markup clean and minimal

# File Organization
- Group related components in folders
- Separate concerns (components, utilities, styles, constants)
- Use index files for cleaner imports
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
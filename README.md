# iLumos — AI-Assisted Patent Claim Chart Refinement

A functional prototype of an AI-assisted workspace designed to help patent infringement analysts refine claim charts while keeping evidence traceable and analysts in control.

## Problem

Patent analysts need to compare patent claim elements against an accused product and determine whether there is supporting evidence.

AI can speed up this process, but unsupported reasoning, false positives, and false negatives can reduce trust in the analysis.

iLumos addresses this by grounding AI recommendations in source evidence and allowing analysts to review, accept, reject, edit, or undo AI-assisted refinements.

## Prototype

The prototype demonstrates:

- Claim chart review
- AI-assisted claim refinement
- Evidence-grounded AI recommendations
- Source document and page references
- Highlighted supporting evidence
- Accept / Reject / Edit AI suggestions
- Correction of incorrect evidence
- Insufficient-evidence handling
- Undo previous refinements
- Export to Word (simulated)

### Key Interaction

The primary workflow is:

`Select claim element → Ask AI to strengthen evidence → Review source passage → Accept refinement → Claim chart updates`

The prototype deliberately keeps the analyst in control:

> **AI proposes. The analyst decides.**

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Mock data / deterministic AI responses

No production AI backend or document-parsing infrastructure is used in this prototype.

## Getting Started

### Install dependencies

```bash
npm install

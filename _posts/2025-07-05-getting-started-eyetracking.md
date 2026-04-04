---
layout: blog-doc
title: "Getting Started with Eye-Tracking Research in HCI"
date: 2025-07-05 00:00:00 +0000
categories: [Tutorial]
tags: [Tutorial, Eye-tracking, Methods]
---

Eye-tracking is a powerful methodology for understanding how people visually process information. This guide covers the essentials for HCI and visualization researchers looking to incorporate it into their studies.

## Equipment Overview

### Desktop Eye Trackers
- **Tobii Pro Spark / Nano** — Good for lab settings, 60–120 Hz, USB plug-and-play
- **SR Research EyeLink 1000+** — Research gold standard, 1000 Hz, requires SR Research software
- **Pupil Labs Core** — Open source, great for mobile/naturalistic settings

### Wearables
Wearable trackers (Tobii Pro Glasses, Pupil Labs) are useful when you need head-free movement, but fixation accuracy is typically lower than desktop setups.

## Setting Up a Study

### Calibration
Always calibrate at the start of each participant session. A 9-point calibration is standard; check average error (< 0.5° is good, < 1° is acceptable).

### Stimuli Design
- Use high-contrast stimuli with clear AOI (Area of Interest) boundaries
- Avoid text smaller than 14pt for reading studies
- For visualization studies: fix image position and size across participants

### Data Collection
Key metrics to collect:
- **Fixations** — where and how long attention is held
- **Saccades** — rapid eye movements between fixations
- **Pupil diameter** — proxy for cognitive load

## Analysis Approaches

### AOI-Based Analysis
Define areas of interest (e.g., chart title, legend, data area) and compute fixation time, fixation count, and entry/dwell sequences per AOI.

### Scanpath Analysis
Compare gaze sequences across participants using algorithms like DTW (Dynamic Time Warping) or Levenshtein distance.

### Heat Maps
Aggregate fixation data into spatial heat maps for visualizing group-level attention patterns.

## Common Pitfalls

1. **Not accounting for individual differences** — Always include participant literacy/expertise as a covariate
2. **Ignoring screen refresh rate** — Make sure your stimuli update timing matches tracker frequency
3. **Over-relying on heat maps** — They aggregate away individual variation; supplement with fixation sequence analysis

## Recommended Resources

- Blascheck et al. (2017) — State of the Art in Eye Tracking for Visualization
- Rayner (2009) — Eye Movements and Attention in Reading, Scene Perception, and Visual Search
- Tobii SDK documentation — for data export and processing

Feel free to reach out if you have questions about setting up an eye-tracking study for your own research!

# Gambling King Tournament - Usage Guide

## Overview
The **Gambling King Tournament** is a retro-styled web application designed to track scores and matches for family game nights. It runs entirely in the browser using a single HTML file and saves data automatically.

## How to Run
1.  Locate the file: `gambling-king.html` in your directory.
2.  **Double-click** the file to open it in your default web browser (Chrome, Edge, Firefox, Safari).
    *   *Note: An active internet connection is required to load the visual libraries (React & Tailwind).*

## Key Features

### 1. Leaderboard (RANK Tab)
*   **Real-time Ranking**: Players are automatically sorted by Total Score.
*   **Visual Cues**: Top 3 players get special Gold/Silver/Bronze icons.
*   **Stats**: Shows Wins, Losses, and current Score.

### 2. Schedule (MATCH Tab)
*   **Match Cards**: Shows a list of all scheduled games.
*   **Status Indicators**: 
    *   `PENDING`: Game has not happened yet.
    *   `FINAL`: Game is finished and scores are locked.
*   **Latest First**: Newer games appear at the top.

### 3. Admin Panel (ADMIN Tab)
*   **Add Player**: Enter a name to register a new participant.
*   **Create Match**: Select two players from the dropdowns to schedule a game.
*   **Input Scores**:
    *   Select a pending match.
    *   Enter the score for Player 1 and Player 2.
    *   Click **CONFIRM RESULT** to update the leaderboard immediately.
*   **Reset Data**: A danger button at the bottom to wipe all history and start a new tournament.

## Troubleshooting
*   **Data not saving?** Ensure you are not in "Incognito" or "Private" mode, as data is saved to LocalStorage.
*   **Layout looks broken?** Check your internet connection; the styling engine (Tailwind) requires internet to load.

Enjoy your tournament! 🎲🏆

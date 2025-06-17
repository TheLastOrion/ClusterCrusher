import { LeaderboardEntry } from "../interfaces/leaderboard-entry";

export const saveToLeaderboard = (score: number) => {
  const leaderboard = loadLeaderboard();

  // Add the new score with the current date
  const newEntry: LeaderboardEntry = {
    score,
    date: new Date().toLocaleString(), // Store the date the game ended
  };

  leaderboard.push(newEntry);

  // Sort the leaderboard by score in descending order (highest score first)
  leaderboard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);

  // Save the leaderboard back to localStorage
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
};

// Function to load the leaderboard from localStorage
export const loadLeaderboard = (): LeaderboardEntry[] => {
  // Retrieve the leaderboard from localStorage, or initialize an empty array if not found
  const leaderboard = localStorage.getItem('leaderboard');
  return leaderboard ? JSON.parse(leaderboard) : [];
};

// Function to clear the leaderboard
export const clearLeaderboard = () => {
  // Remove the leaderboard from localStorage
  localStorage.removeItem('leaderboard');
};
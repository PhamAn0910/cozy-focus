// blocked.js - Script for the blocked page

function goBack() {
  // Navigate to the extension's new tab page
  const extensionUrl = chrome.runtime.getURL('index.html');
  window.location.href = extensionUrl + '#/';
}

// Randomize quotes on page load
document.addEventListener('DOMContentLoaded', function() {
  const quotes = [
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "Your future self will thank you.", author: "Unknown" },
    { text: "Small daily improvements lead to stunning results.", author: "Robin Sharma" }
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.querySelector('.quote').textContent = `"${randomQuote.text}"`;
  document.querySelector('.quote-author').textContent = `— ${randomQuote.author}`;

  // Attach click handler to button
  document.querySelector('.btn').addEventListener('click', goBack);
});

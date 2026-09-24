// String & Regex Analyzer
// DOM traversal, string functions, regular expressions and event handling

"use strict";

const emailInput = document.getElementById("emailInput");
const emailStatus = document.getElementById("emailStatus");
const sourceText = document.getElementById("sourceText");
const processBtn = document.getElementById("processBtn");
const sampleBtn = document.getElementById("sampleBtn");

const emailsBox = document.getElementById("emails");
const phonesBox = document.getElementById("phones");
const datesBox = document.getElementById("dates");
const totalWordsBox = document.getElementById("totalWords");
const uniqueWordsBox = document.getElementById("uniqueWords");
const frequencyList = document.getElementById("frequencyList");

const sampleText =
`For database architecture issues, ping Daffodil Tembhurkar at daffodil.Tembhurkar.batch2024@sitnagpur.siu.edu.in or call 800-555-0199.

The backup service email is backup-service@cloud-infra.net. We also found an old file log from 2024-12-01. Please call the alternate helpline 555-123-4567 if the primary line is busy. Teamwork makes the dream work.`;

function validateEmail() {
    const email = emailInput.value.trim();

    const emailRegex =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (emailRegex.test(email)) {
        emailStatus.textContent = "✓ Structured Valid Email Format";
        emailStatus.className = "status valid";
    } else {
        emailStatus.textContent = "✕ Invalid Email Format";
        emailStatus.className = "status invalid";
    }
}

function getUniqueMatches(regex, text) {
    return [...new Set(text.match(regex) || [])];
}

function extractPatterns() {
    const text = sourceText.value;

    const emails = getUniqueMatches(
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
        text
    );

    const phones = getUniqueMatches(
        /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/g,
        text
    );

    const dates = getUniqueMatches(
        /\b\d{4}-\d{2}-\d{2}\b/g,
        text
    );

    emailsBox.textContent =
        emails.length > 0 ? emails.join(", ") : "No emails detected";

    phonesBox.textContent =
        phones.length > 0 ? phones.join(", ") : "No phone numbers detected";

    datesBox.textContent =
        dates.length > 0 ? dates.join(", ") : "No dates detected";
}

function analyzeWords() {
    const text = sourceText.value.toLowerCase();

    // String processing + regular expression for word extraction.
    const words =
        text.match(/[a-z0-9]+(?:['’-][a-z0-9]+)*/g) || [];

    const frequency = {};

    words.forEach(function (word) {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    const sortedWords = Object.entries(frequency)
        .sort(function (a, b) {
            if (b[1] !== a[1]) {
                return b[1] - a[1];
            }
            return a[0].localeCompare(b[0]);
        })
        .slice(0, 5);

    totalWordsBox.textContent = words.length;
    uniqueWordsBox.textContent = Object.keys(frequency).length;

    frequencyList.innerHTML = "";

    sortedWords.forEach(function ([word, count]) {
        const row = document.createElement("div");
        row.className = "frequency-row";

        const wordSpan = document.createElement("span");
        wordSpan.className = "word";
        wordSpan.textContent = '"' + word + '"';

        const countSpan = document.createElement("span");
        countSpan.className = "count";
        countSpan.textContent =
            count + " instance" + (count === 1 ? "" : "s");

        row.appendChild(wordSpan);
        row.appendChild(countSpan);

        frequencyList.appendChild(row);
    });
}

function processText() {
    extractPatterns();
    analyzeWords();
}

emailInput.addEventListener("input", validateEmail);
processBtn.addEventListener("click", processText);

sampleBtn.addEventListener("click", function () {
    sourceText.value = sampleText;
    processText();
});

// Run once when the page loads.
validateEmail();
processText();

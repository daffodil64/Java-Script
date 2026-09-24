document.addEventListener("DOMContentLoaded", () => {
    const themeSelect = document.getElementById("themeSelect");
    const saveLocalBtn = document.getElementById("saveLocalBtn");
    const saveSessionBtn = document.getElementById("saveSessionBtn");
    const clearPrefsBtn = document.getElementById("clearPrefsBtn");
    const statusLog = document.getElementById("statusLog");

    const STORAGE_KEY = "userAppliedTheme";

    // Update the trace logger UI
    function updateLog(msg, borderColor = "#9ca3af") {
        statusLog.textContent = msg;
        statusLog.style.borderColor = borderColor;
    }

    // ==========================================
    // 1. INITIALIZE & CHECK STORAGE PRIORITY
    // ==========================================
    function initializePreferences() {
        const localTheme = localStorage.getItem(STORAGE_KEY);
        const sessionTheme = sessionStorage.getItem(STORAGE_KEY);

        if (localTheme) {
            // LocalStorage takes primary precedence
            applyTheme(localTheme);
            themeSelect.value = localTheme;
            updateLog("Loaded configuration from LocalStorage 💾", "#059669");
        } else if (sessionTheme) {
            // Fallback checking SessionStorage
            applyTheme(sessionTheme);
            themeSelect.value = sessionTheme;
            updateLog("Loaded configuration from SessionStorage ⏱️", "#2563eb");
        } else {
            // Default baseline configuration fallback
            applyTheme("theme-light");
            themeSelect.value = "theme-light";
            updateLog("No settings saved. Using default configurations.", "#9ca3af");
        }
    }

    // Standard application engine helper
    function applyTheme(themeClass) {
        document.body.className = themeClass;
    }

    // Realtime preview selection changes before confirming storage actions
    themeSelect.addEventListener("change", (e) => {
        applyTheme(e.target.value);
        updateLog("Preview shifted. Click a save button below to preserve.", "#eab308");
    });

    // ==========================================
    // 2. EXPLICIT STORAGE TRIGGERS
    // ==========================================

    // Action A: Commit to LocalStorage
    saveLocalBtn.addEventListener("click", () => {
        const activeValue = themeSelect.value;
        
        // Remove from session to avoid cross-contamination conflicts
        sessionStorage.removeItem(STORAGE_KEY);
        
        localStorage.setItem(STORAGE_KEY, activeValue);
        updateLog(`Successfully saved '${activeValue}' to LocalStorage!`, "#059669");
    });

    // Action B: Commit to SessionStorage
    saveSessionBtn.addEventListener("click", () => {
        const activeValue = themeSelect.value;
        
        // Remove from local so session configuration takes dominant routing status
        localStorage.removeItem(STORAGE_KEY);
        
        sessionStorage.setItem(STORAGE_KEY, activeValue);
        updateLog(`Successfully saved '${activeValue}' to SessionStorage!`, "#2563eb");
    });

    // Action C: Total Purge Clean
    clearPrefsBtn.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        
        // Reset view back to structural fallback definitions
        applyTheme("theme-light");
        themeSelect.value = "theme-light";
        updateLog("All system storage parameters successfully wiped clean!", "#dc2626");
    });

    // Trigger on structural environment load
    initializePreferences();
});

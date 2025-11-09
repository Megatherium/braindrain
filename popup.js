// Load the last used URL when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  const targetUrlInput = document.getElementById('targetUrl');
  const sendButton = document.getElementById('sendButton');
  const statusDiv = document.getElementById('status');

  // Load saved URL from storage
  chrome.storage.local.get(['lastUrl'], (result) => {
    if (result.lastUrl) {
      targetUrlInput.value = result.lastUrl;
    } else {
      targetUrlInput.value = 'https://';
    }
  });

  // Handle send button click
  sendButton.addEventListener('click', async () => {
    const targetUrl = targetUrlInput.value.trim();

    // Validate URL
    if (!targetUrl || targetUrl === 'https://') {
      showStatus('Please enter a valid URL', 'error');
      return;
    }

    try {
      // Validate URL format
      new URL(targetUrl);
    } catch (e) {
      showStatus('Invalid URL format', 'error');
      return;
    }

    // Disable button while processing
    sendButton.disabled = true;
    showStatus('Getting page source...', 'info');

    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab) {
        showStatus('No active tab found', 'error');
        sendButton.disabled = false;
        return;
      }

      // Execute script to get HTML source
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.documentElement.outerHTML
      });

      const htmlSource = results[0].result;

      // Send HTML source to target URL
      showStatus('Sending...', 'info');
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        },
        body: htmlSource
      });

      if (response.ok) {
        showStatus('Sent successfully!', 'success');
        // Save the URL for next time
        chrome.storage.local.set({ lastUrl: targetUrl });
      } else {
        showStatus(`Failed: ${response.status} ${response.statusText}`, 'error');
      }
    } catch (error) {
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      sendButton.disabled = false;
    }
  });

  // Helper function to show status messages
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;

    if (type === 'success') {
      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
      }, 3000);
    }
  }

  // Allow pressing Enter to send
  targetUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendButton.click();
    }
  });
});

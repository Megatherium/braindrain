# HTML Source Sender - Chrome Extension

A simple Chrome extension that sends the HTML source of the currently active page to a specified URL via POST request.

## Features

- Clean, user-friendly popup interface
- URL input field with "https://" prefill
- Sends complete HTML source of the active page
- Remembers the last used URL
- Status feedback for all operations
- Enter key support for quick sending

## Installation

### Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked"
4. Select the directory containing this extension
5. The extension will now appear in your extensions list

### Using the Extension

1. Click the extension icon in your Chrome toolbar
2. Enter the target URL where you want to send the HTML source
   - The field is prefilled with "https://"
   - The extension remembers your last used URL
3. Click "Send" or press Enter
4. The extension will:
   - Capture the complete HTML source of the current page
   - Send it via POST request to your specified URL
   - Display status messages for each step

## Files

- `manifest.json` - Extension configuration
- `popup.html` - Popup user interface
- `popup.js` - Main logic for capturing and sending HTML
- `styles.css` - Styling for the popup

## Permissions

The extension requires the following permissions:

- `activeTab` - To access the HTML of the current tab
- `storage` - To remember the last used URL
- `scripting` - To execute script that captures the page HTML
- `<all_urls>` - To send POST requests to any URL

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **HTML Capture**: Uses `chrome.scripting.executeScript` to get `document.documentElement.outerHTML`
- **Storage**: Uses `chrome.storage.local` to persist the last used URL
- **Content Type**: Sends HTML with `Content-Type: text/html; charset=utf-8`

## Usage Example

1. Navigate to any webpage
2. Click the extension icon
3. Enter your server URL (e.g., `https://example.com/receive`)
4. Click "Send"
5. Your server will receive a POST request with the page's HTML in the body

## Server-Side Example

Here's a simple example of how to receive the HTML on your server:

### Node.js (Express)
```javascript
app.post('/receive', express.text({ type: 'text/html' }), (req, res) => {
  console.log('Received HTML:', req.body);
  res.sendStatus(200);
});
```

### Python (Flask)
```python
@app.route('/receive', methods=['POST'])
def receive():
    html = request.get_data(as_text=True)
    print('Received HTML:', html)
    return '', 200
```

## Development

To modify the extension:

1. Make your changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## License

See the LICENSE file for details.

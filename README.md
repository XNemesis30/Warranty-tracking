# EZ GADGETS RMA Tracker

A complete warranty tracking web app for EZ Gadgets shops. Hosted on GitHub Pages, powered by Google Sheets as a free database.

---

## Features

- 📦 Register warranty claims with auto-generated RMA codes (EZL1-YYMMDD-XXXX or EZL2-...)
- 🖨️ Generate A4 PDF forms (Office Copy + Customer Copy on one page, matching your existing format)
- 📍 Track which of your 2 locations received the product
- 🔧 Track repair status: In-House or sent to **We Repair BD**
- 🔍 Search by customer name, phone number, or RMA code
- 📊 Dashboard with live stats
- 💾 All data saved to Google Sheets automatically

---

## Setup in 3 Steps

### Step 1 – Host on GitHub Pages

1. Create a GitHub account at [github.com](https://github.com) if you don't have one
2. Click **New repository**, name it `ez-gadgets-rma`, make it **Public**
3. Upload `index.html` to the repository
4. Go to **Settings → Pages**
5. Under "Source", select **Deploy from a branch → main → / (root)**
6. Click Save. In ~2 minutes your app will be live at:  
   `https://YOUR-USERNAME.github.io/ez-gadgets-rma`

---

### Step 2 – Set Up Google Sheet + Apps Script

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
   - Name it: `EZ Gadgets RMA Database`
2. In the spreadsheet, go to **Extensions → Apps Script**
3. Delete any existing code in the editor
4. Copy the entire contents of `Code.gs` and paste it in
5. Click the **Save** icon (💾)
6. Click **Deploy → New deployment**
7. Set:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy** and **Authorize** when prompted
9. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/ABC.../exec`)

---

### Step 3 – Connect the App

1. Open your GitHub Pages URL
2. Click the **⚙️ Setup** tab
3. Paste your Web App URL into the field
4. Enter your location names (e.g., "Dhanmondi Branch" and "Gulshan Branch")
5. Click **Save Configuration**
6. Click **Test Connection** to verify it works

> ✅ Done! Your app is now fully operational.

---

## How to Use

### Register a New RMA
1. Go to **New RMA** tab
2. Fill in customer details and product info
3. Select which location received the device
4. Click **Register & Generate Code** — a unique code like `EZL1-260405-7823` is created
5. Click **Print RMA Form** to download the A4 PDF (two copies)

### Track & Update
1. Go to **All Records** or **Search**
2. Click **Details** on any record
3. Update the status:
   - `Received` → `In Repair (In-House)` → `Fixed` → `Delivered`
   - Or: `Sent to We Repair BD` → `Fixed` → `Delivered`
4. Click **Save Status**

### Search
- Search by **customer name**, **phone number**, or **RMA code**
- Works from the Search tab

---

## RMA Code Format

```
EZL1-260405-7823
 │    │      └── Random 4-digit number
 │    └────────── Date (YYMMDD)
 └───────────────── Location prefix (EZL1 or EZL2)
```

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | The complete web app (single file) |
| `Code.gs` | Google Apps Script backend (paste into Apps Script) |
| `README.md` | This setup guide |

---

## Notes

- The app stores settings (URL, location names) in your browser's local storage
- Each device/browser needs to be configured once via the Setup tab
- The Google Sheet auto-creates headers on first use
- PDFs are generated entirely in the browser — no server needed

# Testing the Fantrax API Client

## Step 1: Get Your Fantrax Cookie

The Fantrax API requires authentication via cookies. Here's how to get yours:

### Chrome/Edge/Brave
1. Open your browser and go to [Fantrax](https://www.fantrax.com/)
2. Log in to your account
3. Press `F12` to open DevTools
4. Go to **Application** tab (or **Storage** in Firefox)
5. In the left sidebar, expand **Cookies** and click `https://www.fantrax.com`
6. Look for cookies and copy ALL cookie values into one string

**Easier method using DevTools Console:**
```javascript
// Run this in the browser console while on fantrax.com
document.cookie
```
Copy the entire output.

### Firefox
1. Open Firefox and go to [Fantrax](https://www.fantrax.com/)
2. Log in to your account
3. Press `F12` to open DevTools
4. Go to **Storage** tab
5. Expand **Cookies** and click `https://www.fantrax.com`
6. Copy the cookie string

## Step 2: Add Cookie to Environment

Add your cookie to `.env.local`:

```bash
# .env.local
FANTRAX_COOKIE="your-entire-cookie-string-here"
```

**Important:** Keep this secret! Don't commit `.env.local` to git (it's already in `.gitignore`).

## Step 3: Run the Test

```bash
bun run test:fantrax
```

## What the Test Does

The test script will:

1. ✅ **Fetch all fantasy teams** in your league
   - Shows team names, abbreviations, and owners

2. ✅ **Fetch a sample roster** (first team)
   - Shows players with positions, NHL teams, FPPG
   - Indicates injured/suspended players

3. ✅ **Fetch all unique players** in the league
   - Aggregates from all team rosters
   - Shows position breakdown
   - Shows injury counts
   - Shows NHL team distribution

4. ✅ **Fetch league standings** (if available)
   - May require additional permissions

## Expected Output

```
🧪 Testing Fantrax API Client

============================================================

📋 Test 1: Fetching fantasy teams...
✅ Found 14 teams:
  1. Buffalo (BUF) - Owner: John
  2. Carolina (CAR) - Owner: Jane
  ...

📋 Test 2: Fetching roster for "Buffalo"...
✅ Found 25 roster slots:
  1. Connor McDavid (C) - EDM - FPPG: 4.2
  2. Nathan MacKinnon (C) - COL - FPPG: 4.0 🤕
  ...

📋 Test 3: Fetching all players from league...
✅ Found 312 unique players across all rosters

  Position breakdown:
    C: 89
    LW: 67
    RW: 65
    D: 78
    G: 13

  Injured players: 12

  Top 5 NHL teams represented:
    TOR: 24 players
    EDM: 22 players
    COL: 21 players
    BOS: 19 players
    TBL: 18 players

============================================================
✅ All tests completed successfully!

🎉 Fantrax API client is working correctly!
```

## Troubleshooting

### "Unauthorized: Not logged in to Fantrax"
Your cookie has expired. Get a fresh one:
1. Log out and back into Fantrax
2. Get a new cookie (see Step 1)
3. Update `.env.local`

### "FANTRAX_COOKIE environment variable not set"
Make sure you:
1. Created `.env.local` in the project root
2. Added the `FANTRAX_COOKIE` variable
3. Saved the file

### "Failed to connect"
Check your internet connection and ensure:
- Fantrax.com is accessible
- Your cookie is valid and complete
- No VPN/firewall blocking the request

## Next Steps After Successful Test

Once the test passes, you're ready to:
1. Build database loaders (Task #4)
2. Create ETL orchestration service (Task #5)
3. Add admin API route for manual sync (Task #6)
4. Set up automated daily updates (Task #7)

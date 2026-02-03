# 🌧️ מערכת התראות גשם - ישראל
## Rain Alert Dashboard - Real-time Rain Monitoring System

<div dir="rtl">

![Dashboard Preview](https://via.placeholder.com/1200x600/667eea/ffffff?text=Rain+Alert+Dashboard)

## 📋 תוכן עניינים

- [תיאור המערכת](#תיאור-המערכת)
- [תכונות](#תכונות)
- [הדרישות](#הדרישות)
- [התקנה והפעלה](#התקנה-והפעלה)
- [הוראות פריסה ל-Vercel](#הוראות-פריסה-ל-vercel)
- [מבנה הפרויקט](#מבנה-הפרויקט)
- [טכנולוגיות](#טכנולוגיות)
- [תמיכה](#תמיכה)

---

## 🎯 תיאור המערכת

מערכת מתקדמת לניטור גשם בזמן אמת בכל רחבי מדינת ישראל. המערכת מנתחת נתוני מכ"ם מ-**GovMap** ו-**Windy** ומציגה התראות על יישובים מושפעים ברמות חומרה שונות.

### 🚨 רמות התראה

| רמה | צבע | dBZ | מ"מ/שעה |
|-----|-----|-----|---------|
| **אזהרה** | 🟡 צהוב | 35-40 | 2.5-8.0 |
| **סכנה** | 🟠 כתום | 40-45 | 8.0-15.0 |
| **חמור** | 🔴 אדום | 45+ | 15.0+ |

---

## ✨ תכונות

- ✅ **ניטור בזמן אמת** - עדכון כל 10 דקות
- ✅ **תמיכה במקורות מרובים** - GovMap (ישראלי מדויק) ו-Windy (בינלאומי)
- ✅ **מפה אינטראקטיבית** - הצגת יישובים מושפעים על המפה
- ✅ **התראות חכמות** - זיהוי אוטומטי של גשם כבד
- ✅ **עיצוב מקצועי ומרהיב** - ממשק משתמש מודרני ואסתטי
- ✅ **תמיכה מלאה בעברית** - RTL, פונטים מותאמים
- ✅ **רספונסיבי** - עובד מצוין על כל המכשירים
- ✅ **OCR חינמי** - ניתוח תמונות ללא עלות

---

## 📦 הדרישות

### לפיתוח מקומי:
- Python 3.11+
- Node.js 18+ (אופציונלי)
- Git

### לפריסה בענן:
- חשבון GitHub (חינמי)
- חשבון Vercel (חינמי)

---

## 🚀 התקנה והפעלה

### שלב 1: שכפול הפרויקט

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/rain-alert-dashboard.git
cd rain-alert-dashboard
\`\`\`

### שלב 2: התקנת תלויות Python

\`\`\`bash
pip install -r requirements.txt
playwright install chromium
\`\`\`

### שלב 3: הרצה מקומית (בדיקה)

\`\`\`bash
# הרצת עדכון מכ"ם פעם אחת
python backend/radar_processor.py

# הרצת שרת פיתוח פשוט
cd frontend
python -m http.server 8000
\`\`\`

פתח דפדפן בכתובת: `http://localhost:8000`

---

## 🌐 הוראות פריסה ל-Vercel

### 📱 אופציה 1: מהטלפון (הכי קל!)

#### שלב 1: העלאה ל-GitHub

1. **צור חשבון GitHub** (אם אין לך):
   - גלוש ל-https://github.com/signup
   - הירשם עם אימייל
   - אשר את האימייל

2. **צור Repository חדש**:
   - לחץ על ה-`+` בפינה הימנית העליונה
   - בחר "New repository"
   - שם: `rain-alert-dashboard`
   - סמן "Public"
   - לחץ "Create repository"

3. **העלה קבצים**:
   - לחץ "uploading an existing file"
   - גרור את כל הקבצים מהפרויקט (או לחץ "choose your files")
   - לחץ "Commit changes"

#### שלב 2: חיבור ל-Vercel

1. **הירשם ל-Vercel**:
   - גלוש ל-https://vercel.com/signup
   - לחץ "Continue with GitHub"
   - אשר את הגישה

2. **יבוא הפרויקט**:
   - לחץ "Add New..." → "Project"
   - בחר את ה-`rain-alert-dashboard` repository
   - לחץ "Import"

3. **הגדרות**:
   - **Framework Preset**: Other
   - **Root Directory**: `.`
   - **Build Command**: השאר ריק
   - **Output Directory**: `frontend`
   - לחץ "Deploy"

4. **סיימת! 🎉**
   - הפרויקט יעלה אוטומטית
   - תקבל כתובת כמו: `https://rain-alert-dashboard-xxx.vercel.app`

---

### 💻 אופציה 2: ממחשב (מתקדם)

\`\`\`bash
# 1. התקן Vercel CLI
npm i -g vercel

# 2. התחבר לחשבון
vercel login

# 3. פרוס את הפרויקט
vercel --prod
\`\`\`

---

## 🔄 עדכונים אוטומטיים

המערכת מוגדרת לעדכון אוטומטי כל 10 דקות באמצעות **GitHub Actions**.

### הפעלת Actions:

1. עבור ל-Repository ב-GitHub
2. לשונית "Settings"
3. "Actions" → "General"
4. סמן "Allow all actions and reusable workflows"
5. שמור

**זהו!** המערכת תעדכן את נתוני המכ"ם אוטומטית כל 10 דקות.

---

## 📁 מבנה הפרויקט

\`\`\`
rain-alert-dashboard/
├── .github/
│   └── workflows/
│       └── update-radar.yml      # GitHub Actions - עדכון אוטומטי
│
├── backend/
│   └── radar_processor.py        # עיבוד וניתוח מכ"ם
│
├── frontend/
│   ├── index.html               # דף ראשי
│   ├── styles.css               # עיצוב
│   └── app.js                   # לוגיקה
│
├── data/
│   ├── screenshots/             # צילומי מסך מכ"ם
│   └── output/                  # נתונים מעובדים
│
├── requirements.txt             # תלויות Python
├── vercel.json                  # הגדרות Vercel
└── README.md                    # הקובץ הזה
\`\`\`

---

## 🛠️ טכנולוגיות

### Backend:
- **Python 3.11** - שפת תכנות
- **Playwright** - צילום מסך אוטומטי
- **OpenCV** - עיבוד תמונה וזיהוי צבעים
- **NumPy** - חישובים מתמטיים

### Frontend:
- **HTML5/CSS3** - מבנה ועיצוב
- **JavaScript (Vanilla)** - לוגיקה
- **Leaflet.js** - מפות אינטראקטיביות
- **Google Fonts** - פונטים עבריים

### DevOps:
- **GitHub Actions** - אוטומציה
- **Vercel** - אירוח ופריסה
- **Git** - בקרת גרסאות

---

## 🎨 התאמה אישית

### שינוי תדירות עדכון:

ערוך את הקובץ `.github/workflows/update-radar.yml`:

\`\`\`yaml
on:
  schedule:
    - cron: '*/5 * * * *'  # כל 5 דקות במקום 10
\`\`\`

### שינוי מקור נתונים ברירת מחדל:

ערוך את `frontend/app.js`:

\`\`\`javascript
let currentSource = 'windy'; // במקום 'govmap'
\`\`\`

### שינוי סף התראות:

ערוך את `backend/radar_processor.py` ושנה את הקונסטנטות `DBZ_TO_MM_CONVERSION`.

---

## 🐛 פתרון בעיות

### הפרויקט לא עולה ב-Vercel?
- ✅ ודא ש-`vercel.json` קיים
- ✅ ודא שהתיקייה `frontend` מכילה את כל הקבצים
- ✅ בדוק שאין שגיאות ב-Build Logs

### GitHub Actions לא רץ?
- ✅ ודא ש-Actions מופעל (Settings → Actions)
- ✅ בדוק את ה-Workflow logs
- ✅ ודא שיש הרשאות כתיבה ל-repo

### המפה לא נטענת?
- ✅ בדוק את ה-Console בדפדפן (F12)
- ✅ ודא שיש חיבור אינטרנט
- ✅ נסה רענון דף (Ctrl+Shift+R)

---

## 🤝 תמיכה ושאלות

יצרת את המערכת הזו? מצוין! 🎉

יש לך שאלות או בעיות? אנחנו כאן לעזור:

1. **תיעוד** - קרא את כל החלקים של README
2. **Issues** - פתח Issue ב-GitHub
3. **דיון** - שתף את החוויה שלך!

---

## 📄 רישיון

MIT License - חופשי לשימוש, שינוי והפצה.

---

## 🙏 תודות

- **GovMap** - על נתוני המכ"ם המדויקים
- **Windy** - על נתוני מכ"ם בינלאומיים
- **OpenStreetMap** - על מפות בסיס
- **Claude AI** - על פיתוח המערכת

---

<div align="center">

### 🌟 אם המערכת עזרה לך - תן ⭐ ל-Repository!

**פותח עם ❤️ באמצעות Claude AI**

</div>

</div>

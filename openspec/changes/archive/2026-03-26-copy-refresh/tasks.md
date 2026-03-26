## Copy Refresh — Tasks

All Supabase updates must be done for **both `lang: "en"` and `lang: "he"`**.
All code changes update the hardcoded fallback string to match the new Supabase value.

---

## 1. Hero Subtext

- [x] 1.1 Update `hero.subtext` (EN) in Supabase
  - Old: `"Full-stack developer across TypeScript, Kotlin, Rust & Python. I build complete products — from mobile apps to encrypted protocols to production infrastructure."`
  - New: `"I take projects from idea to production. Mobile apps, AI products, backend systems, infrastructure — one developer, full ownership, no handoffs."`
- [x] 1.2 Update `hero.subtext` (HE) in Supabase
  - Old: `"מפתח Full-Stack ב-TypeScript, Kotlin, Rust ו-Python. אני בונה מוצרים שלמים — מאפליקציות מובייל ועד פרוטוקולים מוצפנים ותשתיות בפרודקשן."`
  - New: `"אני לוקח פרויקטים מרעיון לפרודקשן. אפליקציות מובייל, מוצרי AI, מערכות באקאנד, תשתיות — מפתח אחד, אחריות מלאה, בלי העברות."`
- [x] 1.3 Update fallback string in `src/sections/Hero.tsx` (line 53–56) to match new EN value

---

## 2. Index.html — SEO / Meta Tags

- [x] 2.1 Update `<title>`: `"Amitay Keisar — Developer & Product Builder"` → `"Amitay Keisar — Full-Stack Developer & Product Builder"`
- [x] 2.2 Update `<meta name="description">` → `"I ship products, not prototypes. Full-stack development from mobile apps to AI products to production infrastructure. Based in Israel."`
- [x] 2.3 Update `<meta property="og:title">` → `"Amitay Keisar — Full-Stack Developer & Product Builder"`
- [x] 2.4 Update `<meta property="og:description">` → match new meta description
- [x] 2.5 Update `<meta name="twitter:title">` → match new og:title
- [x] 2.6 Update `<meta name="twitter:description">` → match new meta description

---

## 3. What I Build Section (SkillsGrid)

- [x] 3.1 Update `skills.badge` (EN): `"What I Do"` → `"What I Build"`
- [x] 3.2 Update `skills.badge` (HE): `"מה אני עושה"` → `"מה אני בונה"`
- [x] 3.3 Update `skills.heading` (EN): `"The full stack. For real."` → `"End-to-end. From architecture to App Store."`
- [x] 3.4 Update `skills.heading` (HE): `"הסטאק המלא. באמת."` → `"מקצה לקצה. מארכיטקטורה ועד App Store."`
- [x] 3.5 Update `skills.card1.title` (EN): `"Mobile"` → `"Mobile Apps"`
- [x] 3.6 Update `skills.card1.title` (HE): `"מובייל"` → `"אפליקציות מובייל"`
- [x] 3.7 Update `skills.card1.description` (EN): → `"Native and cross-platform. From first commit to App Store submission. iOS, Android, or both."`
- [x] 3.8 Update `skills.card1.description` (HE): → `"נייטיב וחוצה-פלטפורמות. מהקומיט הראשון ועד הגשה ל-App Store. iOS, Android, או שניהם."`
- [x] 3.9 Update `skills.card2.description` (EN): → `"APIs, databases, cloud deployment, CI/CD. Systems built to scale and run without babysitting."`
- [x] 3.10 Update `skills.card2.description` (HE): → `"APIs, מסדי נתונים, פריסת ענן, CI/CD. מערכות שבנויות לגדול ולרוץ בלי פיקוח."`
- [x] 3.11 Update `skills.card3.title` (EN): `"AI & Agents"` → `"AI-Powered Products"`
- [x] 3.12 Update `skills.card3.title` (HE): `"AI וסוכנים"` → `"מוצרי AI"`
- [x] 3.13 Update `skills.card3.description` (EN): → `"Voice agents, content automation, intelligent workflows. AI that solves real problems, not demos."`
- [x] 3.14 Update `skills.card3.description` (HE): → `"סוכני קול, אוטומציית תוכן, תהליכי עבודה חכמים. AI שפותר בעיות אמיתיות, לא דמואים."`
- [x] 3.15 Update `skills.card4.title` (EN): `"Security & Protocols"` → `"Full Product Builds"`
- [x] 3.16 Update `skills.card4.title` (HE): `"אבטחה ופרוטוקולים"` → `"בניית מוצר מלאה"`
- [x] 3.17 Update `skills.card4.description` (EN): → `"You bring the idea. I handle architecture, development, deployment, and maintenance. One point of contact, start to finish."`
- [x] 3.18 Update `skills.card4.description` (HE): → `"אתה מביא את הרעיון. אני מטפל בארכיטקטורה, פיתוח, פריסה ותחזוקה. איש קשר אחד, מתחילה ועד סוף."`
- [x] 3.19 Update all fallback strings in `src/sections/SkillsGrid.tsx` to match the new EN values
- [x] 3.20 Change card4 icon in `src/sections/SkillsGrid.tsx` from `Shield` to `Rocket` (lucide-react)

---

## 4. Products Bar Badge

- [x] 4.1 Update `products.badge` (EN): `"Currently shipping"` → `"Selected Work"`
- [x] 4.2 Update `products.badge` (HE): `"כרגע בפיתוח"` → `"עבודות נבחרות"`
- [x] 4.3 Update fallback in `src/sections/ProductsBar.tsx` (line 14) to match new EN value

---

## 5. About Body Text

- [x] 5.1 Update `about.body` (EN) in Supabase
  - Remove "No bootcamp. No CS degree. Just documentation, source code, and a need to build things that actually work." from the first paragraph. Rewrite as:
  - New: `"4 years ago I opened a code editor for the first time. Today I ship production software across TypeScript, Kotlin, Rust, and Python — every layer of the stack, from mobile UI to encrypted protocols to cloud infrastructure.\n\nEvery project on this site was built from nothing — designed, architected, coded, deployed, and maintained by me.\n\nPreviously, I served as Head of Logistics in IDF Unit 8200, managing operations for a 1,000+ soldier technology center."`
- [x] 5.2 Update `about.body` (HE) in Supabase — remove "בלי בוטקאמפ. בלי תואר במדעי המחשב. רק תיעוד, קוד מקור, וצורך לבנות דברים שבאמת עובדים." from the first paragraph. Rewrite as:
  - New: `"לפני 4 שנים פתחתי עורך קוד בפעם הראשונה. היום אני שולח תוכנות פרודקשן ב-TypeScript, Kotlin, Rust ו-Python — כל שכבה בסטאק, ממשק מובייל ועד פרוטוקולים מוצפנים ותשתיות ענן.\n\nכל פרויקט באתר הזה נבנה מאפס — תוכנן, אורכיטקט, קודד, נפרס ומתוחזק על ידי.\n\nבעבר שירתתי כראש לוגיסטיקה ביחידה 8200 של צה\"ל, ניהלתי פעולות למרכז טכנולוגי של למעלה מ-1,000 חיילים."`
- [x] 5.3 Update fallback string in `src/sections/About.tsx` (line 34) to match new EN value

---

## 6. Stats — Replace "Languages" with "Projects delivered", Remove stat4

- [x] 6.1 Update `stats.stat2.value` (EN + HE): `"5"` → `"15+"`
- [x] 6.2 Update `stats.stat2.label` (EN): `"Languages"` → `"Projects delivered"`
- [x] 6.3 Update `stats.stat2.label` (HE): `"שפות תכנות"` → `"פרויקטים שסופקו"`
- [x] 6.4 In `src/sections/Stats.tsx`: remove stat4 from the array (the "0 Runtime dependencies" stat)
- [x] 6.5 In `src/sections/Stats.tsx`: update stat2 fallback value to `"15+"` and label to `"Projects delivered"`
- [x] 6.6 In `src/sections/Stats.tsx`: change grid class from `lg:grid-cols-4` to `lg:grid-cols-3`

---

## 7. Contact Subtext

- [x] 7.1 Update `contact.subtext` (EN): `"Have a project in mind? I'd love to hear about it."` → `"Have a project in mind? Tell me about it and I'll get back to you within 24 hours."`
- [x] 7.2 Update `contact.subtext` (HE): `"יש לך פרויקט בראש? אשמח לשמוע עליו."` → `"יש לך פרויקט בראש? ספר לי עליו ואחזור אליך תוך 24 שעות."`
- [x] 7.3 Update fallback in `src/sections/Contact.tsx` (line 25) to match new EN value

---

## 8. Footer Fallback

- [x] 8.1 Update fallback in `src/sections/Footer.tsx` (line 11): `"© 2026 Amitay Keisar"` → `"© 2026 Amitay Keisar. All rights reserved."` (DB already has the correct value — this is just the code fallback)

---

## 9. Remove Wood Carousel

- [x] 9.1 In `src/App.tsx`: remove `<WoodCarousel onProjectClick={setSelectedSku} />` from JSX
- [x] 9.2 In `src/App.tsx`: remove the `WoodCarousel` import line
- [x] 9.3 Do NOT delete or modify the WoodCarousel component file or touch Wood-Working rows in Supabase

---

## 10. Section Order — Reorder App.tsx

Current: Hero → ProductsBar + CodeCarousel → About → SkillsGrid → Stats → Testimonials → Contact
Target:  Hero → SkillsGrid → ProductsBar + CodeCarousel → About → Stats → Testimonials → Contact

- [x] 10.1 In `src/App.tsx`: move `<SkillsGrid />` out of the About wrapper div and place it between Hero and the work section (before ProductsBar + CodeCarousel)
- [x] 10.2 Verify SkillsGrid still renders correctly outside the ShaderBackground/VideoFades wrapper

---

## 11. Selected Work Heading — Add "Products I've shipped." headline

The ProductsBar currently shows badge + product names. Working-desk says it should also have a section headline: "Products I've shipped."

- [x] 11.1 Add `products.heading` key (EN) to Supabase: `"Products I've shipped."`
- [x] 11.2 Add `products.heading` key (HE) to Supabase: `"מוצרים ששלחתי."`
- [x] 11.3 In `src/sections/ProductsBar.tsx`: add a `SectionHeading` below the badge with the new `products.heading` key

---

## 12. "How I Work" — New Section

New section with 3 process steps. Needs a new component + Supabase keys (EN + HE).

- [x] 12.1 Add Supabase keys (EN):
  - `process.badge` = `"How I Work"`
  - `process.heading` = `"Straightforward process. No surprises."`
  - `process.step1.number` = `"01"`
  - `process.step1.title` = `"We Talk"`
  - `process.step1.body` = `"You tell me what you need. I ask the right questions. Within 48 hours you get a clear scope, timeline, and cost — no jargon, no fluff."`
  - `process.step2.number` = `"02"`
  - `process.step2.title` = `"I Build"`
  - `process.step2.body` = `"I work in short cycles with regular check-ins. You see progress weekly, not just at the end. Architecture decisions are explained, not hidden."`
  - `process.step3.number` = `"03"`
  - `process.step3.title` = `"You Ship"`
  - `process.step3.body` = `"Deployed, documented, and handed off clean. I stick around after launch to make sure everything runs. Your product, your code, no lock-in."`
- [x] 12.2 Add Supabase keys (HE):
  - `process.badge` = `"איך אני עובד"`
  - `process.heading` = `"תהליך ישיר. בלי הפתעות."`
  - `process.step1.number` = `"01"`
  - `process.step1.title` = `"מדברים"`
  - `process.step1.body` = `"אתה מספר לי מה אתה צריך. אני שואל את השאלות הנכונות. תוך 48 שעות אתה מקבל סקופ ברור, לוח זמנים ועלות — בלי ז'רגון, בלי סיפורים."`
  - `process.step2.number` = `"02"`
  - `process.step2.title` = `"אני בונה"`
  - `process.step2.body` = `"אני עובד במחזורים קצרים עם עדכונים שוטפים. אתה רואה התקדמות כל שבוע, לא רק בסוף. החלטות ארכיטקטורה מוסברות, לא מוסתרות."`
  - `process.step3.number` = `"03"`
  - `process.step3.title` = `"אתה שולח"`
  - `process.step3.body` = `"נפרס, מתועד, ומועבר נקי. אני נשאר אחרי ההשקה כדי לוודא שהכל רץ. המוצר שלך, הקוד שלך, בלי נעילה."`
- [x] 12.3 Create `src/sections/HowIWork.tsx` — new section component with badge, heading, and 3 step cards. Use existing design patterns (SectionBadge, SectionHeading, liquid-glass cards, LanguageTransition)
- [x] 12.4 In `src/App.tsx`: import and place `<HowIWork />` between Selected Work and About (after CodeCarousel, before the About wrapper div)

---

## 13. Footer Social Links

- [x] 13.1 In `src/sections/Footer.tsx`: add GitHub, LinkedIn, and Email links using `SOCIAL_LINKS` from `@/constants/personal`. Style as subtle text links (matching footer aesthetic)



# Gossip Girl: إضافات فقط (بدون استبدال صفحاتك)

هذه الحزمة تحتوي ملفات JavaScript للإضافات فقط. لا تستبدلي ملفات HTML أو CSS الأصلية.

## 1) انسخي الملفات
انسخي مجلد `js` إلى داخل مجلد مشروعك، بحيث يصبح عندك:
- `js/config.js`
- `js/app.js`

## 2) أضيفي السكريبتات قبل `</body>` في الصفحات التي تحتاج الإضافات
في الصفحات التي تستخدم نموذج التواصل (`contact.html`) أضيفي EmailJS أولًا، ثم ملفي الإعدادات والتطبيق بهذا الترتيب:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script src="js/config.js"></script>
<script src="js/app.js"></script>
```
في باقي الصفحات، يمكن استخدام نفس السكريبتات الثلاثة؛ وجودها آمن إذا لم توجد عناصر الإضافات.

## 3) أضيفي الـ hooks للعناصر الموجودة (لا تستبدلي التصميم)
أضيفي فقط `data-*` attributes إلى عناصر HTML الحالية:

### `index.html` (ملخص المسلسل)
على الحاوية التي تريدين عرض معلومات المسلسل فيها:
```html
<div data-show-summary>
  <!-- محتواك الحالي يبقى كما هو إلى أن تُحمّل البيانات -->
</div>
```

### `characters.html` (بحث الشخصيات والحلقات)
على حقل البحث:
```html
<input type="search" data-character-search placeholder="Search characters or actors...">
```
على الحاوية التي ستظهر فيها بطاقات الشخصيات:
```html
<div data-characters-grid></div>
```
وعلى الحاوية التي ستظهر فيها الحلقات:
```html
<div data-episodes-grid></div>
```

### `gossip.html` (بحث GIFs)
```html
<form data-gif-form>
  <input name="gif-query" type="search" placeholder="Search reactions..." required>
  <button type="submit">Search the Tea</button>
</form>
<p data-gif-status class="status"></p>
<div data-gif-results class="gif-grid"></div>
```

### `gallery.html` (معرض الصور)
```html
<p data-gallery-note class="api-note"></p>
<div data-gallery-grid class="gallery-grid"></div>
```

### `contact.html` (EmailJS)
أضيفي `data-gossip-form` إلى الفورم الحالي، وتأكدي أن أسماء الحقول تطابق التالي:
```html
<form data-gossip-form>
  <input name="name" type="text" maxlength="100" placeholder="Your name">
  <input name="email" type="email" maxlength="254" placeholder="Your email (optional)">
  <select name="category" required>
    <option value="Gossip">Spill the Gossip</option>
    <option value="Secret">Confess a Secret</option>
    <option value="Question">Ask Gossip Girl</option>
    <option value="Other">Something Else</option>
  </select>
  <textarea name="message" minlength="3" maxlength="5000" required></textarea>
  <button type="submit">💋 SPILL THE TEA</button>
  <p data-form-status class="status" role="status" aria-live="polite" hidden></p>
</form>
```
هذا مثال لتوضيح أسماء الحقول المطلوبة؛ احتفظي بالـ classes والستايل الأصليين وأضيفي attributes فقط.

## 4) إعداد المفاتيح
افتحي `js/config.js`:
- EmailJS IDs وPublic Key مضافين من القيم التي قدمتيها.
- ضعي GIPHY API key مكان `PASTE_YOUR_GIPHY_API_KEY_HERE` لتفعيل البحث عن GIFs.
- ضعي TMDB API key مكان `PASTE_YOUR_TMDB_API_KEY_HERE` لتفعيل صور TMDB. بدون المفتاح يستخدم المعرض صور TVmaze كبديل.

في EmailJS Template، اجعلي To Email هو `nourelsayedelsbaay@gmail.com`، واستخدمي المتغيرات `{{name}}`, `{{email}}`, `{{category}}`, `{{message}}`, ويمكنك استخدام `{{time}}` أيضًا.

## 5) التشغيل
شغلي المشروع باستخدام VS Code Live Server، وليس بفتح الصفحة مباشرة كـ `file://`، حتى تعمل طلبات `fetch()` بصورة أفضل.

ملاحظة: هذه الحزمة لا تحتوي صفحات HTML أو ملف CSS كاملًا؛ هي ملفات الإضافات وتعليمات دمجها مع تصميمك الحالي.

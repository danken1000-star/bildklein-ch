# bildklein.ch - Testing Checklist

## 🧪 Functionality Tests

### Upload
- [ ] Single image upload (JPG)
- [ ] Single image upload (PNG)
- [ ] Single image upload (WebP)
- [ ] Multiple images upload (batch)
- [ ] Drag & drop works
- [ ] File size warning shows for >10MB
- [ ] Duplicate file detection works
- [ ] Unsupported format error shown

### Compression
- [ ] Auto-optimize mode works
- [ ] Manual mode works
- [ ] Quality slider affects output
- [ ] Format conversion (JPG → PNG)
- [ ] Format conversion (PNG → WebP)
- [ ] Compression progress shown
- [ ] Cancel button works
- [ ] Large images show warning

### Download
- [ ] Single image download works
- [ ] ZIP download works (multiple images)
- [ ] File names are correct
- [ ] Format preserved/converted correctly

### Results
- [ ] Before/After size comparison accurate
- [ ] Savings percentage correct
- [ ] Image preview works
- [ ] Re-compress option works

## 🌍 Language Tests

- [ ] German (DE) works
- [ ] French (FR) works
- [ ] Italian (IT) works
- [ ] English (EN) works
- [ ] Language switcher persists choice
- [ ] Default language is German
- [ ] All UI elements translated

## 📱 Mobile Tests

### iPhone
- [ ] Layout stacks vertically
- [ ] Touch targets are large enough (44x44px minimum)
- [ ] Camera upload works
- [ ] Drag & drop disabled on mobile
- [ ] Bottom sheet opens for settings

### Android
- [ ] Layout works correctly
- [ ] Camera upload works
- [ ] File picker works
- [ ] Performance is good

### Responsive
- [ ] Desktop (>1024px) - side by side
- [ ] Tablet (768px-1024px) - adapted
- [ ] Mobile (<768px) - stacked
- [ ] Very small screens (<375px) - works

## ⚡ Performance Tests

- [ ] Initial load <2 seconds
- [ ] Compression <5s per image
- [ ] No UI blocking during compression
- [ ] Web Workers used for parallel processing
- [ ] Progress updates smooth
- [ ] Images lazy loaded

## 🌐 Offline Tests

- [ ] Works offline after first load
- [ ] Offline indicator shows
- [ ] Compression works offline
- [ ] No network errors offline

## 🔍 SEO Tests

- [ ] Meta tags correct
- [ ] Title tag present
- [ ] Description present
- [ ] Open Graph tags present
- [ ] robots.txt allows indexing
- [ ] Sitemap.xml exists
- [ ] Structured data (JSON-LD) present

## 🔒 Privacy Tests

- [ ] No cookies set
- [ ] Analytics uses localStorage only
- [ ] No tracking pixels
- [ ] No external scripts (except fonts)
- [ ] Privacy policy accessible
- [ ] Impressum accessible

## 🎨 UI/UX Tests

- [ ] Empty state shown correctly
- [ ] Loading skeletons animate
- [ ] Error messages clear
- [ ] Success messages shown
- [ ] Toast notifications work
- [ ] Footer sticky on desktop
- [ ] Language switcher in header
- [ ] Analytics counter updates

## 🚀 Deployment Tests

- [ ] Build succeeds
- [ ] All routes accessible
- [ ] 404 page works
- [ ] Redirect from root works
- [ ] HTTPS enforced
- [ ] No console errors
- [ ] No TypeScript errors

---

## Test Results

Date: _______________
Tester: _______________

Notes:

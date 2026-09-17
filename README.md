# MenuAR

Scan. Explore. Taste. A QR restaurant menu with real 3D models and WebXR table placement where the browser supports it.

## What guests can do

- Open a restaurant menu from a QR code
- Browse categories, search, and inspect dish details
- Rotate a 3D model of the dish
- On compatible Android Chrome sessions, place that model on a detected table. The dish stays in world space; it does not follow the camera
- On other phones and desktops, use the 3D viewer fallback
- Send a table order to the kitchen (no online payment)

## What owners can do

Sign in to `/dashboard` to edit the restaurant profile, categories, dishes, 3D keys, QR codes, orders and first-party analytics.

## Local preview

```bash
npm install
npm run dev
```

The app seeds **Golden Oak Restaurant** at `/menu/golden-oak`.

## Notes

- Database schema lives in `migrations/`. The platform injects `DATABASE_URL` on deploy; preview uses embedded Postgres.
- Do not put service-role keys in frontend code.
- True surface-anchored AR requires WebXR `immersive-ar` + `hit-test`. iOS Safari does not support that today. MenuAR says so instead of faking tracking.

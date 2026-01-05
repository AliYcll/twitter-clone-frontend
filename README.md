# Twitter Clone Frontend

Bu proje, Twitter Clone backend API'si ile birlikte çalýþan React (Vite) tabanlý frontend uygulamasýdýr. Kullanýcý kaydý, giriþ, tweet akýþý ve etkileþim (like/retweet/yorum) gibi temel akýþlarý web arayüzü üzerinden sunar.

## Baðlantýlý Backend

Bu frontend, aþaðýdaki backend repo ile uyumludur:

- Backend Repo: https://github.com/AliYcll/twitter-clone-api
- API Base URL (varsayýlan): `http://localhost:8080/api/v1`

API URL'leri frontend içinde `src/services/*` dosyalarýnda sabitlenmiþtir. Farklý bir port veya base path kullanacaksan bu dosyalarý güncellemelisin.

## Gereksinimler

- Node.js (LTS önerilir)
- npm

## Kurulum

```bash
cd frontend
npm install
```

## Çalýþtýrma

```bash
npm run dev
```

Uygulama varsayýlan olarak `http://localhost:3200` adresinde çalýþýr. Port ayarý `vite.config.js` içinde sabitlenmiþtir.

## Kullanýcý Akýþý (Özet)

1) Register sayfasýndan kullanýcý oluþtur
2) Login ile token alýnýr
3) Token localStorage içinde saklanýr
4) Yetkili istekler `Authorization: Bearer <token>` ile backend'e gider

## API Endpoint Özetleri

Varsayýlan base URL: `http://localhost:8080/api/v1`

- Auth
  - `POST /auth/register`
  - `POST /auth/login`
- Tweets
  - `GET /tweets`
  - `POST /tweets`
  - `DELETE /tweets/{id}`
  - `GET /tweets/user/{id}`
- Comments
  - `POST /comments`
  - `GET /comments/tweet/{tweetId}`
  - `PUT /comments/{commentId}`
  - `DELETE /comments/{commentId}`
- Likes
  - `POST /likes`
  - `DELETE /likes/{tweetId}`
- Retweets
  - `POST /retweets`
  - `DELETE /retweets/{tweetId}`
  - `GET /retweets/me`
- Users
  - `GET /users/me`

## Dosya Yapýsý (Özet)

- `src/pages`: Sayfalar (Home, Login, Register, Retweets, MyTweets)
- `src/components`: UI bileþenleri (TweetCard, TweetList, TweetForm)
- `src/services`: Backend API çaðrýlarý
- `src/context`: AuthContext (login/state yönetimi)

## Sýk Karþýlaþýlan Sorunlar

- 401 Unauthorized
  - Login olun ve localStorage'da token oluþtuðundan emin olun.
- CORS hatasý
  - Backend `SecurityConfiguration` içinde `http://localhost:3200` izinli olmalý.
- Backend kapalý
  - Frontend tek baþýna çalýþmaz; backend'i önce ayaða kaldýrýn.

## Geliþtirme Notlarý

- API base URL'leri `src/services/*` içinde sabit.
- Ýstersen tek bir `API_BASE_URL` dosyasý oluþturup servisleri buradan besleyebilirsin.
- Vite portu `vite.config.js` içinde 3200 olarak ayarlý.

## Lisans

Bu repo örnek/egitim amaçlý kullanýlýr.


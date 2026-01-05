# Twitter Clone Frontend

Bu proje, Twitter Clone backend API'si ile birlikte çalışan React (Vite) tabanlı frontend uygulamasıdır. Kullanıcı kaydı, giriş, tweet akışı ve etkileşim (like/retweet/yorum) gibi temel akışları web arayüzü üzerinden sunar.

## Bağlantılı Backend

Bu frontend, aşağıdaki backend repo ile uyumludur:

- Backend Repo: https://github.com/AliYcll/twitter-clone-api
- API Base URL (varsayılan): `http://localhost:8080/api/v1`

API URL'leri frontend içinde `src/services/*` dosyalarında sabitlenmiştir. Farklı bir port veya base path kullanacaksan bu dosyaları güncellemelisin.

## Gereksinimler

- Node.js (LTS önerilir)
- npm

## Kurulum

```bash
cd frontend
npm install
```

## Çalıştırma

```bash
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3200` adresinde çalışır. Port ayarı `vite.config.js` içinde sabitlenmiştir.

## Kullanıcı Akışı (Özet)

1) Register sayfasından kullanıcı oluştur
2) Login ile token alınır
3) Token localStorage içinde saklanır
4) Yetkili istekler `Authorization: Bearer <token>` ile backend'e gider

## API Endpoint Özetleri

Varsayılan base URL: `http://localhost:8080/api/v1`

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
  - `POST /likes/dislike`
- Retweets
  - `POST /retweets`
  - `DELETE /retweets/{tweetId}`
  - `GET /retweets/me`
- Users
  - `GET /users/me`

## Dosya Yapısı (Özet)

- `src/pages`: Sayfalar (Home, Login, Register, Retweets, MyTweets)
- `src/components`: UI bileşenleri (TweetCard, TweetList, TweetForm)
- `src/services`: Backend API çağrıları
- `src/context`: AuthContext (login/state yönetimi)

## Sık Karşılaşılan Sorunlar

- 401 Unauthorized
  - Login olun ve localStorage'da token oluştuğundan emin olun.
- CORS hatası
  - Backend `SecurityConfiguration` içinde `http://localhost:3200` (alternatif: `http://localhost:5173`) izinli olmalı.
- Backend kapalı
  - Frontend tek başına çalışmaz; backend'i önce ayağa kaldırın.

## Geliştirme Notları

- API base URL'leri `src/services/*` içinde sabit.
- İstersen tek bir `API_BASE_URL` dosyası oluşturup servisleri buradan besleyebilirsin.
- Vite portu `vite.config.js` içinde 3200 olarak ayarlı.

## Lisans

Bu repo örnek/egitim amaçlı kullanılır.

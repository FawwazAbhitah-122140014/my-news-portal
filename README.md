# 📰 My News Portal

Portal berita berbasis Next.js dengan autentikasi Google OAuth dan integrasi berbagai sumber API berita.

## 🚀 Langkah Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/FawwazAbhitah-122140014/my-news-portal
```

### 2. Install Dependencies

```bash
cd my-news-portal
npm install
```

### 3. Konfigurasi Environment

Buat file `.env.local` di direktori utama, lalu isi dengan:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

NEWS_API_KEY=your_news_api_key
MEDIASTACK_API_KEY=your_mediastack_api_key
NYTIMES_API_KEY=your_nytimes_api_key
```

> 💡 Keterangan:
> - `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` didapat dari Google Developer Console.
> - `NEXTAUTH_SECRET` bisa berupa string acak.
> - `NEXTAUTH_URL` adalah URL lokal saat development.

### 4. Menjalankan Server Development

```bash
npm run dev
```

### 5. Akses Aplikasi

Buka di browser:

```
http://localhost:3000
```

Login dengan akun Google sesuai konfigurasi OAuth.

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


const sendEmail = async (name, email, message) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    });

    let mailOptions = {
        from: email,
        to: 'yigitkabak05@hotmail.com',
        subject: 'Yeni İletişim Formu Mesajı',
        text: `Gönderen: ${name}\nE-posta: ${email}\nMesaj: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-posta başarıyla gönderildi!');
    } catch (error) {
        console.error('E-posta gönderilemedi:', error);
    }
};

const googleApiKey = 'AIzaSyDJsSgqZNQtWE1HH-RIRFZWIETuskgVVXo';
const googleCx = '14186417efcac49f0';
const ipinfoToken = 'c621d5706831cd';

const validApiKeys = require('./views/json/ApiKeys.json');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

function checkApiKey(req, res, next) {
    const apiKey = req.query.apikey;
    if (!apiKey || !validApiKeys.includes(apiKey)) {
        return res.status(403).json({ error: "Geçersiz veya eksik API anahtarı" });
    }
    next();
}
const getBangRedirects = () => {
    const bangFilePath = path.join(__dirname, 'views', 'json', 'bang.json');
    return new Promise((resolve, reject) => {
        fs.readFile(bangFilePath, 'utf8', (err, data) => {
            if (err) {
                reject('Bang komutları dosyası okunamadı.');
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

app.get('/search', async (req, res) => { const startTime = Date.now(); let query = req.query.query?.trim() || ''; const type = req.query.type || 'web'; const start = parseInt(req.query.start) || 1;

if (query.startsWith('!')) {
    query = query.substring(1).trim();
    const bangRedirects = {
          github: "https://github.com",
  gh: "https://github.com",
  google: "https://www.google.com",
  ph: "https://www.pornhub.com",
  youtube: "https://www.youtube.com",
  yt: "https://www.youtube.com",
  reddit: "https://www.reddit.com",
  stackoverflow: "https://stackoverflow.com",
  so: "https://stackoverflow.com",
  wikipedia: "https://www.wikipedia.org",
  wp: "https://www.wikipedia.org",
  amazon: "https://www.amazon.com",
  imdb: "https://www.imdb.com",
  twitter: "https://twitter.com",
  fb: "https://facebook.com",
  instagram: "https://www.instagram.com",
  linkedin: "https://www.linkedin.com",
  pinterest: "https://www.pinterest.com",
  tiktok: "https://www.tiktok.com",
  githubissues: "https://github.com/issues",
  news: "https://news.google.com",
  map: "https://maps.google.com",
  spotify: "https://www.spotify.com",
  slack: "https://slack.com",
  discord: "https://discord.com",
  dc: "https://discord.com",
  medium: "https://medium.com",
  vimeo: "https://vimeo.com",
  whatsapp: "https://www.whatsapp.com",
  wp: "https://www.whatsapp.com",
  quora: "https://www.quora.com",
  snapchat: "https://www.snapchat.com"
    };
    if (bangRedirects[query.toLowerCase()]) {
        return res.redirect(bangRedirects[query.toLowerCase()]);
    }
}

let countryCode = 'N/A';
try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || '8.8.8.8';
    const response = await axios.get(`https://ipinfo.io/${ip}?token=${ipinfoToken}`);
    countryCode = response.data.country || 'N/A';
} catch (error) {
    console.error('Ülke kodu alınırken bir hata oluştu:', error.message);
}

try {
    const searchResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: { key: googleApiKey, cx: googleCx, q: query, start }
    });

    const results = (searchResponse.data.items || []).map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        rating: Math.floor(Math.random() * 10) + 1
    }));

    const images = (searchResponse.data.items || [])
        .filter(item => item.pagemap?.cse_image)
        .map(item => ({
            link: item.link,
            image: item.pagemap.cse_image[0]?.src || null
        }));

    const shoppingResults = (searchResponse.data.items || [])
        .map(item => ({
            product: item.pagemap?.product?.[0]?.name || null,
            link: item.link,
            image: item.pagemap?.cse_image?.[0]?.src || null
        }))
        .filter(item => item.product);

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);

    res.render('results', { query, type, results, images, shoppingResults, countryCode, elapsedTime, start });
} catch (error) {
    console.error('API çağrısı sırasında hata oluştu:', error.message);
    res.render('results', { query, type, results: [], images: [], shoppingResults: [], countryCode, elapsedTime: 0, start });
}

});

app.get('/api/search', checkApiKey, async (req, res) => { const startTime = Date.now(); let query = req.query.query?.trim() || ''; const type = req.query.type || 'web'; const start = parseInt(req.query.start) || 1;

if (query.startsWith('!')) {
    query = query.substring(1).trim();
    const bangRedirects = {
        github: "https://github.com",
  gh: "https://github.com",
  google: "https://www.google.com",
  ph: "https://www.pornhub.com",
  youtube: "https://www.youtube.com",
  yt: "https://www.youtube.com",
  reddit: "https://www.reddit.com",
  stackoverflow: "https://stackoverflow.com",
  so: "https://stackoverflow.com",
  wikipedia: "https://www.wikipedia.org",
  wiki: "https://www.wikipedia.org",
  amazon: "https://www.amazon.com",
  imdb: "https://www.imdb.com",
  twitter: "https://twitter.com",
  fb: "https://facebook.com",
  instagram: "https://www.instagram.com",
  linkedin: "https://www.linkedin.com",
  pinterest: "https://www.pinterest.com",
  tiktok: "https://www.tiktok.com",
  githubissues: "https://github.com/issues",
  news: "https://news.google.com",
  map: "https://maps.google.com",
  spotify: "https://www.spotify.com",
  slack: "https://slack.com",
  discord: "https://discord.com",
  dc: "https://discord.com",
  medium: "https://medium.com",
  vimeo: "https://vimeo.com",
  whatsapp: "https://www.whatsapp.com",
  wp: "https://www.whatsapp.com",
  quora: "https://www.quora.com",
  snapchat: "https://www.snapchat.com"
    };
    if (bangRedirects[query.toLowerCase()]) {
        return res.redirect(bangRedirects[query.toLowerCase()]);
    }
}

let countryCode = 'N/A';
try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || '8.8.8.8';
    const response = await axios.get(`https://ipinfo.io/${ip}?token=${ipinfoToken}`);
    countryCode = response.data.country || 'N/A';
} catch (error) {
    console.error('Ülke kodu alınırken bir hata oluştu:', error.message);
}

try {
    const searchResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: { key: googleApiKey, cx: googleCx, q: query, start }
    });

    const results = (searchResponse.data.items || []).map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        rating: Math.floor(Math.random() * 10) + 1
    }));

    const images = (searchResponse.data.items || [])
        .filter(item => item.pagemap?.cse_image)
        .map(item => ({
            link: item.link,
            image: item.pagemap.cse_image[0]?.src || null
        }));

    const shoppingResults = (searchResponse.data.items || [])
        .map(item => ({
            product: item.pagemap?.product?.[0]?.name || null,
            link: item.link,
            image: item.pagemap?.cse_image?.[0]?.src || null
        }))
        .filter(item => item.product);

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);

    res.render('results', { query, type, results, images, shoppingResults, countryCode, elapsedTime, start });
} catch (error) {
    console.error('API çağrısı sırasında hata oluştu:', error.message);
    res.render('results', { query, type, results: [], images: [], shoppingResults: [], countryCode, elapsedTime: 0, start });
}

});
app.get('/api/search', checkApiKey, async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Arama sorgusu eksik!" });

    try {
        const searchResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: { key: googleApiKey, cx: googleCx, q: query }
        });

        const results = (searchResponse.data.items || []).map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet,
            rating: Math.floor(Math.random() * 10) + 1
        }));

        const images = (searchResponse.data.items || [])
            .filter(item => item.pagemap?.cse_image)
            .map(item => ({
                link: item.link,
                image: item.pagemap.cse_image[0]?.src
            }));

        const shoppingResults = (searchResponse.data.items || [])
            .map(item => ({
                product: item.pagemap?.product?.[0]?.name || null,
                link: item.link,
                image: item.pagemap?.cse_image?.[0]?.src || null
            }))
            .filter(item => item.product);

        res.json({ results, images, shoppingResults });
    } catch (error) {
        console.error('API çağrısı sırasında hata oluştu:', error.message);
        res.status(500).json({ error: "Bir hata oluştu." });
    }
});

app.get('/', async (req, res) => {
    res.render('index');
});

app.get('/manifesto', async (req, res) => {
    res.render('manifesto');
});

app.get('/iletisim', (req, res) => {
    res.render('iletisim', {messageSent: false});
});


app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send("Lütfen tüm alanları doldurun.");
    }

    
    await sendEmail(name, email, message);

    
    res.send("Mesajınız başarıyla gönderildi.");
    res.redirect('/iletisim');
});

app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});

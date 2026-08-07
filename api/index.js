

import multer from 'multer';

// ✅ إعداد multer للتخزين في الذاكرة
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ تحويل multer إلى middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  // إعدادات CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const path = req.url.replace('/api', '');
    const targetUrl = `https://e-commerce-api-3wara.vercel.app${path}`;

    console.log(`🔄 Proxying: ${req.method} ${req.url} → ${targetUrl}`);

    const contentType = req.headers['content-type'] || '';
    let body;
    let headers = {
      'Authorization': req.headers.authorization || '',
    };

    if (contentType.includes('multipart/form-data')) {
      // ✅ استخدام multer لمعالجة FormData
      await runMiddleware(req, res, upload.any());

      const formData = new FormData();
      
      // ✅ إضافة الحقول النصية
      Object.keys(req.body).forEach(key => {
        const value = req.body[key];
        if (Array.isArray(value)) {
          value.forEach(v => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });

      // ✅ إضافة الملفات
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          // ✅ تحويل Buffer إلى Blob
          const blob = new Blob([file.buffer], { 
            type: file.mimetype || 'application/octet-stream' 
          });
          formData.append(file.fieldname, blob, file.originalname);
        });
      }

      body = formData;
    } else {
      headers['Content-Type'] = 'application/json';
      if (req.method !== 'GET' && req.body) {
        body = JSON.stringify(req.body);
      }
    }

    // ✅ إرسال الطلب
    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    if (body) {
      fetchOptions.body = body;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    console.log(`✅ Response: ${response.status} from ${targetUrl}`);

    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
// export default async function handler(req, res) {
//   // إعدادات CORS
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   // التعامل مع طلبات OPTIONS (preflight)
//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   try {
//     // استخراج المسار من الرابط
//     // مثال: /api/auth/login → auth/login
//     // مثال: /api/orders/admin → orders/admin
//     const path = req.url.replace("/api", "");

//     // بناء الرابط الكامل للـ API الأصلي
//     const targetUrl = `https://e-commerce-api-3wara.vercel.app${path}`;

//     console.log(`🔄 Proxying: ${req.method} ${req.url} → ${targetUrl}`);

//     // إعداد خيارات الطلب
//     const fetchOptions = {
//       method: req.method,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: req.headers.authorization || "",
//       },
//     };

//     // إضافة الجسم (body) للطلبات التي ليست GET
//     if (req.method !== "GET" && req.body) {
//       fetchOptions.body = JSON.stringify(req.body);
//     }

//     // إرسال الطلب إلى الـ API الأصلي
//     const response = await fetch(targetUrl, fetchOptions);
//     const data = await response.json();

//     console.log(`✅ Response: ${response.status} from ${targetUrl}`);

//     // إرجاع الاستجابة للمتصفح
//     res.status(response.status).json(data);
//   } catch (error) {
//     console.error("❌ Proxy error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// }

import Busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false,
  },
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
      // ✅ استخدام busboy لمعالجة FormData
      const formData = new FormData();
      
      await new Promise((resolve, reject) => {
        const busboy = Busboy({ headers: req.headers });
        
        // معالجة الحقول النصية
        busboy.on('field', (fieldname, value) => {
          formData.append(fieldname, value);
        });
        
        // معالجة الملفات
        busboy.on('file', (fieldname, file, info) => {
          const { filename, mimeType } = info;
          const chunks = [];
          file.on('data', (chunk) => {
            chunks.push(chunk);
          });
          file.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const blob = new Blob([buffer], { type: mimeType || 'application/octet-stream' });
            formData.append(fieldname, blob, filename);
          });
        });
        
        busboy.on('error', (err) => {
          reject(err);
        });
        
        busboy.on('finish', () => {
          resolve();
        });
        
        req.pipe(busboy);
      });

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
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


import formidable from 'formidable';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false, // ✅ مهم: لتعطيل bodyParser الافتراضي
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

    // ✅ معالجة FormData بشكل صحيح
    let body;
    let headers = {
      'Authorization': req.headers.authorization || '',
    };

    const contentType = req.headers['content-type'] || '';

    if (contentType.includes('multipart/form-data')) {
      // ✅ استخدام formidable لمعالجة FormData
      const form = new IncomingForm();
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      // ✅ بناء FormData جديد لإرساله إلى الـ API الأصلي
      const formData = new FormData();
      
      // إضافة الحقول النصية
      Object.keys(fields).forEach(key => {
        const value = fields[key];
        if (Array.isArray(value)) {
          value.forEach(v => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });

      // إضافة الملفات
      Object.keys(files).forEach(key => {
        const file = files[key];
        if (Array.isArray(file)) {
          file.forEach(f => {
            formData.append(key, f, f.name);
          });
        } else if (file) {
          formData.append(key, file, file.name);
        }
      });

      body = formData;
      // لا نضيف Content-Type، سيتعامل معه fetch تلقائياً
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

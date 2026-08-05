import { db } from '../src/lib/db'

async function seed() {
  console.log('بدء إضافة البيانات الأولية...')

  // التحقق من وجود إعدادات
  let settings = await db.siteSettings.findFirst()
  if (!settings) {
    settings = await db.siteSettings.create({
      data: {
        heroTitle: 'مصنع مكة للثلاجات',
        heroSubtitle: 'روافد التبريد الحديثة - حلول تبريد متكاملة لكل القطاعات',
        heroImage: '',
        aboutTitle: 'من نحن',
        aboutText: 'مصنع مكة للثلاجات هو مصنع رائد في تصنيع الثلاجات التجارية والصناعية في المملكة العربية السعودية. تأسس المصنع برؤية واضحة لتقديم حلول تبريد مبتكرة وعالية الجودة تلبي احتياجات القطاعات المختلفة من المطاعم والفنادق والسوبر ماركت والمصانع. نعتمد على أحدث التقنيات العالمية في التصنيع مع فريق هندسي متخصص يضمن تقديم منتجات تجمع بين الكفاءة العالية والاستهلاك الاقتصادي للطاقة والمتانة في التشغيل. نلتزم بأعلى معايير الجودة العالمية ونعمل بشكل مستمر على تطوير منتجاتنا لمواكبة أحدث المستجدات في مجال التبريد.',
        aboutImage: '',
        phone: '+966 12 345 6789',
        email: 'info@meccarefrigerators.com',
        address: '  المنطقة الصناعية',
        workingHours: 'السبت - الخميس: 9 صباحاً - 6 مساءً',
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        whatsapp: '+966500000000',
        adminPassword: 'admin123',
      },
    })
    console.log('تم إنشاء الإعدادات الافتراضية')
  } else {
    console.log('الإعدادات موجودة بالفعل')
  }

  // التحقق من وجود منتجات
  const existingProducts = await db.product.count()
  if (existingProducts === 0) {
    await db.product.createMany({
      data: [
        {
          name: 'ثلاجة عرض تجارية زجاجية 1200 لتر',
          description: 'ثلاجة عرض زجاجية احترافية مثالية للسوبر ماركت والبقالات. تصميم أنيق مع إضاءة LED داخلية موفرة للطاقة. نظام تبريد موزع بالتساوي للحفاظ على درجة حرارة ثابتة. الأرفف قابلة للتعديل لتناسب جميع أنواع المنتجات.',
          price: 8500,
          imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop',
          category: 'ثلاجات عرض',
          capacity: '1200 لتر',
          temperature: 'من +2 إلى +8 درجة مئوية',
          power: '450 واط',
          featured: true,
          inStock: true,
        },
        {
          name: 'ثلاجة تجارية كبيرة 2000 لتر',
          description: 'ثلاجة تجارية كبيرة الحجم مصممة للمطاعم والفنادق والكافيهات. مساحة تخزين واسعة مع رفوف من الستانلس ستيل المقاوم للصدأ. نظام تبريد قوي وفعال مع عزل حراري عالي الجودة. مزودة بضاغط قوي يضمن أداءً مستقراً حتى في درجات الحرارة العالية.',
          price: 12500,
          imageUrl: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=800&h=600&fit=crop',
          category: 'ثلاجات تجارية',
          capacity: '2000 لتر',
          temperature: 'من -2 إلى +8 درجة مئوية',
          power: '650 واط',
          featured: true,
          inStock: true,
        },
        {
          name: 'فريزر أفقي صناعي 700 لتر',
          description: 'فريزر أفقي صناعي بفتح علوية مثالي للمحلات والمطاعم. سعة كبيرة مع عزل حراري عالي الكفاءة. مزود بسلة تخزين قابلة للإزالة لسهولة التنظيم. يعمل بكفاءة عالية حتى في درجات الحرارة المنخفضة جداً مع استهلاك طاقة اقتصادي.',
          price: 6200,
          imageUrl: 'https://images.unsplash.com/photo-1567433903232-68324e4c8c2e?w=800&h=600&fit=crop',
          category: 'فريزر',
          capacity: '700 لتر',
          temperature: 'من -18 إلى -25 درجة مئوية',
          power: '380 واط',
          featured: true,
          inStock: true,
        },
        {
          name: 'ثلاجة عرض كيك ومخبوزات',
          description: 'ثلاجة عرض متخصصة للكيك والمخبوزات والحلويات. تصميم أنيق بإضاءة LED دافئة تبرز شكل المنتجات. التحكم الرقمي بدرجة الحرارة مع شاشة عرض واضحة. زجاج مقاوم للضباب لرؤية واضحة دائماً.',
          price: 4800,
          imageUrl: 'https://images.unsplash.com/photo-1556909114-44e3e9399a2e?w=800&h=600&fit=crop',
          category: 'ثلاجات عرض',
          capacity: '600 لتر',
          temperature: 'من +2 إلى +6 درجة مئوية',
          power: '280 واط',
          featured: false,
          inStock: true,
        },
        {
          name: 'ثلاجة لحوم تجارية ستانلس ستيل',
          description: 'ثلاجة لحوم تجارية مصنوعة بالكامل من الستانلس ستيل المقاوم للصدأ. مثالية لمحلات الجزارة والسلطات. تصميم صحي يمنع تلوث المنتجات مع سهولة التنظيف. تبريد قوي وسريع للحفاظ على نضارة اللحوم.',
          price: 9300,
          imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop',
          category: 'ثلاجات تجارية',
          capacity: '1500 لتر',
          temperature: 'من -2 إلى +4 درجة مئوية',
          power: '550 واط',
          featured: true,
          inStock: true,
        },
        {
          name: 'فريزر عرض عمودي زجاجي',
          description: 'فريزر عرض عمودي بزجاج شفاف مثالي لمتاجر الآيس كريم والمنتجات المجمدة. تبريد عميق مع إضاءة LED داخلية. تصميم عصري يجذب العملاء ويزيد من المبيعات. أرفف قابلة للتعديل لتنظيم مختلف الأحجام.',
          price: 7800,
          imageUrl: 'https://images.unsplash.com/photo-1565636192335-c2f0f4ba2e21?w=800&h=600&fit=crop',
          category: 'فريزر',
          capacity: '900 لتر',
          temperature: 'من -18 إلى -22 درجة مئوية',
          power: '420 واط',
          featured: false,
          inStock: true,
        },
        {
          name: 'ثلاجة مشروبات تجارية',
          description: 'ثلاجة مشروبات تجارية بتصميم عمودي أنيق. باب زجاجي شفاف مع إضاءة LED داخلية. تبريد سريع ومتساوي لجميع الرفوف. مثالية للمطاعم والكافيهات ومحلات البقالة.',
          price: 5400,
          imageUrl: 'https://images.unsplash.com/photo-1612540139150-4e7fa8a3f0a4?w=800&h=600&fit=crop',
          category: 'ثلاجات عرض',
          capacity: '800 لتر',
          temperature: 'من +1 إلى +8 درجة مئوية',
          power: '320 واط',
          featured: false,
          inStock: true,
        },
        {
          name: 'غرفة تبريد صناعية كبيرة',
          description: 'غرفة تبريد صناعية كاملة بحجم مخصص. مصممة للمصانع الكبرى ومخازن الأغذية. تركيب احترافي مع عزل حراري بسمك 10 سم. نظام تبريد مزدوج لضمان استقرار درجة الحرارة. التحكم الرقمي الكامل مع نظام إنذار.',
          price: 45000,
          imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop',
          category: 'غرف تبريد',
          capacity: 'حسب الطلب',
          temperature: 'من -10 إلى +10 درجة مئوية',
          power: '3000 واط',
          featured: true,
          inStock: true,
        },
      ],
    })
    console.log('تم إضافة المنتجات الأولية بنجاح')
  } else {
    console.log(`يوجد ${existingProducts} منتج بالفعل`)
  }

  console.log('تم الانتهاء من إضافة البيانات الأولية')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

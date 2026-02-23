// 1. نظام التنقل بين التبويبات (زي ما هو)
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active-section'));
    document.getElementById(sectionId).classList.add('active-section');
    
    // تحديث الزر النشط
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // محاولة تحديد الزر النشط (للتأكد من عدم حدوث خطأ إذا تم الاستدعاء بدون حدث)
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// 2. معالجة الفورم (Formspree)
async function handleFormSubmit(event, formId) {
    event.preventDefault();
    const form = document.getElementById(formId);
    const statusDiv = form.querySelector('.status-msg');
    const btn = form.querySelector('button');
    const originalBtnText = btn.innerText;

    btn.innerText = "⏳ جاري..";
    btn.disabled = true;

    const data = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            statusDiv.innerHTML = "الرسايل واقفه مؤقتا";
            statusDiv.className = "status-msg success-msg";
            form.reset();
        } else {
            statusDiv.innerHTML = "❌ في مشكلة.";
            statusDiv.className = "status-msg error-msg";
        }
    } catch (error) {
        statusDiv.innerHTML = "❌ تأكد من النت.";
        statusDiv.className = "status-msg error-msg";
    }

    setTimeout(() => {
        btn.innerText = originalBtnText;
        btn.disabled = false;
        statusDiv.innerHTML = ""; // إخفاء الرسالة بعد فترة
    }, 3000);
}

document.getElementById('msg-form').addEventListener('submit', (e) => handleFormSubmit(e, 'msg-form'));
document.getElementById('feedback-form').addEventListener('submit', (e) => handleFormSubmit(e, 'feedback-form'));


// ==========================================
// 🔥 3. محرك النار الاحترافي (120 FPS Optimized)
// ==========================================

const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');

// ضبط أبعاد الكانفاس لتملأ الشاشة بدقة عالية
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
const particleCount = 450; // 🔥 عدد جزيئات ضخم لحركة ناعمة

class Particle {
    constructor() {
        this.reset(true); // true تعني وضع ابتدائي عشوائي في الشاشة
    }

    reset(initial = false) {
        this.x = Math.random() * canvas.width;
        // إذا كان بدأ التشغيل، نوزعهم في الشاشة، غير كده يبدأوا من تحت
        this.y = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 50;
        
        // 🚀 سرعة عالية جداً لمحاكاة الـ 120 فريم
        this.speedY = Math.random() * 7 + 3; // سرعة الصعود (سريعة)
        this.speedX = (Math.random() - 0.5) * 2; // اهتزاز جانبي
        
        this.size = Math.random() * 4 + 2; // حجم الجزيئات
        this.life = Math.random() * 100 + 50; // عمر الجزيء
        this.maxLife = this.life;
        
        // ألوان عشوائية بين الأحمر والبرتقالي والأصفر
        this.colorType = Math.random(); 
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        
        // تقليل العمر
        this.life -= 1.8; // معدل الاختفاء (كل ما الرقم زاد، النار بقيت أقصر وأسرع)

        // تغيير الحجم أثناء الصعود (يصغر كأنه دخان)
        if (this.life < 50) {
            this.size -= 0.05;
        }

        // إعادة التدوير لما يموت أو يخرج برا الشاشة
        if (this.life <= 0 || this.size <= 0) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
        
        // حساب الشفافية بناءً على العمر المتبقي
        const opacity = this.life / this.maxLife;

        // تلوين ذكي (قلب النار أصفر، والأطراف حمراء)
        if (this.life > 70) {
            ctx.fillStyle = `rgba(255, 200, 50, ${opacity})`; // أصفر مشع
        } else if (this.life > 40) {
            ctx.fillStyle = `rgba(255, 100, 0, ${opacity})`; // برتقالي
        } else {
            ctx.fillStyle = `rgba(200, 20, 20, ${opacity * 0.5})`; // أحمر داكن (دخان)
        }
        
        ctx.fill();
        
        // إضافة توهج (Glow Effect) خفيف للجزيئات الكبيرة
        if (this.size > 3) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(255, 69, 0, 0.5)";
        } else {
            ctx.shadowBlur = 0;
        }
    }
}

// إنشاء الجزيئات
function initFire() {
    particles.length = 0; // تفريغ المصفوفة القديمة
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// حلقة الأنيميشن (تلقائياً تعمل بأقصى فريمات تدعمها شاشتك)
function animateFire() {
    // مسح الشاشة مع تأثير "ذيل" خفيف للحركة (Motion Blur)
    ctx.fillStyle = 'rgba(10, 10, 15, 0.2)'; // الخلفية مش بتمسح 100% عشان تعمل أثر
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // تحديث ورسم كل جزيء
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    requestAnimationFrame(animateFire);
}

// التشغيل
initFire();

animateFire();

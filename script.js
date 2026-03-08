// متغيرات اللعبة
let currentLevel = ""
let currentQuestions = []
let currentQuestion = null
let usedQuestions = []
let timer = 30
let interval = null
let totalQuestions = 0
let answeredQuestions = 0

// تهيئة GSAP و ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

// رسوم متحركة عند تحميل الصفحة
window.addEventListener('load', () => {
    // رسوم متحركة للعنوان الرئيسي
    gsap.from(".main-title", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
    })
    
    gsap.from(".sub-title", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.3,
        ease: "power4.out"
    })
    
    gsap.from(".hero-text", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.6,
        ease: "power4.out"
    })
    
    gsap.from(".cta-button", {
        scale: 0,
        opacity: 0,
        duration: 1,
        delay: 0.9,
        ease: "back.out(1.7)"
    })
    
    // رسوم متحركة للصور العائمة
    gsap.from(".floating-img", {
        scale: 0,
        rotation: 360,
        duration: 1.5,
        stagger: 0.3,
        ease: "back.out(1.7)"
    })
    
    // رسوم متحركة لعناصر الهيدر
    gsap.from("nav", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    })
})

// رسوم متحركة عند التمرير
gsap.utils.toArray('.timeline-item').forEach(item => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        x: -100,
        opacity: 0,
        duration: 1
    })
})

gsap.utils.toArray('.woman-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2,
        ease: "back.out(1.7)"
    })
})

gsap.utils.toArray('.level-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2
    })
})

// دوال التمرير
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

// قائمة طعام الجوال
function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active')
}

// إغلاق القائمة عند النقر على رابط
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active')
    })
})

// دوال اللعبة
function startGame(level) {
    currentLevel = level
    currentQuestions = [...questions[level]]
    usedQuestions = []
    answeredQuestions = 0
    totalQuestions = currentQuestions.length
    
    // تحديث شارة المستوى
    const levelNames = {
        easy: 'سهل',
        medium: 'متوسط',
        hard: 'صعب'
    }
    document.getElementById('currentLevel').innerText = `المستوى: ${levelNames[level]}`
    
    // إخفاء قسم المستويات وإظهار اللعبة
    document.querySelector('.levels').style.display = 'none'
    document.getElementById('game').classList.remove('hidden')
    
    // إظهار الأزرار في حالة كانت مخفية من لعبة سابقة
    document.querySelector('.show-answer-btn').style.display = 'inline-flex'
    document.querySelector('.next-btn').style.display = 'inline-flex'
    
    // إزالة أي كأس سابق
    const oldTrophy = document.querySelector('.fa-trophy')
    if (oldTrophy) {
        oldTrophy.remove()
    }
    
    // بدء أول سؤال
    nextQuestion()
    
    // رسوم متحركة لظهور اللعبة
    gsap.from('.game', {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    })
    
    // التمرير إلى قسم اللعبة
    setTimeout(() => {
        document.getElementById('game').scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
}

function nextQuestion() {
    // إيقاف المؤقت الحالي
    if (interval) {
        clearInterval(interval)
    }
    
    // التحقق من انتهاء الأسئلة
    if (usedQuestions.length >= totalQuestions) {
        endGame()
        return
    }
    
    // اختيار سؤال عشوائي لم يُستخدم بعد
    let availableQuestions = currentQuestions.filter(q => !usedQuestions.includes(q))
    if (availableQuestions.length === 0) {
        endGame()
        return
    }
    
    currentQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
    usedQuestions.push(currentQuestion)
    
    // عرض السؤال
    document.getElementById('question').innerText = currentQuestion.q
    document.getElementById('answer').innerText = ''
    document.getElementById('answerBox').style.opacity = '0.5'
    
    // تحديث شريط التقدم
    answeredQuestions++
    let progress = (answeredQuestions / totalQuestions) * 100
    document.getElementById('progressBar').style.width = `${progress}%`
    
    // إعادة ضبط المؤقت
    timer = 30
    document.getElementById('timer').innerText = timer
    
    // بدء المؤقت الجديد
    startTimer()
    
    // رسوم متحركة للسؤال الجديد
    gsap.from('.question-container', {
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
    })
}

function startTimer() {
    // تحديث الدائرة
    updateTimerCircle()
    
    interval = setInterval(() => {
        timer--
        document.getElementById('timer').innerText = timer
        updateTimerCircle()
        
        if (timer <= 0) {
            clearInterval(interval)
            showAnswer()
            
            // إضافة رسوم متحركة عند انتهاء الوقت
            gsap.to('.timer-circle', {
                scale: [1, 1.2, 1],
                duration: 0.5,
                ease: "power2.inOut"
            })
        }
    }, 1000)
}

function updateTimerCircle() {
    let percentage = (timer / 30) * 360
    document.querySelector('.timer-circle').style.background = 
        `conic-gradient(var(--pink-500) ${percentage}deg, var(--pink-200) ${percentage}deg)`
}

function showAnswer() {
    if (currentQuestion) {
        document.getElementById('answer').innerText = currentQuestion.a
        document.getElementById('answerBox').style.opacity = '1'
        
        // إيقاف المؤقت
        if (interval) {
            clearInterval(interval)
        }
        
        // رسوم متحركة للإجابة
        gsap.from('#answerBox', {
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        })
    }
}

function endGame() {
    // عرض رسالة نهاية اللعبة
    document.getElementById('question').innerHTML = '🎉 تهانينا! لقد أكملت جميع الأسئلة 🎉'
    document.getElementById('answer').innerText = ''
    document.getElementById('timer').innerText = '0'
    document.querySelector('.show-answer-btn').style.display = 'none'
    document.querySelector('.next-btn').style.display = 'none'
    
    // إيقاف المؤقت
    if (interval) {
        clearInterval(interval)
    }
    
    // رسوم متحركة لرسالة النهاية
    gsap.to('.question-container', {
        scale: 1.05,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    })
    
    // إضافة كأس أو جائزة
    const trophy = document.createElement('i')
    trophy.className = 'fas fa-trophy'
    trophy.style.fontSize = '4rem'
    trophy.style.color = 'var(--pink-500)'
    trophy.style.margin = '1rem 0'
    trophy.style.animation = 'glow 2s ease-in-out infinite alternate'
    document.querySelector('.question-container').appendChild(trophy)
}

function backToLevels() {
    // إيقاف المؤقت
    if (interval) {
        clearInterval(interval)
    }
    
    // إخفاء اللعبة وإظهار المستويات
    document.getElementById('game').classList.add('hidden')
    document.querySelector('.levels').style.display = 'block'
    
    // إعادة تعيين عرض الأزرار
    document.querySelector('.show-answer-btn').style.display = 'inline-flex'
    document.querySelector('.next-btn').style.display = 'inline-flex'
    
    // إزالة الكأس إذا كان موجوداً
    const trophy = document.querySelector('.fa-trophy')
    if (trophy) {
        trophy.remove()
    }
    
    // إعادة ضبط المتغيرات
    currentLevel = ""
    currentQuestions = []
    usedQuestions = []
    answeredQuestions = 0
    
    // رسوم متحركة للعودة
    gsap.from('.levels', {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    })
    
    // التمرير إلى قسم المستويات
    document.getElementById('levels').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// تأثيرات إضافية عند التمرير
window.addEventListener('scroll', () => {
    let scrolled = window.pageYOffset
    let hero = document.querySelector('.hero')
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px'
    }
})

// رسوم متحركة للبطاقات عند المرور عليها
document.querySelectorAll('.level-card, .woman-card, .timeline-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            scale: 1.03,
            duration: 0.3,
            ease: "power2.out"
        })
    })
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        })
    })
})

// إضافة تأثير النقر على البطاقات
document.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('click', function() {
        gsap.to(this, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        })
    })
})

// معالجة أخطاء تحميل الصور
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/300x300/FFB6C1/FF1493?text=صورة+المرأة'
    })
})

// تحديث السنة في التذييل
document.querySelector('footer p').innerHTML = `جميع الحقوق محفوظة &copy; 2026 - يوم المرأة العالمي`
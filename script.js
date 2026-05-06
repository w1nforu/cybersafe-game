//бургер
const menuToggle = document.getElementById('m-menu-toggle');
const menuOverlay = document.getElementById('m-menu-overlay');

menuToggle.addEventListener('click', () => {
    // Переключаем классы
    menuToggle.classList.toggle('open');
    menuOverlay.classList.toggle('active');
    
    // Чтобы страница под меню не крутилась
    if (menuOverlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Закрытие при клике на ссылку
document.querySelectorAll('.m-menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});
//слайдер
document.addEventListener("DOMContentLoaded", function() {
    const swiper = new Swiper(".mySwiper", {
        // Базовые настройки
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        
        // Включаем все возможные методы касания
        touchStartPreventDefault: false, // Важно для кликов по кнопкам
        allowTouchMove: true,
        grabCursor: true,
        
        // Пагинация
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },

        // Настройки для корректного старта на мобилках
        observer: true,
        observeParents: true,
        
        on: {
            init: function () {
                console.log('Swiper initialized'); // Проверь в консоли (F12), появилось ли это
            },
        },
    });

    // Принудительный пересчет через полсекунды (костыль, который реально спасает)
    setTimeout(() => {
        swiper.update();
    }, 500);
});
//вход выход
document.addEventListener("DOMContentLoaded", function() {
    const authModal = document.getElementById('authModal');
    const authForm = document.getElementById('authForm');
    const toggleLink = document.getElementById('toggleAuth');
    const authTitle = document.getElementById('authTitle');
    const authActionInput = document.getElementById('authAction');
    const closeBtn = document.getElementById('closeAuth');
    const mobileAuthBtn = document.querySelector('.m-btn-auth');
    
    // Флаг этапа (отправлен код или нет)
    let isCodeSent = false;

    // --- 1. Функция показа сообщений ---
    function showAuthMessage(text, type) {
        const msgBlock = document.getElementById('authStatusMsg');
        if (!msgBlock) return;

        msgBlock.innerText = text;
        msgBlock.style.display = 'block';
        msgBlock.className = 'auth-status-msg ' + type; 
        
        if (type !== 'success') {
            setTimeout(() => {
                msgBlock.style.display = 'none';
            }, 5000);
        }
    }

    // --- 2. Проверка статуса авторизации ---
    function checkLoginStatus() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            mobileAuthBtn.innerText = 'Выйти';
            mobileAuthBtn.classList.add('logout-btn-red');
        } else {
            mobileAuthBtn.innerText = 'Войти';
            mobileAuthBtn.classList.remove('logout-btn-red');
        }
    }
    checkLoginStatus();

    // --- 3. Логика кнопки мобильного меню ---
    mobileAuthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (localStorage.getItem('isLoggedIn') === 'true') {
            if(confirm('Вы уверены, что хотите выйти?')) {
                localStorage.removeItem('isLoggedIn');
                location.reload();
            }
        } else {
            authModal.classList.add('m-auth-active');
            const msgBlock = document.getElementById('authStatusMsg');
            if(msgBlock) msgBlock.style.display = 'none';

            // Закрываем бургер-меню
            const menuOverlay = document.getElementById('m-menu-overlay');
            const menuToggle = document.getElementById('m-menu-toggle');
            if(menuOverlay) menuOverlay.classList.remove('active');
            if(menuToggle) menuToggle.classList.remove('open');
            document.body.style.overflow = 'hidden';
        }
    });

    // --- 4. Закрытие модалки ---
    function resetAuthForm() {
        isCodeSent = false;
        if(document.getElementById('mainInputs')) document.getElementById('mainInputs').style.display = 'block';
        if(document.getElementById('verificationSection')) document.getElementById('verificationSection').style.display = 'none';
        const submitBtn = document.querySelector('.auth-submit-btn');
        if(submitBtn) submitBtn.innerText = 'Продолжить';
        authForm.reset();
    }

    closeBtn.onclick = () => {
        authModal.classList.remove('m-auth-active');
        document.body.style.overflow = 'auto';
        resetAuthForm();
    };

    window.onclick = (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('m-auth-active');
            document.body.style.overflow = 'auto';
            resetAuthForm();
        }
    };

    // --- 5. Переключение Вход / Регистрация ---
    let isLogin = true;
    toggleLink.onclick = (e) => {
        e.preventDefault();
        isLogin = !isLogin;
        
        const msgBlock = document.getElementById('authStatusMsg');
        if(msgBlock) msgBlock.style.display = 'none';

        authTitle.innerText = isLogin ? "Вход" : "Регистрация";
        toggleLink.innerText = isLogin ? "Зарегистрироваться" : "Войти";
        authActionInput.value = isLogin ? "login" : "register";
        resetAuthForm(); // Сбрасываем этапы при переключении
    };

    // --- 6. Отправка формы (Интегрированная логика с кодом) ---
    authForm.onsubmit = async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('authEmail').value;
        const pass = document.getElementById('authPass').value;
        const action = authActionInput.value;
        // Проверяем наличие поля кода, если его нет — отправляем пустую строку
        const codeInput = document.getElementById('authCode');
        const code = codeInput ? codeInput.value : '';

        const formData = new FormData();
        formData.append('email', email);
        formData.append('pass', pass);
        formData.append('action', action);
        formData.append('code', code);

        try {
            const response = await fetch('auth.php', { method: 'POST', body: formData });
            const result = (await response.text()).trim();

            if (result === 'send_code') {
                // ЭТАП 1: Код записан в файл, показываем поле ввода
                isCodeSent = true;
                document.getElementById('mainInputs').style.display = 'none';
                document.getElementById('verificationSection').style.display = 'block';
                document.querySelector('.auth-submit-btn').innerText = 'Подтвердить код';
                showAuthMessage("Код подтверждения отправлен в mail_log.txt", "success");
            } 
            else if (result === 'success_auth') {
                // ЭТАП 2: Успешный вход/регистрация
                localStorage.setItem('isLoggedIn', 'true');
                showAuthMessage("С возвращением! Сейчас вы будете перенаправлены...", "success");
                setTimeout(() => location.reload(), 1500); 
            } 
            else if (result === 'wrong_code') {
                showAuthMessage("Неверный код! Проверьте mail_log.txt", "error");
            } 
            else if (result === 'error') {
                showAuthMessage("Неверный email или пароль.", "error");
            } 
            else {
                showAuthMessage("Ошибка! Проверьте введенные данные.", "error");
            }
        } catch (error) {
            showAuthMessage("Ошибка соединения с сервером.", "error");
        }
    };
});

/* --- МОДАЛЬНОЕ ОКНО "ПОДРОБНЕЕ" (МЕТОДИКА) --- */

// 1. Открытие модалки
function openMethodModal() {
    const modal = document.getElementById('method-modal');
    if (modal) {
        modal.classList.add('active');
        // Убираем скролл основной страницы, чтобы не дергалась
        document.body.style.overflow = 'hidden';
    }
}

// 2. Закрытие модалки
function closeMethodModal() {
    const modal = document.getElementById('method-modal');
    if (modal) {
        modal.classList.remove('active');
        // Возвращаем скролл
        document.body.style.overflow = '';
    }
}

// 3. Закрытие при клике на темную область (оверлей)
// Ждем загрузки документа, чтобы найти элемент
document.addEventListener("DOMContentLoaded", function() {
    const mmOverlay = document.getElementById('method-modal');
    if (mmOverlay) {
        mmOverlay.addEventListener('click', function(e) {
            // Если кликнули именно по фону, а не по карточке внутри
            if (e.target === mmOverlay) {
                closeMethodModal();
            }
        });
    }
});

function openQuiz() {
    document.getElementById('quiz-modal').style.display = 'flex';
}

function closeQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
}

function nextStep(step) {
    // Скрываем все шаги
    document.querySelectorAll('.quiz-step').forEach(el => el.classList.remove('active'));
    // Показываем нужный
    document.getElementById('quiz-step-' + step).classList.add('active');
}

// логика увед
document.addEventListener("DOMContentLoaded", function() { 
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'success') {
        const alert = document.getElementById('success-alert');
        
        if (alert) { 
            alert.style.display = 'block';

            // Скрыть через 5 секунд
            setTimeout(() => {
                alert.style.animation = 'fadeOut 0.5s ease-in forwards';
                setTimeout(() => {
                    alert.style.display = 'none';
                }, 500);
            }, 5000);

            // Очистка URL
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }
}); 

document.addEventListener('DOMContentLoaded', function() {
    const chatOverlayEl = document.getElementById('ispeak-chat-overlay');
    const chatOpenBtn = document.getElementById('ispeak-open-chat');
    const chatCloseBtn = document.getElementById('ispeak-close-chat');
    const chatMsgBox = document.getElementById('ispeak-msg-box');
    const chatActionsCont = document.getElementById('ispeak-actions-container');
    const chatTypingInd = document.getElementById('ispeak-typing');

    let isChatInitialized = false;

    // ПОЛНАЯ БАЗА ДАННЫХ КУРСОВ И КОНТАКТОВ
    const chatDataConfig = {
        mainMenu: [
            { text: "Сколько стоит курс", icon: "fa-tag" },
            { text: "Какие есть курсы", icon: "fa-book" },
            { text: "Связаться с поддержкой", icon: "fa-headset" },
            { text: "График работы", icon: "fa-clock" },
            { text: "Наш адрес", icon: "fa-location-dot" }
        ],
        responses: {
            "Сколько стоит курс": "Цены на обучение:\n\n• General English — 18 000 ₸/мес\n• IELTS Master — 35 000 ₸/мес\n• Kids Academy — 15 000 ₸/мес\n• Individual — 50 000 ₸/мес\n• Business English — 25 000 ₸/мес\n• Корпоративное обучение — 12 000 ₸/чел",
            "Какие есть курсы": "Наши программы:\n\n• General English — общий английский\n• IELTS Master — подготовка к IELTS\n• Kids Academy — для детей 6–12 лет\n• Individual — индивидуально\n• Business English — для карьеры\n• Корпоративное обучение — для бизнеса",
            "Связаться с поддержкой": "Контакты:\n\nОбщий отдел: +7 (7162) 55-55-55\nWhatsApp: +7 (707) 123-45-67\nКорпоративный отдел: +7 (701) 999-88-77",
            "График работы": "Мы открыты:\n\nПн–Пт: 09:00 – 21:00\nСб: 10:00 – 16:00\nВс: выходной",
            "Наш адрес": "Ждем вас по адресу:\n\nг. Кокшетау, ул. Абая, 123"
        }
    };

    function createChatMessage(text, type) {
        if (!chatMsgBox) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `ispeak-msg-base ispeak-msg-${type}`;
        msgDiv.innerText = text;
        chatMsgBox.insertBefore(msgDiv, chatTypingInd);
        
        // Плавная прокрутка к новому сообщению
        chatMsgBox.scrollTo({
            top: chatMsgBox.scrollHeight,
            behavior: 'smooth'
        });
    }

    function showChatTyping(callback) {
        if (!chatTypingInd) return;
        chatTypingInd.style.display = 'flex';
        chatMsgBox.scrollTop = chatMsgBox.scrollHeight;
        setTimeout(() => {
            chatTypingInd.style.display = 'none';
            callback();
        }, 800);
    }

    function renderChatMenu() {
        if (!chatActionsCont) return;
        chatActionsCont.innerHTML = '';
        chatDataConfig.mainMenu.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'ispeak-action-btn';
            btn.innerHTML = `<i class="fa-solid ${item.icon}"></i> ${item.text}`;
            btn.onclick = () => {
                chatActionsCont.style.pointerEvents = 'none'; // Блокируем спам кликов
                createChatMessage(item.text, 'user');
                showChatTyping(() => {
                    createChatMessage(chatDataConfig.responses[item.text], 'bot');
                    chatActionsCont.style.pointerEvents = 'auto';
                });
            };
            chatActionsCont.appendChild(btn);
        });
    }

    // ЛОГИКА ОТКРЫТИЯ
    if (chatOpenBtn) {
        chatOpenBtn.onclick = () => {
            chatOverlayEl.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Запрещаем скролл сайта под чатом
            
            if (!isChatInitialized) {
                showChatTyping(() => {
                    createChatMessage("Здравствуйте! Чем могу помочь?", "bot");
                    renderChatMenu();
                    isChatInitialized = true;
                });
            }
        };
    }

    // ЛОГИКА ЗАКРЫТИЯ
    if (chatCloseBtn) {
        chatCloseBtn.onclick = () => {
            chatOverlayEl.style.display = 'none';
            document.body.style.overflow = ''; // Возвращаем скролл сайта
        };
    }

    // ЗАКРЫТИЕ ПО КЛИКУ НА ФОН
    window.addEventListener('click', (event) => {
        if (event.target == chatOverlayEl) {
            chatOverlayEl.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});
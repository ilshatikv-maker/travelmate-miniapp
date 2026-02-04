cat > app.js << 'EOF'
// Telegram Web App API
const tg = window.Telegram.WebApp;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Раскрываем приложение на весь экран
    tg.expand();
    
    // Показываем основную кнопку
    tg.MainButton.setText('Создать поездку').show();
    
    // Обработчики событий
    setupEventListeners();
    
    console.log('TravelMate Mini App загружен!');
    showNotification('Добро пожаловать в TravelMate!');
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопка "Новая поездка"
    document.getElementById('new-trip-btn').addEventListener('click', function() {
        showTripForm();
    });
    
    // Кнопка "Погода"
    document.getElementById('weather-btn').addEventListener('click', function() {
        showNotification('Функция погоды скоро появится!');
    });
    
    // Кнопка "Отмена" в форме
    document.getElementById('cancel-btn').addEventListener('click', function() {
        hideTripForm();
    });
    
    // Кнопка "Сохранить" в форме
    document.getElementById('save-trip-btn').addEventListener('click', function() {
        saveTrip();
    });
    
    // Основная кнопка Telegram
    tg.MainButton.onClick(function() {
        showTripForm();
    });
}

// Показать форму создания поездки
function showTripForm() {
    document.getElementById('trip-form').style.display = 'block';
    document.querySelector('.quick-actions').style.display = 'none';
    tg.MainButton.hide();
}

// Скрыть форму
function hideTripForm() {
    document.getElementById('trip-form').style.display = 'none';
    document.querySelector('.quick-actions').style.display = 'block';
    tg.MainButton.setText('Создать поездку').show();
}

// Сохранить поездку
function saveTrip() {
    const tripName = document.getElementById('trip-name').value;
    const destination = document.getElementById('destination').value;
    
    if (!tripName || !destination) {
        showNotification('Заполните все поля!');
        return;
    }
    
    // Создаем новую карточку поездки
    const tripsList = document.getElementById('trips-list');
    const newTrip = document.createElement('div');
    newTrip.className = 'trip-card';
    newTrip.innerHTML = `
        <div class="trip-header">
            <h3>${tripName}</h3>
            <span class="trip-status active">Новая</span>
        </div>
        <div class="trip-details">
            <p><i class="fas fa-map-marker-alt"></i> ${destination}</p>
            <p><i class="fas fa-calendar"></i> ${new Date().toLocaleDateString('ru-RU')}</p>
            <p><i class="fas fa-dollar-sign"></i> Бюджет: $0</p>
        </div>
    `;
    
    // Добавляем в начало списка
    tripsList.prepend(newTrip);
    
    // Очищаем форму
    document.getElementById('trip-name').value = '';
    document.getElementById('destination').value = '';
    
    // Скрываем форму
    hideTripForm();
    
    // Показываем уведомление
    showNotification('Поездка создана успешно!');
    
    // Отправляем данные в Telegram (если нужно)
    const tripData = {
        action: 'create_trip',
        name: tripName,
        destination: destination,
        timestamp: new Date().toISOString()
    };
    
    // tg.sendData(JSON.stringify(tripData));
}

// Показать уведомление
function showNotification(text) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = text;
    notification.classList.add('show');
    
    setTimeout(function() {
        notification.classList.remove('show');
    }, 3000);
}

// Получить данные пользователя из Telegram
function getUserInfo() {
    if (tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        return {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username
        };
    }
    return null;
}

// Пример использования данных пользователя
const user = getUserInfo();
if (user) {
    console.log('Пользователь

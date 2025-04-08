/**
 * XRay Global - فایل جاوااسکریپت اصلی
 * نسخه: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // تغییر وضعیت منوی کناری
    const toggleSidebar = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const header = document.getElementById('header');

    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            header.classList.toggle('expanded');
        });
    }

    // کنترل سرور پنتاهو (فقط برای مدیران)
    const pentahoServerControl = document.getElementById('pentaho-server-control');
    const pentahoServerStatusCard = document.getElementById('pentaho-server-status-card');
    const serverStatusLoading = document.getElementById('server-status-loading');
    const serverStatusContent = document.getElementById('server-status-content');
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    const startServerBtn = document.getElementById('start-server');
    const stopServerBtn = document.getElementById('stop-server');

    if (pentahoServerControl && pentahoServerStatusCard) {
        // بررسی وضعیت سرور پنتاهو
        checkServerStatus();

        // نمایش/مخفی کردن کارت وضعیت سرور
        pentahoServerControl.addEventListener('click', function(e) {
            e.preventDefault();
            pentahoServerStatusCard.style.display = 
                pentahoServerStatusCard.style.display === 'none' ? 'block' : 'none';
        });

        // دکمه راه‌اندازی سرور
        if (startServerBtn) {
            startServerBtn.addEventListener('click', function() {
                serverStatusLoading.style.display = 'block';
                serverStatusContent.style.display = 'none';
                
                fetch('/api/pentaho/start')
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'starting') {
                            showNotification('سرور XRay Global در حال راه‌اندازی است. این فرآیند ممکن است چند دقیقه طول بکشد.', 'info');
                            // بررسی وضعیت سرور هر 10 ثانیه
                            let checkInterval = setInterval(() => {
                                fetch('/api/pentaho/status')
                                    .then(response => response.json())
                                    .then(statusData => {
                                        if (statusData.status === 'online') {
                                            clearInterval(checkInterval);
                                            updateServerStatusUI('online');
                                            showNotification('سرور XRay Global با موفقیت راه‌اندازی شد!', 'success');
                                        }
                                    })
                                    .catch(err => {
                                        console.error('خطا در بررسی وضعیت سرور:', err);
                                    });
                            }, 10000);
                        } else {
                            showNotification('خطا در راه‌اندازی سرور', 'error');
                        }
                        
                        setTimeout(checkServerStatus, 5000);
                    })
                    .catch(error => {
                        console.error('خطا در راه‌اندازی سرور:', error);
                        showNotification('خطا در ارتباط با سرور', 'error');
                        setTimeout(checkServerStatus, 3000);
                    });
            });
        }

        // دکمه توقف سرور
        if (stopServerBtn) {
            stopServerBtn.addEventListener('click', function() {
                serverStatusLoading.style.display = 'block';
                serverStatusContent.style.display = 'none';
                
                fetch('/api/pentaho/stop')
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'stopping') {
                            showNotification('سرور XRay Global در حال توقف است...', 'info');
                        } else {
                            showNotification('خطا در توقف سرور', 'error');
                        }
                        
                        setTimeout(checkServerStatus, 5000);
                    })
                    .catch(error => {
                        console.error('خطا در توقف سرور:', error);
                        showNotification('خطا در ارتباط با سرور', 'error');
                        setTimeout(checkServerStatus, 3000);
                    });
            });
        }
    }

    /**
     * بررسی وضعیت سرور پنتاهو
     */
    function checkServerStatus() {
        if (!serverStatusLoading || !serverStatusContent) return;
        
        serverStatusLoading.style.display = 'block';
        serverStatusContent.style.display = 'none';
        
        fetch('/api/pentaho/status')
            .then(response => response.json())
            .then(data => {
                updateServerStatusUI(data.status);
            })
            .catch(error => {
                console.error('خطا در بررسی وضعیت سرور:', error);
                updateServerStatusUI('error');
            });
    }

    /**
     * به‌روزرسانی رابط کاربری وضعیت سرور
     * @param {string} status - وضعیت سرور (online, offline, error)
     */
    function updateServerStatusUI(status) {
        if (!statusIcon || !statusText || !startServerBtn || !stopServerBtn || 
            !serverStatusLoading || !serverStatusContent) return;
        
        serverStatusLoading.style.display = 'none';
        serverStatusContent.style.display = 'block';
        
        switch(status) {
            case 'online':
                statusIcon.innerHTML = '<i class="fas fa-check-circle" style="color: #4caf50;"></i>';
                statusText.textContent = 'وضعیت سرور: آنلاین';
                startServerBtn.disabled = true;
                stopServerBtn.disabled = false;
                break;
            case 'offline':
                statusIcon.innerHTML = '<i class="fas fa-times-circle" style="color: #f44336;"></i>';
                statusText.textContent = 'وضعیت سرور: آفلاین';
                startServerBtn.disabled = false;
                stopServerBtn.disabled = true;
                break;
            case 'error':
            default:
                statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i>';
                statusText.textContent = 'وضعیت سرور: خطا در بررسی وضعیت';
                startServerBtn.disabled = false;
                stopServerBtn.disabled = false;
        }
    }

    /**
     * نمایش اعلان‌ها به کاربر
     * @param {string} message - پیام اعلان
     * @param {string} type - نوع اعلان (success, error, info, warning)
     */
    function showNotification(message, type = 'info') {
        // اگر عنصر container اعلان‌ها وجود ندارد، آن را ایجاد می‌کنیم
        let notifContainer = document.getElementById('notification-container');
        if (!notifContainer) {
            notifContainer = document.createElement('div');
            notifContainer.id = 'notification-container';
            notifContainer.style.position = 'fixed';
            notifContainer.style.top = '20px';
            notifContainer.style.left = '20px';
            notifContainer.style.zIndex = '9999';
            document.body.appendChild(notifContainer);
        }
        
        // ایجاد اعلان جدید
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.backgroundColor = type === 'success' ? '#4caf50' : 
                                             type === 'error' ? '#f44336' : 
                                             type === 'warning' ? '#ff9800' : '#2196f3';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.minWidth = '300px';
        notification.style.animation = 'fadeIn 0.3s ease-in-out';
        
        // افزودن آیکون مناسب بر اساس نوع اعلان
        let icon = '';
        switch(type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-times-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        notification.innerHTML = `
            <div style="margin-left: 10px;">${icon}</div>
            <div style="flex: 1;">${message}</div>
            <div style="cursor: pointer; padding-right: 5px;" class="close-notification">&times;</div>
        `;
        
        // افزودن اعلان به container
        notifContainer.appendChild(notification);
        
        // افزودن رفتار کلیک به دکمه بستن اعلان
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
        
        // حذف خودکار اعلان پس از 5 ثانیه
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-100%)';
                notification.style.transition = 'opacity 0.5s, transform 0.5s';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);
    }
});

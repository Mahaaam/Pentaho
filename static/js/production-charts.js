/**
 * XRay Global - فایل جاوااسکریپت نمودارهای تولید
 * نسخه: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // فارسی سازی اعداد در نمودارها
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    
    function toPersianNum(num) {
        return num.toString().replace(/\d/g, x => persianDigits[x]);
    }

    // رنگ‌های استفاده شده در نمودارها
    const chartColors = {
        blue: 'rgba(25, 118, 210, 0.7)',
        blueLight: 'rgba(33, 150, 243, 0.7)',
        green: 'rgba(76, 175, 80, 0.7)',
        orange: 'rgba(255, 152, 0, 0.7)',
        red: 'rgba(244, 67, 54, 0.7)',
        purple: 'rgba(156, 39, 176, 0.7)',
        teal: 'rgba(0, 150, 136, 0.7)',
        indigo: 'rgba(63, 81, 181, 0.7)',
        pink: 'rgba(233, 30, 99, 0.7)',
        amber: 'rgba(255, 193, 7, 0.7)',
        gray: 'rgba(158, 158, 158, 0.7)'
    };

    /**
     * نمودار میزان تولید روزانه
     */
    const dailyProductionChartElem = document.getElementById('dailyProductionChart');
    if (dailyProductionChartElem) {
        // داده‌های نمودار - روزهای اخیر
        const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 
                      'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
        
        // داده‌های نمودار - میزان تولید روزانه
        const productionData = [456, 487, 512, 498, 532, 467, 321, 478, 502, 527, 545, 562, 498, 412];
        
        // داده‌های نمودار - هدف تولید روزانه
        const targetData = Array(14).fill(500);

        const dailyProductionChart = new Chart(dailyProductionChartElem, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'میزان تولید',
                    data: productionData,
                    backgroundColor: chartColors.blue,
                    borderColor: chartColors.blue,
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'هدف تولید',
                    data: targetData,
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: chartColors.gray,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + ' واحد';
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            boxWidth: 15,
                            padding: 15
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return toPersianNum(value);
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * نمودار مقایسه عملکرد خطوط تولید
     */
    const productionLinesChartElem = document.getElementById('productionLinesChart');
    if (productionLinesChartElem) {
        const productionLinesChart = new Chart(productionLinesChartElem, {
            type: 'bar',
            data: {
                labels: ['تولید', 'بازده', 'ضایعات', 'توقف تولید'],
                datasets: [{
                    label: 'خط تولید ۱',
                    data: [85, 92, 2.1, 4.8],
                    backgroundColor: chartColors.blue
                },
                {
                    label: 'خط تولید ۲',
                    data: [78, 85, 3.5, 7.2],
                    backgroundColor: chartColors.green
                },
                {
                    label: 'خط تولید ۳',
                    data: [92, 94, 1.8, 3.5],
                    backgroundColor: chartColors.orange
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    const idx = context.dataIndex;
                                    if (idx === 0) {
                                        label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + '%';
                                    } else if (idx === 1) {
                                        label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + '%';
                                    } else if (idx === 2) {
                                        label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + '%';
                                    } else {
                                        label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + '%';
                                    }
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            boxWidth: 15,
                            padding: 15
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return toPersianNum(value);
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * نمودار علل توقف تولید
     */
    const downtimeReasonsChartElem = document.getElementById('downtimeReasonsChart');
    if (downtimeReasonsChartElem) {
        const downtimeReasonsChart = new Chart(downtimeReasonsChartElem, {
            type: 'pie',
            data: {
                labels: ['خرابی دستگاه', 'کمبود مواد اولیه', 'تنظیم ماشین‌آلات', 'تغییر محصول', 'سایر'],
                datasets: [{
                    data: [42, 18, 15, 20, 5],
                    backgroundColor: [
                        chartColors.red,
                        chartColors.blue,
                        chartColors.orange,
                        chartColors.green,
                        chartColors.gray
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const percentage = toPersianNum(value) + '%';
                                return label + ': ' + percentage;
                            }
                        }
                    },
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 15,
                            padding: 15
                        }
                    }
                }
            }
        });
    }

    // اعمال فیلترها
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const dateFrom = document.getElementById('date-from').value;
            const dateTo = document.getElementById('date-to').value;
            const productionLine = document.getElementById('production-line').value;
            const productGroup = document.getElementById('product-group').value;
            
            // در اینجا می‌توانیم با ارسال درخواست به سرور، داده‌های جدید را با فیلترهای انتخاب شده دریافت کنیم
            showFilterAppliedMessage(dateFrom, dateTo, productionLine, productGroup);
        });
    }

    /**
     * نمایش پیام اعمال فیلترها
     */
    function showFilterAppliedMessage(dateFrom, dateTo, productionLine, productGroup) {
        let message = 'فیلترها اعمال شدند: ';
        let filters = [];
        
        if (dateFrom) filters.push(`از تاریخ: ${dateFrom}`);
        if (dateTo) filters.push(`تا تاریخ: ${dateTo}`);
        
        if (productionLine) {
            const productionLineSelect = document.getElementById('production-line');
            const selectedOption = productionLineSelect.options[productionLineSelect.selectedIndex];
            filters.push(`خط تولید: ${selectedOption.text}`);
        }
        
        if (productGroup) {
            const productGroupSelect = document.getElementById('product-group');
            const selectedOption = productGroupSelect.options[productGroupSelect.selectedIndex];
            filters.push(`گروه محصول: ${selectedOption.text}`);
        }
        
        message += filters.join(' | ');
        
        // ایجاد یک اعلان برای نمایش پیام
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.innerHTML = `
            <div class="notification-toast-content">
                <i class="fas fa-filter"></i>
                <span>${message}</span>
            </div>
            <button class="close-notification">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // حذف اعلان پس از چند ثانیه
        setTimeout(() => {
            notification.classList.add('fadeOut');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
        
        // دکمه بستن اعلان
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
    }

    // دکمه‌های خروجی
    const exportExcelBtn = document.getElementById('export-excel');
    const exportPdfBtn = document.getElementById('export-pdf');
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', function() {
            alert('در حال آماده‌سازی خروجی اکسل...');
            // در اینجا می‌توانیم با ارسال درخواست به سرور، خروجی اکسل را دریافت کنیم
        });
    }
    
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function() {
            alert('در حال آماده‌سازی خروجی PDF...');
            // در اینجا می‌توانیم با ارسال درخواست به سرور، خروجی PDF را دریافت کنیم
        });
    }
    
    /**
     * نمودار روند کیفیت محصولات
     */
    const qualityTrendChartElem = document.getElementById('qualityTrendChart');
    if (qualityTrendChartElem) {
        // داده‌های نمودار - ماه‌های اخیر
        const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'];
        
        // داده‌های نمودار - درصد کیفیت قابل قبول
        const qualityData = [96.2, 95.8, 97.3, 98.1, 97.9, 98.5];
        
        // داده‌های نمودار - هدف کیفیت
        const targetQualityData = Array(6).fill(95);

        const qualityTrendChart = new Chart(qualityTrendChartElem, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'درصد کیفیت قابل قبول',
                    data: qualityData,
                    backgroundColor: chartColors.green,
                    borderColor: chartColors.green,
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'حداقل کیفیت استاندارد',
                    data: targetQualityData,
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: chartColors.red,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + '%';
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            boxWidth: 15,
                            padding: 15
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 90,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return toPersianNum(value) + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * دریافت داده‌های واقعی از API
     */
    function fetchProductionData() {
        // نمایش وضعیت بارگذاری
        document.querySelectorAll('.chart-container').forEach(container => {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = '<div class="spinner"></div><p>در حال بارگذاری...</p>';
            container.appendChild(loadingOverlay);
        });

        // استخراج پارامترهای فیلتر (در صورت وجود)
        const dateFrom = document.getElementById('date-from')?.value || '';
        const dateTo = document.getElementById('date-to')?.value || '';
        const productionLine = document.getElementById('production-line')?.value || '';
        const productGroup = document.getElementById('product-group')?.value || '';

        // ساخت پارامترهای URL
        const params = new URLSearchParams();
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        if (productionLine) params.append('production_line', productionLine);
        if (productGroup) params.append('product_group', productGroup);

        // دریافت داده‌ها از API
        fetch(`/api/data/sqlserver/production_performance?${params.toString()}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('خطا در دریافت داده‌ها');
                }
                return response.json();
            })
            .then(data => {
                // به‌روزرسانی نمودارها با داده‌های دریافتی
                updateProductionCharts(data);
                
                // حذف وضعیت بارگذاری
                document.querySelectorAll('.loading-overlay').forEach(overlay => {
                    overlay.remove();
                });
            })
            .catch(error => {
                console.error('خطا در دریافت داده‌های تولید:', error);
                
                // نمایش پیام خطا
                showErrorMessage('خطا در دریافت داده‌های تولید. لطفاً صفحه را مجدداً بارگذاری کنید.');
                
                // حذف وضعیت بارگذاری
                document.querySelectorAll('.loading-overlay').forEach(overlay => {
                    overlay.remove();
                });
            });
    }

    /**
     * به‌روزرسانی نمودارها با داده‌های دریافتی
     */
    function updateProductionCharts(data) {
        // این تابع داده‌های دریافتی از API را می‌گیرد و نمودارها را به‌روزرسانی می‌کند
        // به‌روزرسانی نمودار تولید روزانه
        if (window.dailyProductionChart && data.daily_production) {
            window.dailyProductionChart.data.labels = data.daily_production.labels;
            window.dailyProductionChart.data.datasets[0].data = data.daily_production.values;
            window.dailyProductionChart.update();
        }
        
        // به‌روزرسانی نمودار خطوط تولید
        if (window.productionLinesChart && data.production_lines) {
            window.productionLinesChart.data.datasets.forEach((dataset, index) => {
                if (data.production_lines[index]) {
                    dataset.data = data.production_lines[index].values;
                }
            });
            window.productionLinesChart.update();
        }
        
        // به‌روزرسانی نمودار علل توقف
        if (window.downtimeReasonsChart && data.downtime_reasons) {
            window.downtimeReasonsChart.data.labels = data.downtime_reasons.labels;
            window.downtimeReasonsChart.data.datasets[0].data = data.downtime_reasons.values;
            window.downtimeReasonsChart.update();
        }
        
        // به‌روزرسانی نمودار روند کیفیت
        if (window.qualityTrendChart && data.quality_trend) {
            window.qualityTrendChart.data.labels = data.quality_trend.labels;
            window.qualityTrendChart.data.datasets[0].data = data.quality_trend.values;
            window.qualityTrendChart.update();
        }
    }

    /**
     * نمایش پیام خطا
     */
    function showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'notification-toast error';
        notification.innerHTML = `
            <div class="notification-toast-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
            <button class="close-notification">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // حذف اعلان پس از چند ثانیه
        setTimeout(() => {
            notification.classList.add('fadeOut');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 7000);
        
        // دکمه بستن اعلان
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
    }

    // ذخیره مرجع جهانی برای نمودارها
    window.dailyProductionChart = dailyProductionChart;
    window.productionLinesChart = productionLinesChart;
    window.downtimeReasonsChart = downtimeReasonsChart;
    window.qualityTrendChart = qualityTrendChart;
    
    // اعمال فیلترها و دریافت داده‌های واقعی
    const refreshDataBtn = document.getElementById('refresh-data');
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', function() {
            fetchProductionData();
        });
    }
});

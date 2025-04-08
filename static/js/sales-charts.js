/**
 * XRay Global - فایل جاوااسکریپت نمودارهای فروش
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

    // تبدیل نام‌های ماه میلادی به فارسی
    const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

    /**
     * نمودار روند فروش ماهیانه
     */
    const salesTrendChartElem = document.getElementById('salesTrendChart');
    if (salesTrendChartElem) {
        // داده‌های نمودار - مقدار فروش ماهیانه
        const monthlySalesAmount = [284000000, 326000000, 375000000, 342000000, 389000000, 425000000, 478000000, 452000000, 498000000, 532000000, 587000000, 612000000];
        
        // داده‌های نمودار - تعداد فروش ماهیانه
        const monthlySalesCount = [345, 389, 412, 378, 425, 456, 489, 465, 512, 545, 598, 625];

        const salesTrendChart = new Chart(salesTrendChartElem, {
            type: 'line',
            data: {
                labels: persianMonths,
                datasets: [{
                    label: 'مبلغ فروش',
                    data: monthlySalesAmount,
                    backgroundColor: chartColors.blue,
                    borderColor: chartColors.blue,
                    borderWidth: 2,
                    tension: 0.3,
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
                                    label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + ' تومان';
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
                                if (value >= 1000000) {
                                    return toPersianNum((value / 1000000).toFixed(0)) + 'M';
                                }
                                return toPersianNum(new Intl.NumberFormat('fa-IR').format(value));
                            }
                        }
                    }
                }
            }
        });

        // تغییر نوع نمودار (مبلغ فروش/تعداد فروش)
        const salesTrendType = document.getElementById('sales-trend-type');
        if (salesTrendType) {
            salesTrendType.addEventListener('change', function() {
                const type = this.value;
                
                if (type === 'amount') {
                    salesTrendChart.data.datasets[0].label = 'مبلغ فروش';
                    salesTrendChart.data.datasets[0].data = monthlySalesAmount;
                    salesTrendChart.options.plugins.tooltip.callbacks.label = function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + ' تومان';
                        }
                        return label;
                    };
                } else {
                    salesTrendChart.data.datasets[0].label = 'تعداد فروش';
                    salesTrendChart.data.datasets[0].data = monthlySalesCount;
                    salesTrendChart.options.plugins.tooltip.callbacks.label = function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + ' عدد';
                        }
                        return label;
                    };
                }
                
                salesTrendChart.update();
            });
        }
    }

    /**
     * نمودار محصولات پرفروش
     */
    const topProductsChartElem = document.getElementById('topProductsChart');
    if (topProductsChartElem) {
        const topProductsChart = new Chart(topProductsChartElem, {
            type: 'bar',
            data: {
                labels: ['محصول آلفا پلاس', 'محصول بتا', 'محصول گاما زد', 'محصول دلتا پرو', 'محصول اپسیلون ۲'],
                datasets: [{
                    label: 'تعداد فروش',
                    data: [1245, 987, 756, 543, 421],
                    backgroundColor: [
                        chartColors.blue,
                        chartColors.green,
                        chartColors.orange,
                        chartColors.purple,
                        chartColors.teal
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
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
                                if (context.parsed.x !== null) {
                                    label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.x)) + ' عدد';
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
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
     * نمودار مشتریان برتر
     */
    const topCustomersChartElem = document.getElementById('topCustomersChart');
    if (topCustomersChartElem) {
        const topCustomersChart = new Chart(topCustomersChartElem, {
            type: 'pie',
            data: {
                labels: ['شرکت آلفا', 'شرکت بتا', 'شرکت گاما', 'شرکت دلتا', 'شرکت اپسیلون'],
                datasets: [{
                    data: [35, 25, 15, 15, 10],
                    backgroundColor: [
                        chartColors.blue,
                        chartColors.green,
                        chartColors.orange,
                        chartColors.purple,
                        chartColors.teal
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
                        position: 'bottom',
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
            const productCategory = document.getElementById('product-category').value;
            const customerGroup = document.getElementById('customer-group').value;
            
            // در اینجا می‌توانیم با ارسال درخواست به سرور، داده‌های جدید را با فیلترهای انتخاب شده دریافت کنیم
            showFilterAppliedMessage(dateFrom, dateTo, productCategory, customerGroup);
        });
    }

    /**
     * نمایش پیام اعمال فیلترها
     */
    function showFilterAppliedMessage(dateFrom, dateTo, productCategory, customerGroup) {
        let message = 'فیلترها اعمال شدند: ';
        let filters = [];
        
        if (dateFrom) filters.push(`از تاریخ: ${dateFrom}`);
        if (dateTo) filters.push(`تا تاریخ: ${dateTo}`);
        
        if (productCategory) {
            const productCategorySelect = document.getElementById('product-category');
            const selectedOption = productCategorySelect.options[productCategorySelect.selectedIndex];
            filters.push(`گروه محصول: ${selectedOption.text}`);
        }
        
        if (customerGroup) {
            const customerGroupSelect = document.getElementById('customer-group');
            const selectedOption = customerGroupSelect.options[customerGroupSelect.selectedIndex];
            filters.push(`گروه مشتریان: ${selectedOption.text}`);
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
});

/**
 * XRay Global - فایل جاوااسکریپت نمودارهای حسابداری
 * نسخه: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // فارسی سازی اعداد در نمودارها
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    
    function toPersianNum(num) {
        return num.toString().replace(/\d/g, x => persianDigits[x]);
    }

    // تبدیل نام‌های ماه میلادی به فارسی
    const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    const persianQuarters = ['سه‌ماهه اول', 'سه‌ماهه دوم', 'سه‌ماهه سوم', 'سه‌ماهه چهارم'];

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
     * نمودار درآمد و هزینه‌های سالانه
     */
    const incomeExpenseChartElem = document.getElementById('incomeExpenseChart');
    if (incomeExpenseChartElem) {
        const incomeExpenseChart = new Chart(incomeExpenseChartElem, {
            type: 'bar',
            data: {
                labels: persianQuarters,
                datasets: [
                    {
                        label: 'درآمد',
                        data: [19750000000, 22340000000, 20870000000, 23490000000],
                        backgroundColor: chartColors.blue,
                        borderWidth: 1
                    },
                    {
                        label: 'هزینه',
                        data: [13542000000, 15876000000, 14356000000, 16958000000],
                        backgroundColor: chartColors.red,
                        borderWidth: 1
                    },
                    {
                        label: 'سود',
                        data: [6208000000, 6464000000, 6514000000, 6532000000],
                        backgroundColor: chartColors.green,
                        borderWidth: 1
                    }
                ]
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
                                    label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + ' ریال';
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
                                if (value >= 1000000000) {
                                    return toPersianNum((value / 1000000000).toFixed(1)) + ' میلیارد';
                                } else if (value >= 1000000) {
                                    return toPersianNum((value / 1000000).toFixed(0)) + ' میلیون';
                                }
                                return toPersianNum(new Intl.NumberFormat('fa-IR').format(value));
                            }
                        }
                    }
                }
            }
        });

        // تغییر سال مالی نمودار
        const fiscalYearSelect = document.getElementById('fiscal-year');
        if (fiscalYearSelect) {
            fiscalYearSelect.addEventListener('change', function() {
                const year = this.value;
                // در اینجا می‌توان داده‌های جدید را براساس سال انتخاب شده از سرور دریافت کرد
                // برای نمونه، مقادیر تصادفی نزدیک به داده‌های فعلی را تولید می‌کنیم
                
                const randomVariation = function() {
                    return Math.random() * 0.4 + 0.8; // ضریب تغییر بین 0.8 تا 1.2
                };
                
                const newIncomeData = incomeExpenseChart.data.datasets[0].data.map(value => 
                    Math.round(value * randomVariation())
                );
                
                const newExpenseData = incomeExpenseChart.data.datasets[1].data.map(value => 
                    Math.round(value * randomVariation())
                );
                
                // محاسبه سود جدید
                const newProfitData = newIncomeData.map((income, idx) => 
                    income - newExpenseData[idx]
                );
                
                incomeExpenseChart.data.datasets[0].data = newIncomeData;
                incomeExpenseChart.data.datasets[1].data = newExpenseData;
                incomeExpenseChart.data.datasets[2].data = newProfitData;
                incomeExpenseChart.update();
            });
        }
    }

    /**
     * نمودار توزیع هزینه‌ها
     */
    const expenseDistributionChartElem = document.getElementById('expenseDistributionChart');
    if (expenseDistributionChartElem) {
        const expenseDistributionChart = new Chart(expenseDistributionChartElem, {
            type: 'doughnut',
            data: {
                labels: ['بهای تمام شده کالا', 'هزینه‌های فروش', 'هزینه‌های اداری', 'هزینه‌های مالی', 'سایر هزینه‌ها'],
                datasets: [{
                    data: [65, 12, 15, 5, 3],
                    backgroundColor: [
                        chartColors.blue,
                        chartColors.green,
                        chartColors.orange,
                        chartColors.purple,
                        chartColors.red
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

    /**
     * نمودار روند سود ناخالص
     */
    const grossProfitTrendChartElem = document.getElementById('grossProfitTrendChart');
    if (grossProfitTrendChartElem) {
        const grossProfitTrendChart = new Chart(grossProfitTrendChartElem, {
            type: 'line',
            data: {
                labels: persianQuarters,
                datasets: [{
                    label: 'سود ناخالص',
                    data: [7875000000, 8670000000, 8145000000, 9545000000],
                    backgroundColor: 'rgba(0, 150, 136, 0.2)',
                    borderColor: chartColors.teal,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'حاشیه سود ناخالص',
                    data: [6845000000, 7560000000, 7120000000, 8325000000],
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                    borderColor: chartColors.blue,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
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
                                    label += toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + ' ریال';
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
                                if (value >= 1000000000) {
                                    return toPersianNum((value / 1000000000).toFixed(1)) + ' میلیارد';
                                } else if (value >= 1000000) {
                                    return toPersianNum((value / 1000000).toFixed(0)) + ' میلیون';
                                }
                                return toPersianNum(new Intl.NumberFormat('fa-IR').format(value));
                            }
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
            const fiscalYear = document.getElementById('fiscal-year').value;
            const fiscalQuarter = document.getElementById('fiscal-quarter').value;
            const reportType = document.getElementById('report-type').value;
            const department = document.getElementById('department').value;
            
            // در اینجا می‌توانیم با ارسال درخواست به سرور، داده‌های جدید را با فیلترهای انتخاب شده دریافت کنیم
            showFilterAppliedMessage(fiscalYear, fiscalQuarter, reportType, department);
        });
    }

    /**
     * نمایش پیام اعمال فیلترها
     */
    function showFilterAppliedMessage(fiscalYear, fiscalQuarter, reportType, department) {
        let message = 'فیلترها اعمال شدند: ';
        let filters = [];
        
        if (fiscalYear) {
            const fiscalYearSelect = document.getElementById('fiscal-year');
            const selectedOption = fiscalYearSelect.options[fiscalYearSelect.selectedIndex];
            filters.push(`سال مالی: ${selectedOption.text}`);
        }
        
        if (fiscalQuarter) {
            const fiscalQuarterSelect = document.getElementById('fiscal-quarter');
            const selectedOption = fiscalQuarterSelect.options[fiscalQuarterSelect.selectedIndex];
            filters.push(`دوره مالی: ${selectedOption.text}`);
        }
        
        if (reportType) {
            const reportTypeSelect = document.getElementById('report-type');
            const selectedOption = reportTypeSelect.options[reportTypeSelect.selectedIndex];
            filters.push(`نوع گزارش: ${selectedOption.text}`);
        }
        
        if (department) {
            const departmentSelect = document.getElementById('department');
            const selectedOption = departmentSelect.options[departmentSelect.selectedIndex];
            filters.push(`دپارتمان: ${selectedOption.text}`);
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

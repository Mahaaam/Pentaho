/**
 * XRay Global - فایل جاوااسکریپت نمودارها
 * نسخه: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // فارسی سازی اعداد در نمودارها
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    
    function toPersianNum(num) {
        return num.toString().replace(/\d/g, x => persianDigits[x]);
    }

    // تنظیمات فونت برای نمودارها
    Chart.defaults.font.family = 'Vazir, Tahoma, Arial';
    Chart.defaults.font.size = 12;
    
    // تبدیل نام‌های ماه میلادی به فارسی
    const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

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

    // فارسی‌سازی قالب اعداد در نمودار
    const persianNumberFormat = {
        formatter: function(value) {
            return toPersianNum(new Intl.NumberFormat('fa-IR').format(value));
        }
    };

    /**
     * نمودار روند فروش ماهیانه
     */
    const salesChartElem = document.getElementById('salesChart');
    if (salesChartElem) {
        const salesChart = new Chart(salesChartElem, {
            type: 'line',
            data: {
                labels: persianMonths,
                datasets: [{
                    label: 'فروش',
                    data: [1258000, 1856000, 2453000, 2854000, 3124000, 2987000, 3456000, 3245000, 2976000, 3567000, 4125000, 4589000],
                    backgroundColor: chartColors.blue,
                    borderColor: chartColors.blue,
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'هدف',
                    data: [1500000, 2000000, 2500000, 2700000, 3000000, 3200000, 3300000, 3400000, 3500000, 3600000, 3800000, 4000000],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: chartColors.gray,
                    borderWidth: 2,
                    borderDash: [5, 5],
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
                                    return toPersianNum((value / 1000000).toFixed(1)) + 'M';
                                }
                                return toPersianNum(new Intl.NumberFormat('fa-IR').format(value));
                            }
                        }
                    }
                }
            }
        });

        // تغییر سال نمودار فروش
        const salesChartYear = document.getElementById('sales-chart-year');
        if (salesChartYear) {
            salesChartYear.addEventListener('change', function() {
                const year = this.value;
                // در اینجا می‌توان داده‌های جدید را براساس سال انتخاب شده از سرور دریافت کرد
                // برای نمونه، مقادیر تصادفی نزدیک به داده‌های فعلی را تولید می‌کنیم
                
                const randomVariation = function() {
                    return Math.random() * 0.3 + 0.85; // ضریب تغییر بین 0.85 تا 1.15
                };
                
                const newSalesData = salesChart.data.datasets[0].data.map(value => 
                    Math.round(value * randomVariation())
                );
                
                const newTargetData = salesChart.data.datasets[1].data.map(value => 
                    Math.round(value * randomVariation())
                );
                
                salesChart.data.datasets[0].data = newSalesData;
                salesChart.data.datasets[1].data = newTargetData;
                salesChart.update();
            });
        }
    }

    /**
     * نمودار توزیع فروش محصولات
     */
    const productsChartElem = document.getElementById('productsChart');
    if (productsChartElem) {
        const productsChart = new Chart(productsChartElem, {
            type: 'doughnut',
            data: {
                labels: ['محصول A', 'محصول B', 'محصول C', 'محصول D', 'محصول E'],
                datasets: [{
                    data: [35, 25, 20, 10, 10],
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
     * نمودار فروش منطقه‌ای
     */
    const regionChartElem = document.getElementById('regionChart');
    if (regionChartElem) {
        const regionChart = new Chart(regionChartElem, {
            type: 'bar',
            data: {
                labels: ['تهران', 'اصفهان', 'مشهد', 'تبریز', 'شیراز'],
                datasets: [{
                    label: 'فروش (میلیون تومان)',
                    data: [854, 632, 475, 386, 325],
                    backgroundColor: [
                        chartColors.blue,
                        chartColors.blueLight,
                        chartColors.indigo,
                        chartColors.teal,
                        chartColors.purple
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
                                let label = context.dataset.label || '';
                                if (label) {
                                    label = label.replace('(میلیون تومان)', '');
                                }
                                if (context.parsed.y !== null) {
                                    label += ': ' + toPersianNum(new Intl.NumberFormat('fa-IR').format(context.parsed.y)) + ' میلیون تومان';
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
});

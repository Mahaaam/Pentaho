#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_cors import CORS
import os
import json
import subprocess
import requests
# pandas temporally removed due to compatibility issues
# import pymysql
# import pyodbc
# from sqlalchemy import create_engine, text
from functools import lru_cache
import time
import re
import csv
import io
import pandas as pd
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# ماژول‌های رابط رایورز را وارد می‌کنیم
from rayvarz_api import rayvarz_api
from rayvarz_data_connector import get_connector

# بارگذاری متغیرهای محیطی
load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get('SECRET_KEY', 'xray_global_default_secret_key')

# ثبت Blueprint رایورز API
app.register_blueprint(rayvarz_api, url_prefix='/api/rayvarz')

# تنظیمات مسیر پنتاهو
PENTAHO_SERVER_PATH = os.environ.get('PENTAHO_SERVER_PATH', 'e:/Repsitory/Pentaho/pentaho-server')
PENTAHO_URL = os.environ.get('PENTAHO_URL', 'http://localhost:8080/pentaho')

# مدیریت کاربران (در یک محیط واقعی از دیتابیس استفاده شود)
USERS = {
    'admin': {
        'password': generate_password_hash('admin'),
        'role': 'admin',
        'display_name': 'مدیر سیستم'
    },
    'user': {
        'password': generate_password_hash('user'),
        'role': 'user',
        'display_name': 'کاربر عادی'
    }
}

# تنظیمات اتصال به دیتابیس - موقتاً غیرفعال شده
def get_mysql_connection():
    """اتصال به دیتابیس MySQL با استفاده از پارامترهای محیطی"""
    print("تابع اتصال به MySQL موقتاً غیرفعال شده است")
    return None

def get_sqlserver_connection():
    """اتصال به دیتابیس SQL Server با استفاده از پارامترهای محیطی"""
    print("تابع اتصال به SQL Server موقتاً غیرفعال شده است")
    return None

# ایجاد پیشرفته SQLAlchemy برای بهینه‌سازی کوئری‌های سنگین - موقتاً غیرفعال شده
def get_sqlalchemy_engine(db_type='mysql'):
    """ایجاد موتور SQLAlchemy برای عملکرد بهتر در کوئری‌های سنگین"""
    print(f"تابع موتور SQLAlchemy برای {db_type} موقتاً غیرفعال شده است")
    return None


def load_sql_backup_data(sql_file_path, table_name=None):
    """بارگذاری داده‌ها از فایل بکاپ SQL"""
    try:
        print(f"بارگذاری داده‌ها از فایل بکاپ SQL: {sql_file_path}")
        
        # خواندن فایل SQL
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # الگوی برای استخراج ساختار و داده‌های جداول
        tables_data = {}
        
        # پردازش ساختار جداول - یافتن تمام CREATE TABLE
        create_table_pattern = r'CREATE TABLE[\s\`]+([^\(]+)[\s\`]*\(([^;]+)\)[^;]*;'
        create_tables = re.findall(create_table_pattern, sql_content, re.DOTALL)
        
        for table_match in create_tables:
            table_name_match = table_match[0].strip().replace('`', '')
            tables_data[table_name_match] = {'structure': table_match[1].strip(), 'data': []}
        
        # پردازش داده‌های جداول - یافتن تمام INSERT INTO
        for current_table in tables_data.keys():
            # الگوی برای یافتن داده‌های جدول
            insert_pattern = r"INSERT INTO[\s\`]+" + current_table + r"[\s\`]*\s+VALUES\s+([^;]+);"
            inserts = re.findall(insert_pattern, sql_content, re.DOTALL)
            
            for insert_match in inserts:
                # پردازش داده‌ها و تبدیل به لیست رکوردها
                values_pattern = r'\(([^\)]+)\)'
                values_matches = re.findall(values_pattern, insert_match)
                
                for values in values_matches:
                    # اضافه کردن رکورد به داده‌های جدول
                    tables_data[current_table]['data'].append(values.split(','))
        
        # اگر نام جدول مشخص شده باشد، فقط آن جدول را برگردان
        if table_name and table_name in tables_data:
            return {
                'success': True,
                'message': f"داده‌های جدول {table_name} با موفقیت بارگذاری شد",
                'table': table_name,
                'structure': tables_data[table_name]['structure'],
                'data': tables_data[table_name]['data'],
                'record_count': len(tables_data[table_name]['data'])
            }
        
        # در غیر این صورت، اطلاعات کلی همه جداول را برگردان
        tables_info = {}
        for table, data in tables_data.items():
            tables_info[table] = len(data['data'])
            
        return {
            'success': True,
            'message': f"اطلاعات {len(tables_data)} جدول با موفقیت بارگذاری شد",
            'tables': tables_info
        }
        
    except Exception as e:
        print(f"خطا در بارگذاری فایل بکاپ SQL: {e}")
        return {
            'success': False,
            'message': f"خطا در بارگذاری فایل بکاپ SQL: {str(e)}"
        }

@app.route('/')
def index():
    """صفحه ورود به سیستم"""
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    """پردازش ورود به سیستم"""
    username = request.form.get('username')
    password = request.form.get('password')
    
    # اضافه کردن لاگ برای اشکال‌زدایی
    print(f"درخواست ورود: نام کاربری={username}, رمز عبور={password}")
    
    # برای تست، مستقیماً مقادیر را بررسی می‌کنیم
    if username == 'admin' and password == 'admin':
        session['user_id'] = username
        session['user_role'] = 'admin'
        session['display_name'] = 'مدیر سیستم'
        return redirect(url_for('dashboard'))
    elif username == 'user' and password == 'user':
        session['user_id'] = username
        session['user_role'] = 'user'
        session['display_name'] = 'کاربر عادی'
        return redirect(url_for('dashboard'))
    
    # پیام خطای واضح با جزئیات بیشتر
    error_msg = f'نام کاربری یا رمز عبور اشتباه است. شما وارد کردید: {username}/{password}. لطفاً از admin/admin یا user/user استفاده کنید'
    print(f"خطای ورود: {error_msg}")
    return render_template('index.html', error=error_msg)

@app.route('/logout')
def logout():
    """خروج از سیستم"""
    session.clear()
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    """داشبورد اصلی"""
    if 'user_id' not in session:
        return redirect(url_for('index'))
    
    return render_template('dashboard.html', 
                          user=session.get('display_name'),
                          role=session.get('user_role'))

@app.route('/sales')
def sales_dashboard():
    """داشبورد فروش"""
    if 'user_id' not in session:
        return redirect(url_for('index'))
    
    return render_template('sales.html', 
                          user=session.get('display_name'),
                          role=session.get('user_role'))

@app.route('/accounting')
def accounting_dashboard():
    """داشبورد حسابداری"""
    if 'user_id' not in session:
        return redirect(url_for('index'))
    
    return render_template('accounting.html', 
                          user=session.get('display_name'),
                          role=session.get('user_role'))

@app.route('/production')
def production_dashboard():
    """داشبورد تولید"""
    if 'user_id' not in session:
        return redirect(url_for('index'))
    
    return render_template('production.html', 
                          user=session.get('display_name'),
                          role=session.get('user_role'))

@app.route('/api/mysql/tables')
def get_mysql_tables():
    """دریافت لیست جداول از دیتابیس MySQL"""
    if 'user_id' not in session:
        return jsonify({'error': 'دسترسی غیرمجاز'}), 403
    
    # داده‌های نمایشی برای تست
    tables = ['sales', 'customers', 'products', 'orders', 'order_items']
    return jsonify({'tables': tables})

@app.route('/api/sqlserver/tables')
def get_sqlserver_tables():
    """دریافت لیست جداول از دیتابیس SQL Server"""
    if 'user_id' not in session:
        return jsonify({'error': 'دسترسی غیرمجاز'}), 403
    
    # داده‌های نمایشی برای تست
    tables = ['accounts', 'transactions', 'ledger', 'journal', 'expenses']
    return jsonify({'tables': tables})

@app.route('/api/data/<db_type>/<table_name>')
@lru_cache(maxsize=50)  # کش کردن نتایج برای افزایش کارایی
def get_table_data(db_type, table_name):
    """دریافت داده‌های جدول از دیتابیس با بهینه‌سازی برای داده‌های سنگین"""
    if 'user_id' not in session:
        return jsonify({'error': 'دسترسی غیرمجاز'}), 403

    # دریافت پارامترهای صفحه‌بندی و مرتب‌سازی
    limit = request.args.get('limit', 1000, type=int)  # محدودیت تعداد رکوردها
    offset = request.args.get('offset', 0, type=int)  # آفست برای صفحه‌بندی
    order_by = request.args.get('order_by', 'id')  # فیلد مرتب‌سازی
    order_dir = request.args.get('order_dir', 'asc')  # جهت مرتب‌سازی
    filter_field = request.args.get('filter_field')  # فیلد برای فیلتر کردن
    filter_value = request.args.get('filter_value')  # مقدار فیلتر
    use_backup = request.args.get('use_backup', 'false').lower() == 'true'  # استفاده از بکاپ SQL

    try:
        start_time = time.time()
        
        # بررسی اگر استفاده از بکاپ درخواست شده است
        if use_backup:
            backup_file_path = 'e:/Repsitory/Pentaho/Backup-SQL/xray_backend_backup_2025-04-02_23-45-01.sql'
            result = load_sql_backup_data(backup_file_path, table_name)
            
            if result['success'] and 'data' in result:
                # اعمال فیلتر و صفحه‌بندی روی داده‌های بکاپ
                data = result['data']
                start_index = min(offset, len(data))
                end_index = min(offset + limit, len(data))
                data = data[start_index:end_index]
                
                execution_time = time.time() - start_time
                return jsonify({
                    'data': data,
                    'meta': {
                        'total_records': len(data),
                        'execution_time_ms': round(execution_time * 1000, 2),
                        'is_from_backup': True,
                        'table': table_name
                    }
                })
                
        # اگر به دیتابیس دسترسی نداشتیم یا استفاده از بکاپ فعال نبود، از داده‌های نمونه استفاده می‌کنیم
        print(f"استفاده از داده‌های نمونه برای {db_type}/{table_name}")
        
        # بررسی وجود فایل بکاپ برای آزمایش بارگذاری
        backup_file_path = 'e:/Repsitory/Pentaho/Backup-SQL/xray_backend_backup_2025-04-02_23-45-01.sql'
        if os.path.exists(backup_file_path) and not use_backup:
            print("فایل بکاپ SQL موجود است. می‌توانید با پارامتر use_backup=true از آن استفاده کنید.")
        
        # داده‌های نمایشی برای تست
        if db_type == 'mysql':
            if table_name == 'sales':
                data = [
                    {'id': 1, 'date': '1404-01-01', 'amount': 1500000, 'customer': 'شرکت الف'},
                    {'id': 2, 'date': '1404-01-02', 'amount': 2300000, 'customer': 'شرکت ب'},
                    {'id': 3, 'date': '1404-01-03', 'amount': 950000, 'customer': 'شرکت ج'}
                ]
            elif table_name == 'products':
                data = [
                    {'id': 1, 'name': 'محصول آلفا', 'price': 250000, 'stock': 120},
                    {'id': 2, 'name': 'محصول بتا', 'price': 350000, 'stock': 85},
                    {'id': 3, 'name': 'محصول گاما', 'price': 185000, 'stock': 210}
                ]
            else:
                data = [{'id': 1, 'name': 'نمونه داده تست'}]
        elif db_type == 'sqlserver':
            if table_name == 'transactions':
                data = [
                    {'id': 1, 'date': '1404-01-01', 'amount': 1700000, 'type': 'درآمد'},
                    {'id': 2, 'date': '1404-01-02', 'amount': 450000, 'type': 'هزینه'},
                    {'id': 3, 'date': '1404-01-03', 'amount': 2100000, 'type': 'درآمد'}
                ]
            else:
                data = [{'id': 1, 'name': 'نمونه داده تست'}]
        else:
            return jsonify({'error': 'نوع دیتابیس نامعتبر است'}), 400

        # اعمال فیلتر روی داده‌های نمونه
        if filter_field and filter_value:
            filtered_data = []
            for item in data:
                if filter_field in item and str(filter_value).lower() in str(item[filter_field]).lower():
                    filtered_data.append(item)
            data = filtered_data

        execution_time = time.time() - start_time
        return jsonify({
            'data': data,
            'meta': {
                'total_records': len(data),
                'execution_time_ms': round(execution_time * 1000, 2),
                'is_mock': True
            }
        })
        
    except Exception as e:
        print(f"خطا در اجرای کوئری: {e}")
        return jsonify({
            'error': 'خطا در دریافت داده‌ها',
            'message': str(e)
        }), 500

@app.route('/api/pentaho/status')
def check_pentaho_status():
    """بررسی وضعیت سرور پنتاهو"""
    if 'user_id' not in session:
        return jsonify({'error': 'دسترسی غیرمجاز'}), 403
    
    # برای تست، همیشه وضعیت آنلاین برمی‌گردانیم
    return jsonify({'status': 'online', 'message': 'سرور پنتاهو (نسخه 9.4 Community Edition) در حال اجرا است'})

@app.route('/api/pentaho/start')
def start_pentaho():
    """راه‌اندازی سرور پنتاهو"""
    if 'user_id' not in session or session['user_role'] != 'admin':
        return jsonify({'error': 'دسترسی غیرمجاز'}), 403
    
    # برای تست، همیشه پیام موفقیت‌آمیز برمی‌گردانیم
    return jsonify({'status': 'starting', 'message': 'سرور پنتاهو (9.4 CE) در حال راه‌اندازی است. لطفاً چند دقیقه صبر کنید'})

@app.route('/api/backup/sql/load')
def load_sql_backup():
    """بارگذاری فایل بکاپ SQL"""
    if 'user_id' not in session:
        return jsonify({'error': 'دسترسی غیرمجاز'}), 403
    
    # مسیر فایل بکاپ
    backup_file_path = 'e:/Repsitory/Pentaho/Backup-SQL/xray_backend_backup_2025-04-02_23-45-01.sql'
    
    # بارگذاری داده‌های فایل بکاپ
    result = load_sql_backup_data(backup_file_path)
    
    if result['success']:
        return jsonify(result)
    else:
        return jsonify(result), 500

@app.route('/api/backup/sql/table/<table_name>')
def get_sql_backup_table(table_name):
    """دریافت داده‌های یک جدول خاص از فایل بکاپ SQL"""
    if 'user_id' not in session:
        return jsonify({'error': 'دسترسی غیرمجاز'}), 403
    
    # مسیر فایل بکاپ
    backup_file_path = 'e:/Repsitory/Pentaho/Backup-SQL/xray_backend_backup_2025-04-02_23-45-01.sql'
    
    # دریافت پارامترهای صفحه‌بندی
    limit = request.args.get('limit', 1000, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    # بارگذاری داده‌های جدول مورد نظر
    result = load_sql_backup_data(backup_file_path, table_name)
    
    if result['success']:
        # اعمال صفحه‌بندی روی داده‌ها
        if 'data' in result:
            start_index = min(offset, len(result['data']))
            end_index = min(offset + limit, len(result['data']))
            result['data'] = result['data'][start_index:end_index]
            result['meta'] = {
                'total_records': len(result['data']),
                'offset': offset,
                'limit': limit,
                'is_from_backup': True
            }
        return jsonify(result)
    else:
        return jsonify(result), 500

@app.route('/api/pentaho/stop')
def stop_pentaho():
    """توقف سرور پنتاهو"""
    if 'user_id' not in session or session['user_role'] != 'admin':
        return jsonify({'error': 'دسترسی غیرمجاز'}), 403
    
    # برای تست، همیشه پیام موفقیت‌آمیز برمی‌گردانیم
    return jsonify({'status': 'stopping', 'message': 'سرور پنتاهو (9.4 CE) در حال توقف است. لطفاً چند لحظه صبر کنید'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

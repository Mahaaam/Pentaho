from PIL import Image, ImageDraw, ImageFont

# مسیر عکس ورودی و خروجی
image_path = "bi.png"
output_path = "bi_with_login_final.png"

# باز کردن تصویر اصلی
img = Image.open(image_path).convert("RGBA")
width, height = img.size

# ساختن لایه جدید برای طراحی UI
overlay = Image.new('RGBA', img.size, (255, 255, 255, 0))
draw = ImageDraw.Draw(overlay)

# -------- تنظیمات فونت‌ها (بسته به سیستم می‌تونی فونت دلخواه رو استفاده کنی) --------
try:
    font_title = ImageFont.truetype("Vazirmatn-Bold.ttf", 22)
    font_label = ImageFont.truetype("Vazirmatn-Regular.ttf", 18)
    font_button = ImageFont.truetype("Vazirmatn-Bold.ttf", 20)
    font_small = ImageFont.truetype("Vazirmatn-Regular.ttf", 16)
except (OSError, IOError):
    font_title = ImageFont.truetype("arial.ttf", 22)
    font_label = ImageFont.truetype("arial.ttf", 18)
    font_button = ImageFont.truetype("arial.ttf", 20)
    font_small = ImageFont.truetype("arial.ttf", 16)

# -------- کادر لاگین --------
box_width = int(width * 0.28)
box_height = int(height * 0.40)
box_x = int(width * 0.67)
box_y = int(height * 0.20)

draw.rounded_rectangle(
    [box_x, box_y, box_x + box_width, box_y + box_height],
    radius=20,
    fill=(255, 255, 255, 240)
)

# -------- محتوای داخل کادر لاگین --------
draw.text((box_x + 20, box_y + 20), "سیستم جامع هوش تجاری", font=font_title, fill=(0, 0, 0))
draw.text((box_x + 20, box_y + 55), "XRay Global", font=font_title, fill=(0, 0, 0))

# فیلدهای ورودی
field_y = box_y + 100
field_height = 35

draw.text((box_x + 20, field_y - 22), "نام کاربری", font=font_label, fill=(50, 50, 50))
draw.rectangle([box_x + 20, field_y, box_x + box_width - 20, field_y + field_height], fill=(240, 240, 240))

field_y += field_height + 45
draw.text((box_x + 20, field_y - 22), "رمز عبور", font=font_label, fill=(50, 50, 50))
draw.rectangle([box_x + 20, field_y, box_x + box_width - 20, field_y + field_height], fill=(240, 240, 240))

# دکمه ورود
btn_y = field_y + field_height + 30
btn_text = "ورود به سیستم"
btn_w = box_width - 80
btn_x = box_x + 40

draw.rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + 40], fill=(0, 123, 255))
text_width, _ = draw.textsize(btn_text, font=font_button)
draw.text((btn_x + (btn_w - text_width) // 2, btn_y + 8), btn_text, font=font_button, fill=(255, 255, 255))

# -------- متن بالا سمت راست --------
top_text = "Hitachi   XRay Global Analytics"
draw.text((width - 420, 30), top_text, font=font_label, fill=(0, 240, 255))

# -------- متن پایین وسط --------
bottom_text = "© 2005–2025 Hitachi      All Rights Reserved"
bt_width, _ = draw.textsize(bottom_text, font=font_small)
bt_x = (width - bt_width) // 2
bt_y = height - 30
draw.text((bt_x + 1, bt_y + 1), bottom_text, font=font_small, fill=(0, 0, 0))  # سایه
draw.text((bt_x, bt_y), bottom_text, font=font_small, fill=(255, 255, 255))

# ترکیب تصویر نهایی
final_image = Image.alpha_composite(img, overlay).convert("RGB")
final_image.save(output_path)
print("✅ تصویر نهایی با موفقیت ساخته شد:", output_path)

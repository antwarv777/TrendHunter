"""
Телеграм-бот доставки гайдов для «Охотника за трендами» (MVP).

Что делает:
  /start            — приветствие + список доступных гайдов
  /get <id>         — отправляет файл гайда из папки guides/<id>.pdf (или .txt)
  /broadcast <текст>— рассылка всем, кто писал боту (только для ADMIN_ID)

Запуск:
  1. Получи токен у @BotFather, вставь в .env (рядом: BOT_TOKEN=...).
  2. Напиши боту в Telegram, возьми свой chat_id из консоли (бот его напечатает)
     и впиши его в .env как ADMIN_ID.
  3. python bot.py

Зависимости: requests (pip install requests).
"""
import json
import os
import time
from pathlib import Path

import requests

BASE = Path(__file__).parent
GUIDES = BASE / 'guides'
ENV_FILE = BASE / '.env'
CHAT_IDS_FILE = BASE / 'chat_ids.json'
API = 'https://api.telegram.org/bot{token}/{method}'

# --- конфиг из .env ---
env = {}
if ENV_FILE.exists():
    for line in ENV_FILE.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()

BOT_TOKEN = env.get('BOT_TOKEN', '')
ADMIN_ID = env.get('ADMIN_ID', '')

# Список трендов тянем из данных приложения (id + title + is_free)
TRENDS_FILE = BASE.parent / 'src' / 'data' / 'trends.json'


def load_trends():
    try:
        return json.loads(TRENDS_FILE.read_text(encoding='utf-8'))['trends']
    except Exception:
        return []


def find_guide_file(trend_id: str):
    for ext in ('.pdf', '.txt'):
        p = GUIDES / f'{trend_id}{ext}'
        if p.exists():
            return p
    return None


# --- хранилище chat_id (для рассылки) ---
def load_chat_ids():
    try:
        return set(json.loads(CHAT_IDS_FILE.read_text('utf-8')))
    except Exception:
        return set()


def save_chat_id(chat_id):
    ids = load_chat_ids()
    if str(chat_id) not in ids:
        ids.add(str(chat_id))
        CHAT_IDS_FILE.write_text(json.dumps(sorted(ids), ensure_ascii=False, indent=2), 'utf-8')


# --- Telegram API ---
def call(method, **params):
    r = requests.post(API.format(token=BOT_TOKEN, method=method), json=params, timeout=30)
    return r.json()


def send_message(chat_id, text):
    call('sendMessage', chat_id=chat_id, text=text)


def send_document(chat_id, path: Path):
    with open(path, 'rb') as f:
        requests.post(
            API.format(token=BOT_TOKEN, method='sendDocument'),
            data={'chat_id': chat_id},
            files={'document': (path.name, f)},
            timeout=60,
        )


def trends_menu():
    lines = ['Доступные гайды:', '']
    for t in load_trends():
        f = find_guide_file(t['id'])
        status = 'доступен' if f else 'файл не загружен'
        price = 'бесплатно' if t['isFree'] else f"{t['recommendedPrice']} ₽"
        lines.append(f"/get {t['id']} — {t['title']} ({price}, {status})")
    return '\n'.join(lines)


def handle_update(u):
    msg = u.get('message') or {}
    chat_id = msg.get('chat', {}).get('id')
    text = (msg.get('text') or '').strip()
    if not chat_id or not text:
        return

    save_chat_id(chat_id)

    if text == '/start':
        send_message(chat_id, 'Привет! Здесь ты получишь купленные гайды «Охотника за трендами».\n\n' + trends_menu())
    elif text.startswith('/get'):
        parts = text.split()
        if len(parts) < 2:
            send_message(chat_id, 'Укажи id гайда: /get <id>. Список — /start')
            return
        trend_id = parts[1]
        t = next((t for t in load_trends() if t['id'] == trend_id), None)
        if not t:
            send_message(chat_id, 'Такого тренда нет. Список — /start')
            return
        # MVP: гайды бесплатных трендов выдаём всем. Платные — только админу,
        # пока не подключена проверка оплаты.
        if not t['isFree'] and str(chat_id) != ADMIN_ID:
            send_message(chat_id, 'Этот гайд платный. Покупка: через Mini App (кнопка «Купить»).')
            return
        f = find_guide_file(trend_id)
        if not f:
            send_message(chat_id, f"Файл для «{t['title']}» пока не загружен. Загрузи его в папку telegram/guides/{trend_id}.pdf")
            return
        send_document(chat_id, f)
        send_message(chat_id, f"Гайд «{t['title']}». Успешного запуска!")
    elif text.startswith('/broadcast'):
        if str(chat_id) != ADMIN_ID:
            send_message(chat_id, 'Только для админа.')
            return
        body = text[len('/broadcast'):].strip()
        if not body:
            send_message(chat_id, 'Формат: /broadcast текст сообщения')
            return
        for cid in load_chat_ids():
            send_message(cid, body)
        send_message(chat_id, 'Отправлено всем.')
    else:
        send_message(chat_id, 'Команды: /start, /get <id>.')


def main():
    if not BOT_TOKEN:
        raise SystemExit('Нет BOT_TOKEN. Создай файл telegram/.env со строкой BOT_TOKEN=твой_токен')
    GUIDES.mkdir(exist_ok=True)
    offset = 0
    print('Бот запущен. Напиши ему в Telegram — в консоли появится твой chat_id.')
    while True:
        try:
            r = requests.post(API.format(token=BOT_TOKEN, method='getUpdates'),
                              json={'offset': offset, 'timeout': 30}, timeout=40)
            for u in r.json().get('result', []):
                offset = u['update_id'] + 1
                msg = u.get('message') or {}
                cid = msg.get('chat', {}).get('id')
                if cid and ADMIN_ID == '':
                    print(f'Tвой chat_id: {cid} — впиши его в telegram/.env как ADMIN_ID=...')
                handle_update(u)
        except Exception as e:
            print('Ошибка, перезапуск через 5 сек:', e)
            time.sleep(5)


if __name__ == '__main__':
    main()

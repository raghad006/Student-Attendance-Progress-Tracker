import random
import re

NON_ALNUM = re.compile(r'[^a-z0-9]')

def clean_name_part(s: str) -> str:
    return NON_ALNUM.sub('', s.strip().lower())

def parse_full_name(full_name: str):
    parts = [p for p in full_name.strip().split() if p]
    if not parts:
        return ("u", "user")
    first_initial = parts[0][0].lower()
    last_word = parts[-1].lower()
    return (first_initial, last_word)

def generate_unique_user_id_and_username(full_name: str, role: str):
    from .models import User

    prefix = "STU" if role == getattr(User, "STUDENT") else "TCR"
    fi, last_word = parse_full_name(full_name)
    cleaned_last = clean_name_part(last_word) or "user"

    for _ in range(10000):
        num = random.randint(0, 999999)
        id_number = f"{num:06d}"
        user_id = f"{prefix}{id_number}"

        if not User.objects.filter(user_id=user_id).exists():
            last3 = id_number[-3:]
            base_username = f"{fi}.{cleaned_last}{last3}"
            username = base_username
            suffix = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{suffix}"
                suffix += 1
            return user_id, username

    raise RuntimeError("Unable to generate unique user id/username after 10000 attempts")

import random
import string

def generate_password(length, use_upper, use_lower, use_digits, use_special):
    character_pool = ''
    if use_upper:
        character_pool += string.ascii_uppercase
    if use_lower:
        character_pool += string.ascii_lowercase
    if use_digits:
        character_pool += string.digits
    if use_special:
        character_pool += string.punctuation

    if not character_pool:
        raise ValueError("No character types selected! Please select at least one character type.")

    password = ''.join(random.choice(character_pool) for _ in range(length))
    return password

def main():
    print("Password Generator")
    try:
        length = int(input("Enter the length of the password: "))
        use_upper = input("Include uppercase letters? (yes/no): ").strip().lower() == 'yes'
        use_lower = input("Include lowercase letters? (yes/no): ").strip().lower() == 'yes'
        use_digits = input("Include digits? (yes/no): ").strip().lower() == 'yes'
        use_special = input("Include special characters? (yes/no): ").strip().lower() == 'yes'

        password = generate_password(length, use_upper, use_lower, use_digits, use_special)
        print(f"Generated password: {password}")

    except ValueError as ve:
        print(ve)

if __name__ == "__main__":
    main()

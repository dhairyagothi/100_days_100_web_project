from itertools import permutations

def check_palindrome(string):
    l=[]
    for i in range(0,len(string)):
        l.append(string[i])
    l_rev = l[::-1]
    if (l==l_rev):
        return True
    else:
        return False


def gen_palindrome(string):
    palindromes = set()
    for p in permutations(string):
        p_str = ''.join(p)
        if check_palindrome(p_str):
            palindromes.add(p_str)
    return palindromes

def check_palindrome_and_generate(s):
    possible_palindromes = gen_palindrome(s)
    print("All Possible Palindromes are: " , possible_palindromes)


str = input("Enter the String: ")
check_palindrome_and_generate(str)

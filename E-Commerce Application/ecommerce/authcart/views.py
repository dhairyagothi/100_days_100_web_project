from tokenize import generate_tokens
from django.shortcuts import render,redirect,HttpResponse
from django.contrib import messages
from django.views import View
# Create your views here.
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str,DjangoUnicodeDecodeError
from .utils import TokenGenerator , generate_token
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
# Create your views here.
def signup(request):
    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['pass1']
        confirm_password = request.POST['pass2']
        
        if password != confirm_password:
            messages.warning(request, "Password is not matching ")
            return render(request, 'signup.html')

        try:
            if User.objects.get(username=email):
                messages.warning(request, "email already exists") 
                return render(request, 'signup.html')
                # return HttpResponse("email already exists")
                # return render(request, 'auth/signup.html')
        except Exception as identifier:
            pass
        user = User.objects.create_user(email, email, password)
        user.is_active = False
        user.save()
        email_subject = "Activate your account"
        message=render_to_string('authentication/activate.html', {
            'user': user,
            'domain': '127.0.0.1:8000',
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': generate_token.make_token(user),
        })
        email_message = EmailMessage(
            email_subject,
            message,
            settings.EMAIL_HOST_USER,
            [email],)
        email_message.send()
        messages.success(request, "User created, Please verify your email !")
        return redirect('/auth/signup')
    
    return render(request, 'signup.html')

class ActivateAccountViews(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception as identifier:
            user = None
        if user is not None and generate_token.check_token(user, token):
            user.is_active = True
            user.save()
            messages.success(request, "Account activated successfully, now you can login!! ")
            return redirect('/auth/signup')
        return render(request,'authentication/activatefail.html')



def handlelogin(request):
    try:
        if request.method == "POST":
            username = request.POST['email']
            userpassword = request.POST['pass1']
            myuser = authenticate(username=username, password=userpassword)
            if myuser is not None:
                login(request, myuser)
                messages.success(request, "Login successful")
                return redirect('/')
            else:
                messages.warning(request, "Invalid password")
                return redirect('/auth/login')
    except Exception as e:
        messages.error(request, f"An error occurred: {e}")
        return redirect('/auth/login')
    return render(request,'authentication/login.html')

def handlelogout(request):
    logout(request)
    messages.info(request, "Logout successful")
    return redirect('/auth/login')
class RequestResetEmailView(View):
    def get(self, request):
        return render(request, 'authentication/request-reset-email.html')
    
    def post(self, request):
        email = request.POST.get('email')
        user = User.objects.filter(email=email)

        if user.exists():
            # current_site = get_current_site(request)
            email_subject = '[Reset Your Password]'
            message = render_to_string('authentication/reset-user-password.html', {
                'domain': '127.0.0.1:8000',
                'uid': urlsafe_base64_encode(force_bytes(user[0].pk)),
                'token': PasswordResetTokenGenerator().make_token(user[0])
            })

         # Email sending logic
            email_message = EmailMessage(email_subject, message, settings.EMAIL_HOST_USER, [email])
            email_message.send()

            messages.info(request, "We have sent you an email with instructions on how to reset the password.")
            return render(request, 'authentication/request-reset-email.html')

        # If no user exists with the provided email, show an appropriate message
        messages.error(request, "No account found with this email address.")
        return render(request, 'authentication/request-reset-email.html')


class SetNewPasswordView(View):
    def get(self,request,uidb64,token):
        context = {
            'uidb64':uidb64,
            'token':token
        }
        try:
            user_id=force_str(urlsafe_base64_decode(uidb64))
            user=User.objects.get(pk=user_id)

            if  not PasswordResetTokenGenerator().check_token(user,token):
                messages.warning(request,"Password Reset Link is Invalid")
                return render(request,'authentication/request-reset-email.html')

        except DjangoUnicodeDecodeError as identifier:
            pass

        return render(request,'authentication/set-new-password.html',context)

    def post(self,request,uidb64,token):
        context={
            'uidb64':uidb64,
            'token':token
        }
        password=request.POST['pass1']
        confirm_password=request.POST['pass2']
        if password!=confirm_password:
            messages.warning(request,"Password is Not Matching")
            return render(request,'authentication/set-new-password.html',context)
        
        try:
            user_id=force_str(urlsafe_base64_decode(uidb64))
            user=User.objects.get(pk=user_id)
            user.set_password(password)
            user.save()
            messages.success(request,"Password Reset Success Please Login with NewPassword")
            return redirect('/auth/login/')

        except DjangoUnicodeDecodeError as identifier:
            messages.error(request,"Something Went Wrong")
            return render(request,'authentication/set-new-password.html',context)

        return render(request,'authentication/set-new-password.html',context)


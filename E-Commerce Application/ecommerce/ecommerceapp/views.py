from math import ceil
from django.shortcuts import render, redirect
from ecommerceapp.models import Contact, Product, Orders, OrderUpdate
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from PayTm import Checksum
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes,force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from ecommerceapp import keys 

# Define your MERCHANT_KEY here
MERCHANT_KEY = 'your_merchant_key_here'
# Create your views here.
def index(request):
    allProds=[]
    catprods=Product.objects.values('category','id')
    cats={item['category'] for item in catprods}
    for cat in cats:
        prod=Product.objects.filter(category=cat)
        nSlides=len(prod)//4 + ceil((len(prod)/4)-(len(prod)//4))
        allProds.append([prod,range(1,nSlides),nSlides])
    params={'allProds':allProds}
    return render(request, 'index.html',params)



def contact(request):
    if request.method=='POST':
        name = request.POST['name']
        email = request.POST['email']
        desc = request.POST['desc']
        phonenumber = request.POST['pnumber']
        myquery=Contact(name=name, email=email, desc=desc, phonenumber=phonenumber)
        print(name, email, desc, phonenumber) 
        myquery.save()
        messages.success(request, 'Your message has been sent!')
        return render(request, 'contact.html')
    return render(request, 'contact.html')

def checkout(request):
    if not request.user.is_authenticated:
        messages.warning(request,"Login & Try Again")
        return redirect('/auth/login')
    if request.method=="POST":
        items_json = request.POST.get('itemsJson', '')
        name = request.POST.get('name', '')
        amount = request.POST.get('amt')
        email = request.POST.get('email', '')
        address1 = request.POST.get('address1', '')
        address2 = request.POST.get('address2','')
        city = request.POST.get('city', '')
        state = request.POST.get('state', '')
        zip_code = request.POST.get('zip_code', '')
        phone = request.POST.get('phone', '')
        Order = Orders(items_json=items_json,name=name,amount=amount, email=email, address1=address1,address2=address2,city=city,state=state,zip_code=zip_code,phone=phone)
        print(amount)
        Order.save()
        update = OrderUpdate(order_id=Order.order_id,update_desc="the order has been placed")
        update.save()
        thank = True
        # # PAYMENT INTEGRATION

        id = Order.order_id
        oid=str(id)+"ShopyCart"
        param_dict = {

            'MID':keys.MID,
            'ORDER_ID': oid,
            'TXN_AMOUNT': str(amount),
            'CUST_ID': email,
            'INDUSTRY_TYPE_ID': 'Retail',
            'WEBSITE': 'WEBSTAGING',
            'CHANNEL_ID': 'WEB',
            'CALLBACK_URL': 'http://127.0.0.1:8000/handlerequest/',

        }
        param_dict['CHECKSUMHASH'] = Checksum.generate_checksum(param_dict, MERCHANT_KEY)
        return render(request, 'paytm.html', {'param_dict': param_dict})

    return render(request, 'checkout.html')


@csrf_exempt
def handlerequest(request):
    # paytm will send you post request here
    form = request.POST
    response_dict = {}
    for i in form.keys():
        response_dict[i] = form[i]
        if i == 'CHECKSUMHASH':
            checksum = form[i]

    verify = Checksum.verify_checksum(response_dict, MERCHANT_KEY, checksum)
    if verify:
        if response_dict['RESPCODE'] == '01':
            print('order successful')
            a=response_dict['ORDERID']
            b=response_dict['TXNAMOUNT']
            rid=a.replace("ShopyCart","")
           
            print(rid)
            filter2= Orders.objects.filter(order_id=rid)
            print(filter2)
            print(a,b)
            for post1 in filter2:

                post1.oid=a
                post1.amountpaid=b
                post1.paymentstatus="PAID"
                post1.save()
            print("run agede function")
        else:
            print('order was not successful because' + response_dict['RESPMSG'])
    return render(request, 'paymentstatus.html', {'response': response_dict})


def about(request):
    if not request.user.is_authenticated:
        messages.warning(request, "Login & Try Again")
        return redirect('/auth/login')
    currentuser = request.user.email.split('@')[0]
    items = Orders.objects.filter(email=request.user.email)
    for i in items:
        print(i.oid)
        myid = i.oid
        rid = myid.replace("ShopyCart", "")
        print(rid)
    try:
        order_id = int(rid)
        status = OrderUpdate.objects.filter(order_id=order_id)
        for j in status:
            print(j.update_desc)
    except ValueError:
        status = []
        print("Invalid order ID:", rid)

    context = {"items": items, "status": status,"currentuser": currentuser}
    return render(request, "profile.html", context)

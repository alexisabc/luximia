from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Venta)
admin.site.register(DetalleVenta)
admin.site.register(MetodoPagoVenta)
admin.site.register(Usuario)
admin.site.register(Articulo)
admin.site.register(Cliente)
admin.site.register(Precio)
admin.site.register(ListaPrecio)
admin.site.register(ListaPrecioCliente)
admin.site.register(MetodoPago)
admin.site.register(Credito)
admin.site.register(AbonoCredito)
admin.site.register(Caja)
admin.site.register(SaldoMetodoPago)
admin.site.register(MovimientoCaja)
admin.site.register(CorteCaja)
admin.site.register(Anticipo)
admin.site.register(AbonoAnticipo)
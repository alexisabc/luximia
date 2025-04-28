from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.contrib.auth.hashers import make_password, check_password
# Create your models here.


class Venta(models.Model):
    fecha = models.DateTimeField()
    id_usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)
    id_cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    iva = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'Venta'


class DetalleVenta(models.Model):
    id_venta = models.ForeignKey('Venta', on_delete=models.CASCADE)
    id_articulo = models.ForeignKey('Articulo', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'DetalleVenta'


class MetodoPagoVenta(models.Model):
    id_venta = models.ForeignKey('Venta', on_delete=models.CASCADE)
    id_metodo_pago = models.ForeignKey('MetodoPago', on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'MetodoPagoVenta'


class Usuario(models.Model):
    nombre = models.CharField(max_length=255)
    usuario = models.CharField(max_length=255, unique=True)
    contrasena = models.CharField(max_length=255)
    rol = models.CharField(max_length=255)
    status = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.pk or 'contrasena' in kwargs.get('update_fields', []):
            self.contrasena = make_password(self.contrasena)
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'Usuario'

class Articulo(models.Model):
    clave = models.CharField(max_length=255)
    nombre = models.CharField(max_length=255)
    um = models.CharField(max_length=255)  # Unidad de medida
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'Articulo'


class Cliente(models.Model):
    clave = models.CharField(max_length=255, unique=True)
    representante = models.CharField(max_length=255)
    nombre = models.CharField(max_length=255)
    rfc = models.CharField(max_length=255)
    domicilio = models.CharField(max_length=255)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'Cliente'


class Precio(models.Model):
    id_articulo = models.ForeignKey('Articulo', on_delete=models.CASCADE)
    id_lista_precio = models.ForeignKey(
        'ListaPrecio', on_delete=models.CASCADE)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'Precio'


class ListaPrecio(models.Model):
    descripcion = models.CharField(max_length=255)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'ListaPrecio'


class ListaPrecioCliente(models.Model):
    id_cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    id_lista_precio = models.ForeignKey(
        'ListaPrecio', on_delete=models.CASCADE)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'ListaPrecioCliente'


class MetodoPago(models.Model):
    descripcion = models.CharField(max_length=255)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'MetodoPago'


class Credito(models.Model):
    id_cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    limite_credito = models.DecimalField(max_digits=10,decimal_places=2,validators=[MinValueValidator(0.01)])
    saldo_disponible = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    deuda_total = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'Credito'


class AbonoCredito(models.Model):
    fecha = models.DateTimeField()
    id_usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)
    id_cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    id_metodo_pago = models.ForeignKey('MetodoPago', on_delete=models.CASCADE)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'AbonoCredito'

class Caja(models.Model):
    descripcion = models.CharField(max_length=255)
    saldo_inicial = models.DecimalField(max_digits=10, decimal_places=2)
    saldo_actual = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'Caja'


class SaldoMetodoPago(models.Model):
    id_caja = models.ForeignKey('Caja', on_delete=models.CASCADE)
    id_metodo_pago = models.ForeignKey('MetodoPago', on_delete=models.CASCADE)
    saldo_inicial = models.DecimalField(max_digits=10, decimal_places=2)
    saldo_actual = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'SaldoMetodoPago'


class MovimientoCaja(models.Model):
    fecha = models.DateTimeField()
    id_caja = models.ForeignKey('Caja', on_delete=models.CASCADE)
    id_metodo_pago = models.ForeignKey('MetodoPago', on_delete=models.CASCADE)
    tipo_movimiento = models.CharField(max_length=255)
    descripcion = models.CharField(max_length=255)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'MovimientoCaja'

class CorteCaja(models.Model):
    fecha = models.DateTimeField()
    id_usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)
    id_caja = models.ForeignKey('Caja', on_delete=models.CASCADE)
    saldo_inicial = models.DecimalField(max_digits=10, decimal_places=2)
    saldo_final = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'CorteCaja'


class Anticipo(models.Model):
    id_cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    saldo_inicial = models.DecimalField(max_digits=10, decimal_places=2)
    saldo_disponible = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'Anticipo'


class AbonoAnticipo(models.Model):
    fecha = models.DateTimeField()
    id_usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)
    id_cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    id_metodo_pago = models.ForeignKey('MetodoPago', on_delete=models.CASCADE)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'AbonoAnticipo'

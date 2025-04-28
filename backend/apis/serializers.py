from .models import Credito
from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password


class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'


class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = '__all__'


class MetodoPagoVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoPagoVenta
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nombre', 'usuario', 'contrasena', 'rol', 'status']
        extra_kwargs = {
            'contrasena': {'write_only': True}
        }

    def create(self, validated_data):
        return super().create(validated_data)


class LoginSerializer(serializers.Serializer):
    usuario = serializers.CharField()
    contrasena = serializers.CharField()



class ArticuloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Articulo
        fields = '__all__'


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'


class PrecioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Precio
        fields = '__all__'


class ListaPrecioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListaPrecio
        fields = '__all__'


class ListaPrecioClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListaPrecioCliente
        fields = '__all__'


class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoPago
        fields = '__all__'


class CreditoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credito
        fields = [
            'id',
            'limite_credito',
            'saldo_disponible',
            'deuda_total',
            'status'
        ]
        read_only_fields = ['id', 'limite_credito', 'status']

    saldo_disponible = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=False,
        min_value=Decimal('0.00')
    )

    deuda_total = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=False,
        min_value=Decimal('0.00')
    )

    def validate(self, data):
        instance = self.instance

        # Validación de límite de crédito vs saldo disponible
        if 'saldo_disponible' in data:
            limite_credito = instance.limite_credito if instance else self.initial_data.get(
                'limite_credito')

            if data['saldo_disponible'] > limite_credito:
                raise serializers.ValidationError({
                    'saldo_disponible': 'No puede exceder el límite de crédito'
                })

        # Validación de consistencia entre saldo y deuda
        if instance and 'deuda_total' in data:
            if data['deuda_total'] > instance.limite_credito:
                raise serializers.ValidationError({
                    'deuda_total': 'La deuda no puede exceder el límite de crédito'
                })

        return data


class ClienteConCreditoSerializer(serializers.ModelSerializer):
    credito = serializers.SerializerMethodField()

    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'credito']

    def get_credito(self, obj):
        try:
            credito = obj.credito_set.get(status=True, deuda_total__gt=0)
            return {
                "id": credito.id,
                "limite": credito.limite_credito,
                "deuda": credito.deuda_total,
                "saldo": credito.saldo_disponible
            }
        except Credito.DoesNotExist:
            return None
        except Exception as e:
            print(f"Error serializando crédito: {str(e)}")
            return None

class AbonoCreditoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbonoCredito
        fields = '__all__'


class CajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caja
        fields = '__all__'


class SaldoMetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaldoMetodoPago
        fields = '__all__'


class MovimientoCajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovimientoCaja
        fields = '__all__'


class CorteCajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CorteCaja
        fields = '__all__'


class AnticipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anticipo
        fields = '__all__'


class AbonoAnticipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbonoAnticipo
        fields = '__all__'

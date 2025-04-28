from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from django.contrib.auth.hashers import check_password


class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer


class DetalleVentaViewSet(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer


class MetodoPagoVentaViewSet(viewsets.ModelViewSet):
    queryset = MetodoPagoVenta.objects.all()
    serializer_class = MetodoPagoVentaSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer  # <-- Este debe estar dentro de la clase

    @action(detail=False, methods=['POST'], url_path='login')
    def login(self, request):  # <-- Asegúrate de que esté indentado correctamente
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        try:
            user = Usuario.objects.get(
                usuario=serializer.validated_data['usuario'])
            if not check_password(serializer.validated_data['contrasena'], user.contrasena):
                return Response({"detail": "Contraseña incorrecta"}, status=400)

            return Response({
                "user": UsuarioSerializer(user).data,
                "message": "Login exitoso"
            })
        except Usuario.DoesNotExist:
            return Response({"detail": "Usuario no encontrado"}, status=404)


class ArticuloViewSet(viewsets.ModelViewSet):
    queryset = Articulo.objects.all()
    serializer_class = ArticuloSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


class PrecioViewSet(viewsets.ModelViewSet):
    queryset = Precio.objects.all()
    serializer_class = PrecioSerializer


class ListaPrecioViewSet(viewsets.ModelViewSet):
    queryset = ListaPrecio.objects.all()
    serializer_class = ListaPrecioSerializer


class ListaPrecioClienteViewSet(viewsets.ModelViewSet):
    queryset = ListaPrecioCliente.objects.all()
    serializer_class = ListaPrecioClienteSerializer


class MetodoPagoViewSet(viewsets.ModelViewSet):
    queryset = MetodoPago.objects.all()
    serializer_class = MetodoPagoSerializer


class CreditoViewSet(viewsets.ModelViewSet):
    queryset = Credito.objects.all()
    serializer_class = CreditoSerializer


class ClientesConCreditoActivoViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            clientes = Cliente.objects.filter(
                credito__status=True,
                credito__deuda_total__gt=0
            ).distinct().prefetch_related('credito_set')

            serializer = ClienteConCreditoSerializer(clientes, many=True)
            # Filtrar clientes que realmente tienen crédito
            filtered_data = [
                item for item in serializer.data if item['credito'] is not None]
            return Response(filtered_data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class AbonoCreditoViewSet(viewsets.ModelViewSet):
    queryset = AbonoCredito.objects.all()
    serializer_class = AbonoCreditoSerializer


class CajaViewSet(viewsets.ModelViewSet):
    queryset = Caja.objects.all()
    serializer_class = CajaSerializer


class SaldoMetodoPagoViewSet(viewsets.ModelViewSet):
    queryset = SaldoMetodoPago.objects.all()
    serializer_class = SaldoMetodoPagoSerializer


class MovimientoCajaViewSet(viewsets.ModelViewSet):
    queryset = MovimientoCaja.objects.all()
    serializer_class = MovimientoCajaSerializer


class CorteCajaViewSet(viewsets.ModelViewSet):
    queryset = CorteCaja.objects.all()
    serializer_class = CorteCajaSerializer


class AnticipoViewSet(viewsets.ModelViewSet):
    queryset = Anticipo.objects.all()
    serializer_class = AnticipoSerializer


class AbonoAnticipoViewSet(viewsets.ModelViewSet):
    queryset = AbonoAnticipo.objects.all()
    serializer_class = AbonoAnticipoSerializer

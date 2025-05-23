from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .api import *

router = DefaultRouter()
router.register(r'ventas', VentaViewSet)
router.register(r'detalleventas', DetalleVentaViewSet)
router.register(r'metodopagoventas', MetodoPagoVentaViewSet)
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'articulos', ArticuloViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'precios', PrecioViewSet)
router.register(r'listaprecios', ListaPrecioViewSet)
router.register(r'listaprecioclientes', ListaPrecioClienteViewSet)
router.register(r'metodospago', MetodoPagoViewSet)
router.register(r'creditos', CreditoViewSet)
router.register(r'clientes-con-credito',ClientesConCreditoActivoViewSet, basename='clientes-con-credito')
router.register(r'abonocreditos', AbonoCreditoViewSet)
router.register(r'cajas', CajaViewSet)
router.register(r'saldometodospago', SaldoMetodoPagoViewSet)
router.register(r'movimientoscaja', MovimientoCajaViewSet)
router.register(r'cortescaja', CorteCajaViewSet)
router.register(r'anticipos', AnticipoViewSet)
router.register(r'abonoanticipos', AbonoAnticipoViewSet)

urlpatterns = [
    # Endpoints JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Incluir los routers después de los endpoints específicos
    path('', include(router.urls)),
]

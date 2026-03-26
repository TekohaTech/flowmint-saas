#!/bin/bash

# Script de prueba para verificar que el backend funciona correctamente

echo "🧪 Iniciando pruebas del backend FlowMint..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL base
BASE_URL="http://localhost:3000"

# Contador de tests
PASSED=0
FAILED=0

# Función para hacer requests
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    local expected_code=${5:-200}

    echo -n "🔍 Probando: $description... "

    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code, esperado $expected_code)"
        ((FAILED++))
        return 1
    fi
}

# Test con token
test_endpoint_with_token() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    local description=$5
    local expected_code=${6:-201} # Default to 201 for creation

    echo -n "🔍 Probando: $description... "

    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data" 2>/dev/null)
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code, esperado $expected_code)"
        echo -e "   Response body: $body"
        ((FAILED++))
        return 1
    fi
}

test_with_token() {
    local method=$1
    local endpoint=$2
    local token=$3
    local description=$4
    local expected_code=${5:-200}

    echo -n "🔍 Probando: $description... "

    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
        -H "Authorization: Bearer $token" 2>/dev/null)

    http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code, esperado $expected_code)"
        ((FAILED++))
        return 1
    fi
}

echo "=========================================="
echo "  PRUEBAS DE CONECTIVIDAD"
echo "=========================================="
echo ""

# Verificar que el servidor esté corriendo
echo -n "🔍 Verificando servidor... "
if curl -s "$BASE_URL/api" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Servidor corriendo${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Servidor no responde${NC}"
    echo ""
    echo "💡 Tip: Ejecuta 'npm run start:dev' en otra terminal"
    exit 1
fi

echo ""
echo "=========================================="
echo "  PRUEBAS DE AUTENTICACIÓN"
echo "=========================================="
echo ""

# Login con admin
echo -n "🔍 Probando login admin... "
login_response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"user":"carlos","pass":"admin123"}')

if echo "$login_response" | grep -q "access_token"; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((PASSED++))
    TOKEN=$(echo "$login_response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    echo "   Token obtenido: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ FAILED${NC}"
    ((FAILED++))
    echo "   Respuesta: $login_response"
fi

# Login con credenciales incorrectas
test_endpoint "POST" "/api/auth/login" \
    '{"user":"admin","pass":"wrongpassword"}' \
    "Login con password incorrecto" \
    401

echo ""
echo "=========================================="
echo "  PRUEBAS DE ENDPOINTS PÚBLICOS"
echo "=========================================="
echo ""

# Roles
test_endpoint "GET" "/api/roles" "" "Listar roles"

if [ -n "$TOKEN" ]; then
    # Protected endpoints
    test_with_token "GET" "/api/usuarios" "$TOKEN" "Listar usuarios (protegido)"
    test_with_token "GET" "/api/clientes" "$TOKEN" "Listar clientes (protegido)"
    test_with_token "GET" "/api/empleados" "$TOKEN" "Listar empleados (protegido)"
    test_with_token "GET" "/api/servicios" "$TOKEN" "Listar servicios (protegido)"
    test_with_token "GET" "/api/turnos" "$TOKEN" "Listar turnos (protegido)"
else
    echo -e "${YELLOW}⚠️  Saltando pruebas de listado protegido (no hay token)${NC}"
fi

echo ""
echo "=========================================="
echo "  PRUEBAS DE ENDPOINTS INDIVIDUALES"
echo "=========================================="
echo ""

# Ver un rol específico
test_endpoint "GET" "/api/roles/1" "" "Obtener rol por ID"

if [ -n "$TOKEN" ]; then
    # Protected endpoints
    test_with_token "GET" "/api/usuarios/1" "$TOKEN" "Obtener usuario por ID (protegido)"
    test_with_token "GET" "/api/clientes/1" "$TOKEN" "Obtener cliente por ID (protegido)"
    test_with_token "GET" "/api/empleados/1" "$TOKEN" "Obtener empleado por ID (protegido)"
    test_with_token "GET" "/api/servicios/1" "$TOKEN" "Obtener servicio por ID (protegido)"
    test_with_token "GET" "/api/turnos/1" "$TOKEN" "Obtener turno por ID (protegido)"
else
    echo -e "${YELLOW}⚠️  Saltando pruebas de detalle protegido (no hay token)${NC}"
fi

echo ""
echo "=========================================="
echo "  PRUEBAS DE ENDPOINTS PROTEGIDOS"
echo "=========================================="
echo ""

if [ -n "$TOKEN" ]; then
    test_with_token "GET" "/api/auth/me" "$TOKEN" "Obtener perfil autenticado"

    echo ""
    echo "=========================================="
    echo "  PRUEBAS DE CREACIÓN PROTEGIDA"
    echo "=========================================="
    echo ""

    # Generate a unique username for the test
    unique_user="testuser_$(date +%s)"
    test_endpoint_with_token "POST" "/api/usuarios" \
        "{\"nombre\":\"Test\",\"apellido\":\"User\",\"user\":\"$unique_user\",\"pass\":\"password123\",\"rol_id\":2}" \
        "$TOKEN" \
        "Crear nuevo usuario (rol Empleado)" \
        201
else
    echo -e "${YELLOW}⚠️  Saltando pruebas protegidas (no hay token)${NC}"
fi

echo ""
echo "=========================================="
echo "  PRUEBAS DE CREACIÓN"
echo "=========================================="
echo ""

if [ -n "$TOKEN" ]; then
    # Crear un cliente
    unique_email="test_$(date +%s)@test.com"
    test_endpoint_with_token "POST" "/api/clientes" \
        "{\"nombre\":\"Test\",\"apellido\":\"Cliente\",\"telefono\":\"+54 11 9999-9999\",\"email\":\"$unique_email\"}" \
        "$TOKEN" \
        "Crear nuevo cliente (protegido)" \
        201 # Expect 201 Created

    # Crear un servicio
    test_endpoint_with_token "POST" "/api/servicios" \
        '{"nombre":"Test Service","descripcion":"Servicio de prueba","precio":25.5,"duracion":45}' \
        "$TOKEN" \
        "Crear nuevo servicio (protegido)" \
        201 # Expect 201 Created
else
    echo -e "${YELLOW}⚠️  Saltando pruebas de creación protegida (no hay token)${NC}"
fi

echo ""
echo "=========================================="
echo "  PRUEBAS DE VALIDACIÓN"
echo "=========================================="
echo ""

if [ -n "$TOKEN" ]; then
    # Crear cliente sin datos requeridos (debe fallar)
    test_endpoint_with_token "POST" "/api/clientes" \
        '{"nombre":""}' \
        "$TOKEN" \
        "Crear cliente sin datos (debe fallar)" \
        400

    # Crear servicio con precio negativo (debe fallar)
    test_endpoint_with_token "POST" "/api/servicios" \
        '{"nombre":"Test","precio":-10,"duracion":30}' \
        "$TOKEN" \
        "Crear servicio con precio negativo (debe fallar)" \
        400
else
    echo -e "${YELLOW}⚠️  Saltando pruebas de validación protegida (no hay token)${NC}"
fi

echo ""
echo "=========================================="
echo "  PRUEBAS DE ERRORES"
echo "=========================================="
echo ""

# Endpoint que no existe
test_endpoint "GET" "/api/noexiste" "" "Endpoint inexistente" 404

# ID que no existe
test_endpoint "GET" "/api/roles/9999" "" "Rol inexistente" 404

echo ""
echo "=========================================="
echo "  RESUMEN"
echo "=========================================="
echo ""

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo "Total de pruebas: $TOTAL"
echo -e "Pasadas: ${GREEN}$PASSED${NC}"
echo -e "Fallidas: ${RED}$FAILED${NC}"
echo "Porcentaje de éxito: $PERCENTAGE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Todas las pruebas pasaron exitosamente!${NC}"
    echo ""
    echo "✅ El backend está funcionando correctamente"
    echo "✅ Todos los endpoints responden"
    echo "✅ La autenticación funciona"
    echo "✅ La base de datos está operativa"
    exit 0
else
    echo -e "${RED}⚠️  Algunas pruebas fallaron${NC}"
    echo ""
    echo "💡 Verifica:"
    echo "   - Que el servidor esté corriendo (npm run start:dev)"
    echo "   - Que la base de datos esté activa (./start-db.sh)"
    echo "   - Que los datos de prueba estén cargados (npm run prisma:seed)"
    exit 1
fi

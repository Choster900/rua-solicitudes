interface SwaggerOptions {
    appName: string
    appUrl: string
}

export function createOpenApiSpec({ appName, appUrl }: SwaggerOptions) {
    return {
        openapi: '3.0.3',
        info: {
            title: `${appName} API`,
            version: '2.0.0',
            description: `
## RUASA ERP — API de Solicitudes de Diseño

Esta API gestiona el ciclo de vida completo de las solicitudes de diseño gráfico:

1. **Vendedor** crea la solicitud y sube archivos de referencia (muestra visual)
2. **Jefe de Diseño** revisa y asigna la solicitud a un diseñador
3. **Diseñador** trabaja y envía a calidad
4. **Calidad** aprueba o rechaza (generando nueva versión si rechaza)
5. **Jefe de Diseño** entrega al vendedor

### Autenticación
Todos los endpoints protegidos requieren un JWT en el header \`Authorization: Bearer <token>\`.
            `.trim(),
            contact: {
                name: 'RUASA ERP',
            },
        },
        servers: [{ url: appUrl }],
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Health', description: 'Estado del servicio' },
            { name: 'Auth', description: 'Autenticación y sesión' },
            { name: 'Requests', description: 'Solicitudes de diseño' },
            {
                name: 'Request Files',
                description: 'Archivos adjuntos a una solicitud (referencias, artes, evidencias)',
            },
            { name: 'Documentation', description: 'OpenAPI y Swagger UI' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // ─── ENUMS ───────────────────────────────────────────
                RequestStatus: {
                    type: 'string',
                    enum: [
                        'CREATED',
                        'PENDING_DESIGN_REVIEW',
                        'ASSIGNED_TO_DESIGNER',
                        'IN_DESIGN',
                        'SENT_TO_QUALITY',
                        'QUALITY_REJECTED',
                        'QUALITY_APPROVED',
                        'DELIVERED_TO_SALES',
                        'CANCELLED',
                    ],
                    description: 'Estado de la solicitud en el flujo de trabajo',
                },
                RequestPriority: {
                    type: 'string',
                    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
                    description: 'Prioridad de atención de la solicitud',
                },
                FileOrigin: {
                    type: 'string',
                    enum: ['SALES', 'DESIGN', 'QUALITY', 'SYSTEM'],
                    description: 'Origen del archivo dentro del flujo',
                },
                FileCategory: {
                    type: 'string',
                    enum: [
                        'SALES_REFERENCE',
                        'DESIGN_SOURCE',
                        'DESIGN_OUTPUT',
                        'QUALITY_EVIDENCE',
                        'FINAL_DELIVERABLE',
                        'OTHER',
                    ],
                    description: 'Categoría que indica el propósito del archivo',
                },

                // ─── REQUEST VERSION (datos técnicos del arte) ────────
                RequestVersionInput: {
                    type: 'object',
                    description:
                        'Especificaciones técnicas del arte solicitado. Todos los campos son opcionales en la creación inicial; el vendedor puede completarlos o dejar que el jefe de diseño los defina.',
                    properties: {
                        materialType: {
                            type: 'string',
                            example: 'Corrugado',
                            description: 'Tipo de material',
                        },
                        materialWeight: {
                            type: 'string',
                            example: 'T-200',
                            description: 'Gramaje o calibre del material',
                        },
                        closureTypeId: {
                            type: 'string',
                            format: 'cuid',
                            description: 'ID del tipo de cierre (catálogo)',
                        },
                        fluteTypeId: {
                            type: 'string',
                            format: 'cuid',
                            description: 'ID del tipo de flauta (catálogo)',
                        },
                        fluteDirectionId: {
                            type: 'string',
                            format: 'cuid',
                            description: 'ID de la dirección de flauta (catálogo)',
                        },
                        outerLiner: {
                            type: 'string',
                            example: 'Kraft 150g',
                            description: 'Liner exterior',
                        },
                        innerLiner: {
                            type: 'string',
                            example: 'Semiquímica 120g',
                            description: 'Liner interior',
                        },
                        printTechnique: {
                            type: 'string',
                            example: 'Flexografía',
                            description: 'Técnica de impresión',
                        },
                        colorMode: {
                            type: 'string',
                            example: 'CMYK',
                            description: 'Modo de color',
                        },
                        pantoneReferences: {
                            type: 'string',
                            example: 'PMS 485 C, PMS 109 C',
                            description: 'Referencias Pantone separadas por coma',
                        },
                        length: {
                            type: 'number',
                            format: 'decimal',
                            example: 30.5,
                            description: 'Largo (unidad según dimensionUnit)',
                        },
                        width: {
                            type: 'number',
                            format: 'decimal',
                            example: 20.0,
                            description: 'Ancho',
                        },
                        height: {
                            type: 'number',
                            format: 'decimal',
                            example: 15.0,
                            description: 'Alto',
                        },
                        dimensionUnit: { type: 'string', enum: ['cm', 'mm', 'in'], default: 'cm' },
                        quantity: {
                            type: 'integer',
                            example: 5000,
                            description: 'Cantidad de unidades requeridas',
                        },
                        designInstructions: {
                            type: 'string',
                            example: 'Incluir logo en cara frontal, fondo blanco',
                            description: 'Instrucciones libres para el diseñador',
                        },
                        visualReferences: {
                            type: 'string',
                            example:
                                'Ver adjuntos. El arte debe seguir la línea del producto Serie Oro.',
                            description: 'Descripción de referencias visuales',
                        },
                        requireDieCut: {
                            type: 'boolean',
                            default: false,
                            description: 'Requiere troquel',
                        },
                        requireMockup: {
                            type: 'boolean',
                            default: false,
                            description: 'Requiere maqueta física',
                        },
                        finishingOptionIds: {
                            type: 'array',
                            items: { type: 'string', format: 'cuid' },
                            description:
                                'IDs de acabados seleccionados del catálogo (barniz, laminado, etc.)',
                        },
                        deliverableTypeIds: {
                            type: 'array',
                            items: { type: 'string', format: 'cuid' },
                            description: 'IDs de tipos de entregable requeridos del catálogo',
                        },
                    },
                },

                // ─── SAMPLE FILE (base64) ─────────────────────────────
                SampleFileInput: {
                    type: 'object',
                    required: ['base64Content', 'mimeType', 'originalName'],
                    description: 'Muestra visual de referencia codificada en Base64.',
                    properties: {
                        base64Content: {
                            type: 'string',
                            format: 'byte',
                            description:
                                'Contenido del archivo en Base64 puro (sin prefijo `data:...;base64,`). Tamaño máximo descomprimido: 10 MB.',
                            example: 'JVBERi0xLjQKJcfs...',
                        },
                        mimeType: {
                            type: 'string',
                            description: 'Tipo MIME del archivo.',
                            enum: [
                                'image/jpeg',
                                'image/png',
                                'image/webp',
                                'application/pdf',
                                'image/vnd.adobe.photoshop',
                                'application/illustrator',
                            ],
                            example: 'application/pdf',
                        },
                        originalName: {
                            type: 'string',
                            description: 'Nombre original del archivo con extensión.',
                            example: 'muestra_caja_navidad.pdf',
                        },
                        notes: {
                            type: 'string',
                            description: 'Nota visible para el diseñador sobre este archivo.',
                            example:
                                'Arte de campaña anterior. Mantener paleta de colores y tipografía.',
                        },
                    },
                },

                SampleFileResponse: {
                    type: 'object',
                    description: 'Archivo de muestra almacenado en la DB, listo para renderizar.',
                    properties: {
                        id: { type: 'string', format: 'cuid' },
                        originalName: { type: 'string', example: 'muestra_caja_navidad.pdf' },
                        mimeType: {
                            type: 'string',
                            example: 'application/pdf',
                            description:
                                'Tipo MIME original del archivo. Usar junto con base64Content para construir el data URI.',
                        },
                        sizeBytes: { type: 'integer', example: 2048000 },
                        notes: { type: 'string', example: 'Arte de campaña anterior.' },
                        base64Content: {
                            type: 'string',
                            format: 'byte',
                            description:
                                'Contenido completo del archivo codificado en Base64. Combinar con mimeType para mostrar: `data:{mimeType};base64,{base64Content}`',
                            example: 'JVBERi0xLjQKJcfs...',
                        },
                        category: { $ref: '#/components/schemas/FileCategory' },
                        origin: { $ref: '#/components/schemas/FileOrigin' },
                        uploadedById: { type: 'string', format: 'cuid' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },

                // ─── CREATE REQUEST ───────────────────────────────────
                CreateRequestBody: {
                    type: 'object',
                    required: ['clientId', 'title', 'brandName', 'productName'],
                    properties: {
                        clientId: {
                            type: 'string',
                            format: 'cuid',
                            example: 'clxyz123456',
                            description: 'ID del cliente al que pertenece la solicitud',
                        },
                        title: {
                            type: 'string',
                            example: 'Caja corrugada Serie Oro — Temporada navideña 2025',
                            description: 'Título descriptivo de la solicitud',
                        },
                        brandName: {
                            type: 'string',
                            example: 'Serie Oro',
                            description: 'Nombre de la marca o línea de producto',
                        },
                        productName: {
                            type: 'string',
                            example: 'Caja corrugada 30x20x15 cm',
                            description: 'Nombre específico del producto a diseñar',
                        },
                        priority: {
                            $ref: '#/components/schemas/RequestPriority',
                            default: 'MEDIUM',
                        },
                        requiredDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-12-01T00:00:00Z',
                            description: 'Fecha límite requerida por el cliente',
                        },
                        version: {
                            $ref: '#/components/schemas/RequestVersionInput',
                        },
                        sampleFile: {
                            $ref: '#/components/schemas/SampleFileInput',
                            description: 'Muestra visual de referencia. Opcional pero recomendado.',
                        },
                    },
                },

                // ─── RESPONSE SHAPES ──────────────────────────────────
                RequestVersionSummary: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'cuid' },
                        versionNumber: { type: 'integer', example: 1 },
                        status: {
                            type: 'string',
                            enum: [
                                'ACTIVE',
                                'IN_DESIGN',
                                'SENT_TO_QUALITY',
                                'REJECTED',
                                'APPROVED',
                                'CLOSED',
                            ],
                        },
                        reason: {
                            type: 'string',
                            enum: ['INITIAL', 'QUALITY_REJECTION', 'MANUAL_CORRECTION'],
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },

                DesignRequestResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'cuid', example: 'clxyz789abc' },
                        code: {
                            type: 'string',
                            example: 'SOL-2025-001',
                            description: 'Código único autogenerado',
                        },
                        clientId: { type: 'string', format: 'cuid' },
                        createdById: { type: 'string', format: 'cuid' },
                        title: { type: 'string', example: 'Caja corrugada Serie Oro' },
                        brandName: { type: 'string', example: 'Serie Oro' },
                        productName: { type: 'string', example: 'Caja corrugada 30x20x15 cm' },
                        priority: { $ref: '#/components/schemas/RequestPriority' },
                        status: { $ref: '#/components/schemas/RequestStatus' },
                        requiredDate: { type: 'string', format: 'date-time', nullable: true },
                        currentVersionId: { type: 'string', format: 'cuid', nullable: true },
                        currentVersion: {
                            $ref: '#/components/schemas/RequestVersionSummary',
                            nullable: true,
                        },
                        sampleFiles: {
                            type: 'array',
                            description:
                                'Muestras visuales subidas por el vendedor. Cada archivo incluye su contenido en Base64 listo para mostrar en el frontend.',
                            items: { $ref: '#/components/schemas/SampleFileResponse' },
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },

                RequestFileResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'cuid' },
                        requestId: { type: 'string', format: 'cuid' },
                        versionId: { type: 'string', format: 'cuid', nullable: true },
                        uploadedById: { type: 'string', format: 'cuid' },
                        origin: { $ref: '#/components/schemas/FileOrigin' },
                        category: { $ref: '#/components/schemas/FileCategory' },
                        originalName: { type: 'string', example: 'muestra_caja_navidad.pdf' },
                        fileName: { type: 'string', example: 'clxyz_muestra_caja_navidad.pdf' },
                        mimeType: { type: 'string', example: 'application/pdf' },
                        sizeBytes: { type: 'integer', example: 2048000 },
                        url: {
                            type: 'string',
                            format: 'uri',
                            nullable: true,
                            example: 'https://cdn.example.com/files/...',
                        },
                        notes: {
                            type: 'string',
                            example: 'Muestra del arte aprobado en campaña anterior',
                        },
                        isActive: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },

                // ─── ERRORS ───────────────────────────────────────────
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'integer', example: 400 },
                        statusMessage: {
                            type: 'string',
                            example: 'El campo clientId es requerido.',
                        },
                    },
                },
            },
        },

        paths: {
            // ─── HEALTH ─────────────────────────────────────────────
            '/api/healthcheck': {
                get: {
                    tags: ['Health'],
                    summary: 'Estado del servicio',
                    security: [],
                    responses: {
                        200: { description: 'Servicio operativo' },
                    },
                },
            },

            // ─── DOCS ────────────────────────────────────────────────
            '/api/openapi.json': {
                get: {
                    tags: ['Documentation'],
                    summary: 'Especificación OpenAPI en JSON',
                    security: [],
                    responses: { 200: { description: 'JSON de la especificación' } },
                },
            },
            '/api/docs': {
                get: {
                    tags: ['Documentation'],
                    summary: 'Swagger UI',
                    security: [],
                    responses: { 200: { description: 'HTML del Swagger UI' } },
                },
            },

            // ─── REQUESTS ────────────────────────────────────────────
            '/api/requests': {
                post: {
                    tags: ['Requests'],
                    summary: 'Crear solicitud de diseño',
                    description: `
**Quién puede usar este endpoint:** Vendedores (rol \`vendedor\`)

Crea la solicitud, su **primera versión** (v1, reason: \`INITIAL\`) y opcionalmente sube la **muestra de referencia visual** en una sola llamada.

### Formato del request
Se envía como \`application/json\`. El archivo de muestra se incluye en el campo \`sampleFile.base64\` codificado en Base64.

### Ejemplo con fetch
\`\`\`js
// Leer el archivo y convertirlo a Base64
const file = fileInput.files[0]
const base64 = await new Promise((resolve) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result.split(',')[1]) // quitar "data:...;base64,"
  reader.readAsDataURL(file)
})

fetch('/api/requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ...' },
  body: JSON.stringify({
    clientId: 'clxyz123456',
    title: 'Caja Serie Oro — Navidad 2025',
    brandName: 'Serie Oro',
    productName: 'Caja corrugada 30x20x15 cm',
    priority: 'HIGH',
    requiredDate: '2025-12-01T00:00:00Z',
    sampleFile: {
      base64,
      mimeType: file.type,
      originalName: file.name,
      notes: 'Muestra de la campaña anterior',
    },
  }),
})
\`\`\`

### Código autogenerado
El campo \`code\` se genera automáticamente con el formato \`SOL-YYYY-NNN\` (ej: \`SOL-2025-001\`).

### Estado inicial
La solicitud se crea con estado \`CREATED\`. El jefe de diseño la revisa y la mueve a \`PENDING_DESIGN_REVIEW\` antes de asignar un diseñador.
                    `.trim(),
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CreateRequestBody' },
                                examples: {
                                    sinMuestra: {
                                        summary: 'Solo datos (sin muestra)',
                                        value: {
                                            clientId: 'clxyz123456',
                                            title: 'Caja corrugada temporada navideña',
                                            brandName: 'Serie Oro',
                                            productName: 'Caja 30x20x15 cm',
                                        },
                                    },
                                    conMuestra: {
                                        summary: 'Con muestra visual en Base64',
                                        value: {
                                            clientId: 'clxyz123456',
                                            title: 'Caja corrugada Serie Oro — Navidad 2025',
                                            brandName: 'Serie Oro',
                                            productName: 'Caja corrugada 30x20x15 cm',
                                            priority: 'HIGH',
                                            requiredDate: '2025-12-01T00:00:00Z',
                                            version: {
                                                materialType: 'Corrugado',
                                                printTechnique: 'Flexografía',
                                                colorMode: 'CMYK',
                                                length: 30.5,
                                                width: 20.0,
                                                height: 15.0,
                                                quantity: 5000,
                                                designInstructions:
                                                    'Logo centrado en cara frontal.',
                                                requireDieCut: true,
                                            },
                                            sampleFile: {
                                                base64: 'JVBERi0xLjQKJcfs...',
                                                mimeType: 'application/pdf',
                                                originalName: 'muestra_caja_navidad.pdf',
                                                notes: 'Arte de la campaña anterior. Mantener paleta de colores.',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description:
                                'Solicitud creada. El campo `sampleFiles` incluye la muestra en Base64 si se envió.',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/DesignRequestResponse' },
                                },
                            },
                        },
                        400: {
                            description: 'Datos inválidos o archivo rechazado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    examples: {
                                        missingField: {
                                            summary: 'Campo requerido faltante',
                                            value: {
                                                statusCode: 400,
                                                statusMessage: 'El campo clientId es requerido.',
                                            },
                                        },
                                        invalidFile: {
                                            summary: 'Tipo de archivo no permitido',
                                            value: {
                                                statusCode: 400,
                                                statusMessage:
                                                    'El tipo de archivo no está permitido. Usa PDF, imagen o archivo de diseño.',
                                            },
                                        },
                                        fileTooLarge: {
                                            summary: 'Archivo demasiado grande',
                                            value: {
                                                statusCode: 400,
                                                statusMessage:
                                                    'El archivo supera el tamaño máximo de 10 MB.',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: 'No autenticado — falta o es inválido el Bearer token',
                        },
                        403: {
                            description:
                                'Sin permisos — este endpoint es exclusivo para vendedores',
                        },
                        404: {
                            description: 'Cliente no encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    example: {
                                        statusCode: 404,
                                        statusMessage: 'Cliente no encontrado.',
                                    },
                                },
                            },
                        },
                        409: {
                            description: 'Código de solicitud duplicado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    example: {
                                        statusCode: 409,
                                        statusMessage:
                                            'Ya existe una solicitud con el código SOL-2025-001.',
                                    },
                                },
                            },
                        },
                    },
                },
            },

            // ─── GET REQUEST ─────────────────────────────────────────
            '/api/requests/{requestId}': {
                get: {
                    tags: ['Requests'],
                    summary: 'Obtener solicitud por ID',
                    description: `
Retorna el detalle completo de una solicitud incluyendo su versión actual y las **muestras visuales del vendedor en Base64**, listas para renderizar directamente en el frontend.

### Uso de las muestras en el frontend
\`\`\`js
const { sampleFiles } = await $fetch(\`/api/requests/\${id}\`)

// Mostrar en una etiqueta <img> o <iframe>:
sampleFiles.forEach(f => {
  const src = \`data:\${f.mimeType};base64,\${f.base64}\`
  // <img src={src} /> o <iframe src={src} />
})
\`\`\`
                    `.trim(),
                    parameters: [
                        {
                            name: 'requestId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'cuid' },
                            description: 'ID de la solicitud',
                            example: 'clxyz789abc',
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Detalle de la solicitud con muestras en Base64',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/DesignRequestResponse' },
                                },
                            },
                        },
                        401: { description: 'No autenticado' },
                        403: { description: 'Sin acceso a esta solicitud' },
                        404: {
                            description: 'Solicitud no encontrada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    example: {
                                        statusCode: 404,
                                        statusMessage: 'Solicitud no encontrada.',
                                    },
                                },
                            },
                        },
                    },
                },
            },

            // ─── BY STATUS ───────────────────────────────────────────
            '/api/requests/by-status': {
                get: {
                    tags: ['Requests'],
                    summary: 'Obtener solicitudes por estado',
                    description: `
**Quién puede usar este endpoint:** Jefe de Diseño, Calidad, Administrador

Sin parámetros retorna las dos colas principales agrupadas:
- \`pendingAssignment\` — solicitudes en proceso de asignación (\`CREATED\`, \`PENDING_DESIGN_REVIEW\`, \`ASSIGNED_TO_DESIGNER\`)
- \`qualityApproved\` — solicitudes aprobadas por calidad (\`QUALITY_APPROVED\`)

Con \`?status=...\` retorna un arreglo filtrado por los estados indicados.

### Ejemplos de uso
| URL | Resultado |
|---|---|
| \`/api/requests/by-status\` | Objeto con \`pendingAssignment\` y \`qualityApproved\` |
| \`/api/requests/by-status?status=QUALITY_APPROVED\` | Solo aprobadas por calidad |
| \`/api/requests/by-status?status=CREATED,PENDING_DESIGN_REVIEW\` | Creadas y pendientes de revisión |
| \`/api/requests/by-status?status=SENT_TO_QUALITY\` | En revisión de calidad |
                    `.trim(),
                    parameters: [
                        {
                            name: 'status',
                            in: 'query',
                            required: false,
                            schema: {
                                type: 'string',
                                example: 'CREATED,PENDING_DESIGN_REVIEW',
                            },
                            description:
                                'Uno o varios estados separados por coma. Si se omite, retorna las dos colas principales agrupadas.',
                        },
                    ],
                    responses: {
                        200: {
                            description:
                                'Lista de solicitudes. El shape varía según si se envía `?status` o no.',
                            content: {
                                'application/json': {
                                    examples: {
                                        sinFiltro: {
                                            summary: 'Sin ?status — objeto agrupado',
                                            value: {
                                                pendingAssignment: [
                                                    {
                                                        id: 'clxyz...',
                                                        code: 'SOL-2025-001',
                                                        status: 'PENDING_DESIGN_REVIEW',
                                                        priority: 'HIGH',
                                                    },
                                                ],
                                                qualityApproved: [
                                                    {
                                                        id: 'clabc...',
                                                        code: 'SOL-2025-002',
                                                        status: 'QUALITY_APPROVED',
                                                        priority: 'MEDIUM',
                                                    },
                                                ],
                                            },
                                        },
                                        conFiltro: {
                                            summary: 'Con ?status — arreglo plano',
                                            value: [
                                                {
                                                    id: 'clabc...',
                                                    code: 'SOL-2025-002',
                                                    status: 'QUALITY_APPROVED',
                                                    priority: 'MEDIUM',
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: 'No autenticado' },
                    },
                },
            },

            // ─── MY ASSIGNMENTS ──────────────────────────────────────
            '/api/requests/my-assignments': {
                get: {
                    tags: ['Requests'],
                    summary: 'Obtener mis solicitudes asignadas',
                    description: `
**Quién puede usar este endpoint:** Cualquier usuario autenticado (pensado para diseñadores)

Retorna todas las solicitudes que tienen al usuario autenticado como diseñador asignado con estado \`ACTIVE\`.

Cada ítem incluye:
- Datos de la solicitud (cliente, vendedor, estado, prioridad)
- Versión activa con especificaciones técnicas
- Archivos de referencia del vendedor en **Base64** listos para mostrar
- Lista de todos los diseñadores asignados a esa versión
                    `.trim(),
                    responses: {
                        200: {
                            description: 'Lista de solicitudes asignadas al usuario',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                assignmentId: { type: 'string', format: 'cuid' },
                                                isLeadDesigner: { type: 'boolean', example: false },
                                                assignedAt: { type: 'string', format: 'date-time' },
                                                request: {
                                                    $ref: '#/components/schemas/DesignRequestResponse',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: 'No autenticado' },
                    },
                },
            },

            // ─── ASSIGNMENTS ─────────────────────────────────────────
            '/api/requests/{requestId}/assignments': {
                post: {
                    tags: ['Requests'],
                    summary: 'Asignar diseñador a una solicitud',
                    description: `
**Quién puede usar este endpoint:** Jefe de Diseño, Administrador (rol \`disenador_jefe\` o \`admin\`)

Asigna uno o varios diseñadores a la versión activa de la solicitud en una sola llamada.

### Reglas
- La solicitud debe estar en estado \`CREATED\`, \`PENDING_DESIGN_REVIEW\` o \`ASSIGNED_TO_DESIGNER\`
- Un diseñador no puede ser asignado dos veces a la misma solicitud (los duplicados se ignoran)

### Ejemplo
\`\`\`js
await fetch('/api/requests/clxyz.../assignments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ...' },
  body: JSON.stringify({ designerIds: ['clABC123', 'clDEF456'] }),
})
\`\`\`
                    `.trim(),
                    parameters: [
                        {
                            name: 'requestId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'cuid' },
                            description: 'ID de la solicitud',
                            example: 'clxyz789abc',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['designerIds'],
                                    properties: {
                                        designerIds: {
                                            type: 'array',
                                            items: { type: 'string', format: 'cuid' },
                                            minItems: 1,
                                            description: 'IDs de los diseñadores a asignar',
                                            example: ['clABC123def', 'clDEF456ghi'],
                                        },
                                    },
                                },
                                examples: {
                                    uno: {
                                        summary: 'Un diseñador',
                                        value: { designerIds: ['clABC123def'] },
                                    },
                                    varios: {
                                        summary: 'Varios diseñadores',
                                        value: { designerIds: ['clABC123def', 'clDEF456ghi'] },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Diseñador asignado exitosamente',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string', format: 'cuid' },
                                            versionId: { type: 'string', format: 'cuid' },
                                            designerId: { type: 'string', format: 'cuid' },
                                            assignedById: { type: 'string', format: 'cuid' },
                                            isLeadDesigner: { type: 'boolean', example: false },
                                            status: {
                                                type: 'string',
                                                enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
                                                example: 'ACTIVE',
                                            },
                                            assignedAt: { type: 'string', format: 'date-time' },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Datos inválidos',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    example: {
                                        statusCode: 400,
                                        statusMessage: 'Se requieren designerId y designerName.',
                                    },
                                },
                            },
                        },
                        401: { description: 'No autenticado' },
                        403: { description: 'Solo el jefe de diseño puede asignar diseñadores' },
                        404: { description: 'Solicitud no encontrada' },
                        409: {
                            description: 'Diseñador ya asignado o estado inválido',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    examples: {
                                        yaAsignado: {
                                            summary: 'Diseñador ya asignado',
                                            value: {
                                                statusCode: 409,
                                                statusMessage: 'Este diseñador ya está asignado.',
                                            },
                                        },
                                        estadoInvalido: {
                                            summary: 'Estado no permite asignación',
                                            value: {
                                                statusCode: 422,
                                                statusMessage:
                                                    'Solo se pueden asignar diseñadores a solicitudes pendientes o asignadas.',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },

            '/api/requests/{requestId}/assignments/{designerId}': {
                delete: {
                    tags: ['Requests'],
                    summary: 'Remover diseñador de una solicitud',
                    description:
                        '**Quién puede usar este endpoint:** Jefe de Diseño, Administrador\n\nElimina la asignación de un diseñador específico de la versión activa de la solicitud.',
                    parameters: [
                        {
                            name: 'requestId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'cuid' },
                            description: 'ID de la solicitud',
                        },
                        {
                            name: 'designerId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'cuid' },
                            description: 'ID del diseñador a remover',
                        },
                    ],
                    responses: {
                        200: { description: 'Asignación removida exitosamente' },
                        401: { description: 'No autenticado' },
                        403: { description: 'Sin permisos' },
                        404: {
                            description: 'Solicitud o asignación no encontrada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    example: {
                                        statusCode: 404,
                                        statusMessage: 'Esta asignación no existe.',
                                    },
                                },
                            },
                        },
                    },
                },
            },

            // ─── QUALITY REVIEW ──────────────────────────────────────
            '/api/requests/{requestId}/quality-review': {
                post: {
                    tags: ['Requests'],
                    summary: 'Registrar revisión de calidad (aprobar o rechazar)',
                    description: `
**Quién puede usar este endpoint:** Área de Calidad, Administrador

Registra la revisión de calidad sobre la versión activa de la solicitud.

### Si \`decision: "APPROVED"\`
- Se crea el registro \`QualityReview\` con decisión APPROVED
- La versión activa pasa a estado \`APPROVED\`
- La solicitud pasa a estado \`QUALITY_APPROVED\`

### Si \`decision: "REJECTED"\`
- Se crea el registro \`QualityReview\` con decisión REJECTED
- La versión actual pasa a estado \`REJECTED\`
- Se crea **una nueva versión** (v2, v3...) con:
  - Mismas especificaciones técnicas heredadas
  - **Checklist limpio** (art, mechanical, dummy = false)
  - Mismos diseñadores re-asignados automáticamente
- La solicitud vuelve a estado \`ASSIGNED_TO_DESIGNER\` para que los diseñadores trabajen de nuevo
                    `.trim(),
                    parameters: [
                        {
                            name: 'requestId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'cuid' },
                            description: 'ID de la solicitud',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['decision'],
                                    properties: {
                                        decision: {
                                            type: 'string',
                                            enum: ['APPROVED', 'REJECTED'],
                                            description: 'Decisión de calidad',
                                            example: 'REJECTED',
                                        },
                                        generalObservations: {
                                            type: 'string',
                                            description:
                                                'Observaciones generales sobre el arte revisado',
                                            example:
                                                'El pantone 485C no corresponde con la muestra enviada. Las dimensiones del troquel no coinciden con el brief.',
                                        },
                                        checklist: {
                                            type: 'object',
                                            description:
                                                'Checklist de validación de calidad (libre, se guarda como JSON)',
                                            example: {
                                                dimensionsOk: false,
                                                colorProfileOk: true,
                                                pantoneOk: false,
                                                dieLineOk: true,
                                                legalTextOk: true,
                                            },
                                        },
                                    },
                                },
                                examples: {
                                    aprobar: {
                                        summary: 'Aprobar arte',
                                        value: {
                                            decision: 'APPROVED',
                                            generalObservations:
                                                'Arte validado. Dimensiones, pantones y troquel correctos.',
                                            checklist: {
                                                dimensionsOk: true,
                                                colorProfileOk: true,
                                                pantoneOk: true,
                                                dieLineOk: true,
                                            },
                                        },
                                    },
                                    rechazar: {
                                        summary: 'Rechazar — crear v2 y volver a diseño',
                                        value: {
                                            decision: 'REJECTED',
                                            generalObservations:
                                                'El pantone 485C no corresponde. Las dimensiones del troquel no cuadran.',
                                            checklist: {
                                                dimensionsOk: false,
                                                colorProfileOk: true,
                                                pantoneOk: false,
                                                dieLineOk: false,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Revisión registrada',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            decision: {
                                                type: 'string',
                                                enum: ['APPROVED', 'REJECTED'],
                                            },
                                            requestStatus: { type: 'string' },
                                            message: { type: 'string' },
                                        },
                                    },
                                    examples: {
                                        aprobado: {
                                            summary: 'Resultado aprobación',
                                            value: {
                                                decision: 'APPROVED',
                                                requestStatus: 'QUALITY_APPROVED',
                                                versionId: 'clxyz...',
                                                versionNumber: 1,
                                                message: 'Solicitud aprobada por calidad.',
                                            },
                                        },
                                        rechazado: {
                                            summary: 'Resultado rechazo (nueva versión creada)',
                                            value: {
                                                decision: 'REJECTED',
                                                requestStatus: 'ASSIGNED_TO_DESIGNER',
                                                previousVersionId: 'clABC...',
                                                previousVersionNumber: 1,
                                                newVersionId: 'clDEF...',
                                                newVersionNumber: 2,
                                                designersNotified: 2,
                                                message:
                                                    'Solicitud rechazada. Versión v2 creada y enviada de vuelta a los diseñadores asignados.',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Decision faltante o inválida',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    example: {
                                        statusCode: 400,
                                        statusMessage:
                                            'El campo decision es requerido y debe ser APPROVED o REJECTED.',
                                    },
                                },
                            },
                        },
                        401: { description: 'No autenticado' },
                        403: { description: 'Solo el área de calidad puede registrar revisiones' },
                        404: { description: 'Solicitud no encontrada' },
                        409: {
                            description: 'La solicitud no está en estado SENT_TO_QUALITY',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    example: {
                                        statusCode: 409,
                                        statusMessage:
                                            'Solo se pueden revisar solicitudes en estado SENT_TO_QUALITY.',
                                    },
                                },
                            },
                        },
                    },
                },
            },

            // ─── CHECKLIST ───────────────────────────────────────────
            '/api/requests/{requestId}/checklist/{item}': {
                patch: {
                    tags: ['Requests'],
                    summary: 'Alternar un ítem del checklist de diseño',
                    description: `
**Quién puede usar este endpoint:** Diseñador asignado, Jefe de Diseño, Administrador

Hace **switch** del valor booleano del ítem indicado (\`true → false\` o \`false → true\`). También registra o limpia la fecha de completado automáticamente.

| Item | Campo en DB |
|---|---|
| \`art\` | \`artCompleted\` / \`artCompletedAt\` |
| \`mechanical\` | \`mechanicalCompleted\` / \`mechanicalCompletedAt\` |
| \`dummy\` | \`dummyCompleted\` / \`dummyCompletedAt\` |
                    `.trim(),
                    parameters: [
                        {
                            name: 'requestId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'cuid' },
                            description: 'ID de la solicitud',
                        },
                        {
                            name: 'item',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', enum: ['art', 'mechanical', 'dummy'] },
                            description: 'Ítem del checklist a alternar',
                            example: 'art',
                        },
                    ],
                    responses: {
                        200: {
                            description:
                                'Switch aplicado. Retorna el valor anterior, el nuevo y el checklist completo.',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            item: {
                                                type: 'string',
                                                enum: ['art', 'mechanical', 'dummy'],
                                            },
                                            previousValue: { type: 'boolean', example: false },
                                            newValue: { type: 'boolean', example: true },
                                            checklist: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'string', format: 'cuid' },
                                                    artCompleted: { type: 'boolean' },
                                                    artCompletedAt: {
                                                        type: 'string',
                                                        format: 'date-time',
                                                        nullable: true,
                                                    },
                                                    mechanicalCompleted: { type: 'boolean' },
                                                    mechanicalCompletedAt: {
                                                        type: 'string',
                                                        format: 'date-time',
                                                        nullable: true,
                                                    },
                                                    dummyCompleted: { type: 'boolean' },
                                                    dummyCompletedAt: {
                                                        type: 'string',
                                                        format: 'date-time',
                                                        nullable: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    example: {
                                        item: 'art',
                                        previousValue: false,
                                        newValue: true,
                                        checklist: {
                                            id: 'clxyz...',
                                            artCompleted: true,
                                            artCompletedAt: '2025-06-01T10:30:00Z',
                                            mechanicalCompleted: false,
                                            mechanicalCompletedAt: null,
                                            dummyCompleted: false,
                                            dummyCompletedAt: null,
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Item inválido',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    example: {
                                        statusCode: 400,
                                        statusMessage:
                                            'Item de checklist inválido. Valores permitidos: art, mechanical, dummy.',
                                    },
                                },
                            },
                        },
                        401: { description: 'No autenticado' },
                        403: {
                            description:
                                'Solo los diseñadores asignados pueden actualizar el checklist',
                        },
                        404: { description: 'Solicitud no encontrada' },
                    },
                },
            },

            // ─── REQUEST FILES ────────────────────────────────────────
            '/api/requests/{requestId}/files': {
                post: {
                    tags: ['Request Files'],
                    summary: 'Subir archivo de referencia a una solicitud',
                    description: `
**Quién puede usar este endpoint:** Vendedor que creó la solicitud

El vendedor sube una **muestra visual o referencia** (PDF, imagen, AI, PSD) para que el diseñador entienda qué se necesita.

### Categorías para el vendedor
| Categoría | Uso |
|---|---|
| \`SALES_REFERENCE\` | Muestra de cómo debería verse el diseño (logo, foto de producto, diseño anterior) |

### Tipos de archivo aceptados
- Imágenes: \`image/jpeg\`, \`image/png\`, \`image/webp\`
- Documentos: \`application/pdf\`
- Archivos de diseño: \`image/vnd.adobe.photoshop\`, \`application/illustrator\`

> El archivo se almacena en Supabase Storage. El campo \`url\` del response contiene la URL pública o firmada para accederlo.
                    `.trim(),
                    parameters: [
                        {
                            name: 'requestId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'cuid' },
                            description: 'ID de la solicitud',
                            example: 'clxyz789abc',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    required: ['file', 'category'],
                                    properties: {
                                        file: {
                                            type: 'string',
                                            format: 'binary',
                                            description: 'Archivo de referencia (max 10 MB)',
                                        },
                                        category: {
                                            $ref: '#/components/schemas/FileCategory',
                                            description:
                                                'Categoría del archivo. Para el vendedor usar `SALES_REFERENCE`.',
                                        },
                                        notes: {
                                            type: 'string',
                                            example:
                                                'Este es el arte usado en la campaña anterior. Mantener paleta de colores.',
                                            description:
                                                'Nota opcional para el diseñador sobre este archivo',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Archivo subido exitosamente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/RequestFileResponse' },
                                },
                            },
                        },
                        400: {
                            description: 'Archivo inválido o categoría no permitida',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    example: {
                                        statusCode: 400,
                                        statusMessage: 'El tipo de archivo no está permitido.',
                                    },
                                },
                            },
                        },
                        401: { description: 'No autenticado' },
                        403: {
                            description:
                                'Solo el vendedor que creó la solicitud puede subir referencias',
                        },
                        404: { description: 'Solicitud no encontrada' },
                        413: {
                            description: 'Archivo demasiado grande (máximo 10 MB)',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    example: {
                                        statusCode: 413,
                                        statusMessage:
                                            'El archivo supera el tamaño máximo de 10 MB.',
                                    },
                                },
                            },
                        },
                    },
                },

                get: {
                    tags: ['Request Files'],
                    summary: 'Listar archivos de una solicitud',
                    description:
                        'Retorna todos los archivos activos adjuntos a la solicitud, filtrados opcionalmente por categoría u origen.',
                    parameters: [
                        {
                            name: 'requestId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'cuid' },
                        },
                        {
                            name: 'category',
                            in: 'query',
                            required: false,
                            schema: { $ref: '#/components/schemas/FileCategory' },
                            description: 'Filtrar por categoría',
                        },
                        {
                            name: 'origin',
                            in: 'query',
                            required: false,
                            schema: { $ref: '#/components/schemas/FileOrigin' },
                            description: 'Filtrar por origen',
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Lista de archivos',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/RequestFileResponse' },
                                    },
                                },
                            },
                        },
                        401: { description: 'No autenticado' },
                        404: { description: 'Solicitud no encontrada' },
                    },
                },
            },
        },
    }
}

export function createSwaggerHtml() {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      html, body { margin: 0; padding: 0; }
      #swagger-ui { min-height: 100vh; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/api/openapi.json",
        dom_id: "#swagger-ui",
      });
    </script>
  </body>
</html>`
}

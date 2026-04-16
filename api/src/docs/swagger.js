const swaggerJSDoc = require('swagger-jsdoc'); 

const options = { 
  definition: { 
    openapi: "3.0.0", 
    info: { 
      title: "E-commerce API", 
      version: "1.0.0", 
      description: "Documentació de l'API del projecte e-commerce" 
    }, 
    servers: [ 
      { 
        url: "http://localhost:3001" 
      } 
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" }
          }
        },
        Product: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            stock: { type: "number" },
            image: { type: "string" },
            category: { type: "string", enum: ['Running', 'Casual', 'Sport', 'Formal', 'Other'] },
            sku: { type: "string", example: "NKE-AF1" }
          }
        }
        // Pots afegir més schemas aquí, per exemple un de Producte o Cistella
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  }, 
  apis: ["./src/routes/*.js"] 
}; 

const swaggerSpec = swaggerJSDoc(options); 
module.exports = swaggerSpec; 

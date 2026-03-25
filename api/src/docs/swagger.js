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
        url: "http://localhost:3000" 
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
            nom: { type: "string" },
            descripcio: { type: "string" },
            preu: { type: "number" },
            stock: { type: "number" },
            imatge: { type: "string" }
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

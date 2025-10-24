# Parsian Payment Gateway - JavaScript/Express.js

A professional, modular JavaScript implementation of the Parsian Bank payment gateway for Node.js/Express.js applications.

## Features

- 🚀 **Modern JavaScript**: ES6+ modules, async/await
- 🏗️ **Modular Architecture**: Clean separation of concerns
- 🔒 **Security First**: Rate limiting, CORS, Helmet security
- 📝 **Comprehensive Logging**: Winston-based logging system
- ✅ **Input Validation**: Joi-based request validation
- 🛡️ **Error Handling**: Robust error handling and recovery
- 📊 **Professional API**: RESTful API design
- 🧪 **Production Ready**: Environment configuration, graceful shutdown

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd jsVersion

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Configure your Parsian PIN in .env
PARSIAN_PIN=your_parsian_pin_here
```

## Configuration

Create a `.env` file with the following configuration:

```env
# Parsian Payment Gateway Configuration
PARSIAN_PIN=your_parsian_pin_here
PARSIAN_SALE_URL=https://pec.shaparak.ir/NewIPGServices/Sale/SaleService.asmx?wsdl
PARSIAN_CONFIRM_URL=https://pec.shaparak.ir/NewIPGServices/Confirm/ConfirmService.asmx?wsdl
PARSIAN_REVERSE_URL=https://pec.shaparak.ir/NewIPGServices/Reverse/ReversalService.asmx?wsdl
PARSIAN_GATE_URL=https://pec.shaparak.ir/NewIPG/?Token=

# Server Configuration
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info
LOG_FILE=logs/parsian-pay.log
```

## Usage

### Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

### API Endpoints

#### 1. Create Payment Request

```bash
POST /api/payment/create
Content-Type: application/json

{
  "amount": 10000,
  "orderId": "ORDER123456",
  "callbackUrl": "https://yourdomain.com/callback",
  "additionalData": "Optional data"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORDER123456",
    "token": 123456789,
    "redirectUrl": "https://pec.shaparak.ir/NewIPG/?Token=123456789",
    "message": "Payment request created successfully"
  }
}
```

#### 2. Handle Payment Callback

```bash
POST /api/payment/callback
Content-Type: application/json

{
  "status": 0,
  "Token": 123456789,
  "RRN": 987654321
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": 123456789,
    "rrn": 987654321,
    "cardNumberMasked": "1234****5678",
    "message": "Payment confirmed successfully"
  }
}
```

#### 3. Reverse Payment

```bash
POST /api/payment/reverse
Content-Type: application/json

{
  "token": 123456789
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": 123456789,
    "message": "Payment reversed successfully"
  }
}
```

#### 4. Check Payment Status

```bash
GET /api/payment/status/123456789
```

## Project Structure

```
src/
├── models/                 # Data models
│   ├── SalePaymentRequest.js
│   ├── PayResult.js
│   ├── ConfirmPaymentRequest.js
│   ├── ConfirmResult.js
│   ├── ReversalRequest.js
│   └── ReversalResult.js
├── services/              # Business logic
│   ├── ParsianRequest.js
│   ├── ParsianIPG.js
│   ├── Pay.js
│   ├── Callback.js
│   └── Reverse.js
├── routes/                # API routes
│   └── payment.js
├── middleware/            # Express middleware
│   ├── validation.js
│   ├── errorHandler.js
│   └── security.js
├── utils/                 # Utility functions
│   ├── errors.js
│   ├── logger.js
│   └── helpers.js
├── app.js                 # Express app configuration
└── index.js              # Server entry point
```

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protection
- **Input Validation**: Joi-based request validation
- **IP Whitelisting**: Optional IP-based access control

## Logging

The application uses Winston for comprehensive logging:

- **Request/Response Logging**: All API calls are logged
- **Error Logging**: Detailed error information
- **Payment Logging**: All payment operations are logged
- **File Rotation**: Automatic log file rotation

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure your Parsian PIN
3. Set up proper logging
4. Configure reverse proxy (nginx)
5. Set up SSL/TLS
6. Configure monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please open an issue in the repository.

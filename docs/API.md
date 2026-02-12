# API Documentation

## Base URL

```
Development: http://localhost:5000
Production: https://your-api-domain.com
```

## Authentication

All API requests require authentication via Supabase. Include the user's JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### Health Check

**GET** `/health`

Returns server health status.

**Response** (200 OK):
```json
{
    "status": "ok",
    "timestamp": "2026-02-13T00:00:00.000Z"
}
```

---

### Root Endpoint

**GET** `/`

Returns server status message.

**Response** (200 OK):
```
Alchemy Backend is Active 🧪
```

---

### Calculate Chemical Reaction Result

**GET** `/result/:chem_a/:chem_b/:chem_c/:chem_d`

Calculates the result of mixing four chemicals based on their concentrations.

**URL Parameters**:
- `chem_a` (number, 0-100): Concentration of chemical A (HCl)
- `chem_b` (number, 0-100): Concentration of chemical B (NaOH)
- `chem_c` (number, 0-100): Concentration of chemical C (CuSO4)
- `chem_d` (number, 0-100): Concentration of chemical D (NaCl)

**Example Request**:
```
GET /result/50/30/20/0
```

**Success Response** (200 OK):
```json
[
    {
        "id": 1,
        "conc_a": 50,
        "conc_b": 30,
        "conc_c": 20,
        "conc_d": 0,
        "reaction_id": 111,
        "result_name": "Sodium Chloride",
        "result_formula": "NaCl",
        "color": "#ffffff",
        "characteristics": ["White crystalline solid", "Soluble in water"]
    }
]
```

**Error Responses**:

400 Bad Request - Missing parameter:
```json
{
    "message": "Missing parameter: chem_a"
}
```

400 Bad Request - Invalid number:
```json
{
    "message": "Invalid number for: chem_a"
}
```

400 Bad Request - Out of range:
```json
{
    "message": "Value out of range (0-100) for: chem_a"
}
```

500 Internal Server Error:
```json
{
    "message": "Database Error"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: 
  - `RateLimit-Limit`: Maximum requests allowed
  - `RateLimit-Remaining`: Requests remaining in current window
  - `RateLimit-Reset`: Time when the rate limit resets

**Rate Limit Exceeded Response** (429):
```json
{
    "message": "Too many requests, please try again later."
}
```

---

## Security Headers

The API includes the following security headers:

- **Content-Security-Policy**: Restricts resource loading
- **Strict-Transport-Security (HSTS)**: Enforces HTTPS
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Enables XSS filtering

---

## Error Handling

All errors follow a consistent format:

```json
{
    "message": "Error description",
    "error": "Optional error details"
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid auth)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Request/Response Examples

### Example 1: Valid Chemical Reaction

**Request**:
```bash
curl -X GET http://localhost:5000/result/60/40/0/0
```

**Response**:
```json
[
    {
        "id": 5,
        "conc_a": 60,
        "conc_b": 40,
        "conc_c": 0,
        "conc_d": 0,
        "reaction_id": 11,
        "result_name": "Water and Salt",
        "result_formula": "H2O + NaCl",
        "color": "#e0e0e0"
    }
]
```

### Example 2: Invalid Parameter

**Request**:
```bash
curl -X GET http://localhost:5000/result/abc/40/0/0
```

**Response** (400):
```json
{
    "message": "Invalid number for: chem_a"
}
```

---

## Notes

- All concentrations are normalized to sum to 100 if the total is less than 100
- Values are rounded to the nearest 10 for database lookup
- The `reaction_id` is calculated based on which chemicals are present
- Empty results array `[]` indicates no matching reaction found

---

## Support

For API support or questions:
- Email: support@alchemistry.com
- GitHub Issues: https://github.com/yourusername/alchemistry/issues

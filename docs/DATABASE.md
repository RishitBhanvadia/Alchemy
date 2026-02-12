# Database Schema Documentation

## Overview

Alchemistry uses Supabase (PostgreSQL) for data storage. This document describes the database schema, tables, and relationships.

---

## Tables

### 1. experiment_results

Stores user experiment history and results.

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `user_id` | UUID | FOREIGN KEY → auth.users(id), NOT NULL | User who performed experiment |
| `experiment_type` | TEXT | NOT NULL | Type: 'lab', 'titration', 'organic', 'inorganic' |
| `chem_a` | INTEGER | CHECK (0-100) | Concentration of chemical A |
| `chem_b` | INTEGER | CHECK (0-100) | Concentration of chemical B |
| `chem_c` | INTEGER | CHECK (0-100) | Concentration of chemical C |
| `chem_d` | INTEGER | CHECK (0-100) | Concentration of chemical D |
| `result_name` | TEXT | | Name of resulting compound |
| `result_formula` | TEXT | | Chemical formula |
| `score` | INTEGER | CHECK (0-100) | Experiment score |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Timestamp of experiment |

**Indexes**:
- `idx_user_experiments` ON `user_id`
- `idx_created_at` ON `created_at DESC`

**RLS Policies**:
- Users can SELECT, INSERT, UPDATE, DELETE their own records
- Filter: `auth.uid() = user_id`

**SQL**:
```sql
CREATE TABLE experiment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    experiment_type TEXT NOT NULL,
    chem_a INTEGER CHECK (chem_a >= 0 AND chem_a <= 100),
    chem_b INTEGER CHECK (chem_b >= 0 AND chem_b <= 100),
    chem_c INTEGER CHECK (chem_c >= 0 AND chem_c <= 100),
    chem_d INTEGER CHECK (chem_d >= 0 AND chem_d <= 100),
    result_name TEXT,
    result_formula TEXT,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_experiments ON experiment_results(user_id);
CREATE INDEX idx_created_at ON experiment_results(created_at DESC);
```

---

### 2. results

Stores predefined chemical reaction results (read-only for users).

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique identifier |
| `conc_a` | INTEGER | NOT NULL | Normalized concentration A (0-100) |
| `conc_b` | INTEGER | NOT NULL | Normalized concentration B (0-100) |
| `conc_c` | INTEGER | NOT NULL | Normalized concentration C (0-100) |
| `conc_d` | INTEGER | NOT NULL | Normalized concentration D (0-100) |
| `reaction_id` | INTEGER | NOT NULL | Reaction type identifier |
| `result_name` | TEXT | NOT NULL | Name of product |
| `result_formula` | TEXT | | Chemical formula |
| `color` | TEXT | | Hex color code |
| `characteristics` | TEXT[] | | Array of observable characteristics |

**Indexes**:
- `idx_concentrations` ON `(conc_a, conc_b, conc_c, conc_d, reaction_id)`

**RLS Policies**:
- Authenticated users can SELECT
- Only service_role can INSERT, UPDATE, DELETE

**SQL**:
```sql
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    conc_a INTEGER NOT NULL,
    conc_b INTEGER NOT NULL,
    conc_c INTEGER NOT NULL,
    conc_d INTEGER NOT NULL,
    reaction_id INTEGER NOT NULL,
    result_name TEXT NOT NULL,
    result_formula TEXT,
    color TEXT,
    characteristics TEXT[]
);

CREATE INDEX idx_concentrations ON results(conc_a, conc_b, conc_c, conc_d, reaction_id);
```

---

## Relationships

```
auth.users (Supabase Auth)
    ↓ (1:N)
experiment_results
```

---

## Reaction ID Mapping

The `reaction_id` is calculated based on which chemicals are present:

| Chemicals Present | Reaction ID |
|-------------------|-------------|
| A only | 1 |
| B only | 10 |
| C only | 100 |
| D only | 1000 |
| A + B | 11 |
| A + C | 101 |
| A + D | 1001 |
| B + C | 110 |
| B + D | 1010 |
| C + D | 1100 |
| A + B + C | 111 |
| A + B + D | 1011 |
| A + C + D | 1101 |
| B + C + D | 1110 |
| A + B + C + D | 1111 |

**Calculation Logic**:
```javascript
const reaction_id = 
    (a > 0 ? 1 : 0) + 
    (b > 0 ? 10 : 0) + 
    (c > 0 ? 100 : 0) + 
    (d > 0 ? 1000 : 0);
```

---

## Sample Data

### results table

```sql
INSERT INTO results (conc_a, conc_b, conc_c, conc_d, reaction_id, result_name, result_formula, color, characteristics) VALUES
(50, 50, 0, 0, 11, 'Sodium Chloride', 'NaCl', '#ffffff', ARRAY['White crystals', 'Soluble in water']),
(60, 40, 0, 0, 11, 'Water and Salt', 'H2O + NaCl', '#e0e0e0', ARRAY['Clear solution', 'Neutral pH']),
(30, 30, 40, 0, 111, 'Copper Hydroxide', 'Cu(OH)2', '#0070bc', ARRAY['Blue precipitate', 'Insoluble']);
```

---

## Queries

### Get User's Recent Experiments

```sql
SELECT 
    experiment_type,
    result_name,
    score,
    created_at
FROM experiment_results
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;
```

### Find Reaction Result

```sql
SELECT * FROM results
WHERE conc_a = 50
  AND conc_b = 30
  AND conc_c = 20
  AND conc_d = 0
  AND reaction_id = 111;
```

### Get User Statistics

```sql
SELECT 
    experiment_type,
    COUNT(*) as total_experiments,
    AVG(score) as avg_score,
    MAX(score) as best_score
FROM experiment_results
WHERE user_id = auth.uid()
GROUP BY experiment_type;
```

---

## Migrations

### Initial Setup

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
-- (See table definitions above)

-- Enable RLS
ALTER TABLE experiment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Create policies
-- (See SUPABASE_RLS_SETUP.md)
```

---

## Backup & Restore

### Backup

```bash
# Via Supabase Dashboard
# Settings → Database → Backups → Create Backup

# Or via pg_dump
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Restore

```bash
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

---

## Performance Considerations

1. **Indexes**: Created on frequently queried columns
2. **RLS**: Policies use indexed columns (user_id)
3. **Normalization**: Concentrations rounded to nearest 10 for efficient lookup
4. **Caching**: Consider caching `results` table (rarely changes)

---

## Future Enhancements

- [ ] Add `reactions` table for reaction metadata
- [ ] Add `user_achievements` table for gamification
- [ ] Add `experiment_notes` for user annotations
- [ ] Implement full-text search on result names
- [ ] Add audit logging table

---

## Support

For database questions:
- Supabase Docs: https://supabase.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/

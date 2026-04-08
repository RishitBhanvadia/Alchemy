# Alchemistry Database Schema

> **Last updated**: April 2026 (Post-Audit)
> **Database**: Supabase PostgreSQL (hosted)
> **Project**: `madcquepligcvwkfycud`

---

## Overview

Alchemistry uses Supabase for authentication, database, and real-time features. The database has the following schemas:

| Schema | Purpose |
|--------|---------|
| `public` | Application data (11 tables, 12 functions, 5 triggers) |
| `auth` | Supabase-managed authentication (users, sessions, SSO, MFA) |
| `storage` | Supabase-managed file storage (buckets, objects) |
| `realtime` | Supabase-managed realtime subscriptions |
| `extensions` | PostgreSQL extensions (`uuid-ossp`, `pgcrypto`, etc.) |
| `vault` | Supabase-managed secrets storage |

Only the `public` schema contains application tables. All other schemas are Supabase-managed infrastructure.

---

## Public Schema — Tables

### 1. `profiles`

User profile data, linked 1:1 with `auth.users`.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID PK | No | — | FK → `auth.users(id)` |
| `role` | TEXT | No | `'student'` | `CHECK (role IN ('student', 'teacher', 'admin'))` |
| `display_name` | TEXT | Yes | — | |
| `full_name` | TEXT | No | — | Synced with `display_name` via trigger |
| `avatar_url` | TEXT | Yes | — | |
| `created_at` | TIMESTAMPTZ | Yes | `now()` | |
| `updated_at` | TIMESTAMPTZ | Yes | `now()` | |

**RLS Policies**: Profiles viewable by all authenticated users. Users can insert/update their own.
**Trigger**: `tr_sync_profile_names` keeps `full_name` and `display_name` in sync.

---

### 2. `classrooms`

Teacher-created classrooms for organizing students.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID PK | No | `gen_random_uuid()` | |
| `teacher_id` | UUID | No | — | FK → `auth.users(id)` |
| `class_name` | TEXT | No | — | |
| `class_code` | TEXT | Yes | UNIQUE | Auto-generated join code |
| `locked_chemicals` | JSONB | Yes | `'[]'` | Chemicals locked from students |
| `meeting_type` | TEXT | Yes | `'none'` | `zoom` or `google` |
| `meeting_link` | TEXT | Yes | — | |
| `created_at` | TIMESTAMPTZ | Yes | `now()` | |

**RLS Policies**: Teachers have full CRUD. Students can SELECT classrooms they're members of.
**Function**: `generate_class_code()` generates unique 6-char codes.

---

### 3. `class_memberships`

Junction table linking students to classrooms.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID PK | No | `gen_random_uuid()` | |
| `classroom_id` | UUID | No | — | FK → `classrooms(id)` |
| `student_id` | UUID | No | — | FK → `profiles(id)` |
| `teacher_id` | UUID | Yes | — | FK → `auth.users(id)`, auto-filled via trigger |
| `joined_at` | TIMESTAMPTZ | Yes | `now()` | |
| `last_active_at` | TIMESTAMPTZ | Yes | `now()` | |

**Unique constraint**: `(classroom_id, student_id)`
**Trigger**: `tr_sync_membership_teacher` auto-copies `teacher_id` from the classroom on INSERT.

---

### 4. `assignments`

Teacher-created assignments linked to classrooms.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID PK | No | `gen_random_uuid()` | |
| `classroom_id` | UUID | No | — | FK → `classrooms(id)` |
| `experiment_type` | TEXT | No | — | |
| `title` | TEXT | No | `''` | |
| `description` | TEXT | Yes | `''` | |
| `required_score` | INTEGER | No | `70` | `CHECK (0–100)` |
| `due_date` | TIMESTAMPTZ | Yes | — | |
| `created_at` | TIMESTAMPTZ | Yes | `now()` | |

---

### 5. `student_assignments`

Tracks student completion of assignments.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `assignment_id` | UUID | No | — | FK → `assignments(id)`, composite PK |
| `student_id` | UUID | No | — | FK → `auth.users(id)`, composite PK |
| `score` | INTEGER | Yes | — | `CHECK (NULL OR 0–100)` |
| `completed_at` | TIMESTAMPTZ | Yes | — | |

---

### 6. `experiment_logs`

Client-side experiment logs (inserted via Supabase JS SDK).

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID PK | No | `gen_random_uuid()` | |
| `student_id` | UUID | No | — | FK → `profiles(id)` |
| `classroom_id` | UUID | Yes | — | FK → `classrooms(id)` |
| `chem_a` | INTEGER | Yes | — | Concentration of chemical A |
| `chem_b` | INTEGER | Yes | — | Concentration of chemical B |
| `chem_i` | INTEGER | Yes | — | Concentration of indicator |
| `chem_c` | INTEGER | Yes | — | Concentration of chemical C |
| `reaction_id` | INTEGER | Yes | — | |
| `outcome_label` | TEXT | Yes | — | |
| `score` | INTEGER | Yes | — | 0–100 |
| `ran_at` | TIMESTAMPTZ | Yes | `now()` | **Note**: NOT `created_at` |

---

### 7. `experiment_results`

Server-side experiment results (inserted via Express API).

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID PK | No | `gen_random_uuid()` | |
| `user_id` | UUID | No | — | FK → `auth.users(id)` |
| `experiment_type` | TEXT | No | — | |
| `chem_a` | INTEGER | Yes | — | `CHECK (0–100)` |
| `chem_b` | INTEGER | Yes | — | `CHECK (0–100)` |
| `chem_c` | INTEGER | Yes | — | `CHECK (0–100)` |
| `chem_d` | INTEGER | Yes | — | `CHECK (0–100)` |
| `result_name` | TEXT | Yes | — | |
| `result_formula` | TEXT | Yes | — | |
| `score` | INTEGER | Yes | — | `CHECK (0–100)` |
| `details` | JSONB | Yes | — | |
| `created_at` | TIMESTAMPTZ | Yes | `now()` | |

> ⚠️ **Known Issue**: This table overlaps in purpose with `experiment_logs`. Client code uses `experiment_logs`; server code uses `experiment_results`. A future consolidation is planned.

---

### 8. `results`

Reaction lookup table — maps `reaction_id` + `regime` to outcomes.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | SERIAL PK | No | — | |
| `reaction_id` | INTEGER | No | — | |
| `regime` | TEXT | No | `'NEUTRAL'` | |
| `outcome_label` | TEXT | No | — | |
| `product_formula` | TEXT | Yes | — | |
| `color` | TEXT | Yes | — | |
| `state_change` | TEXT | Yes | — | |
| `thermal_effect` | TEXT | Yes | — | |
| `ai_tutor_context` | TEXT | Yes | — | |
| `is_dangerous` | BOOLEAN | Yes | `false` | |
| `created_at` | TIMESTAMPTZ | Yes | `now()` | |

**Unique constraint**: `(reaction_id, regime)`

---

### 9. `titration_data`

Pre-seeded titration reference data.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID PK | No | `uuid_generate_v4()` | |
| `acid_name` | TEXT | No | — | |
| `base_name` | TEXT | No | — | |
| `indicator_name` | TEXT | No | — | |
| `acid_molarity` | NUMERIC | Yes | — | |
| `base_molarity` | NUMERIC | Yes | — | |
| `ph_curve` | JSONB | No | — | |
| `indicator_colors` | JSONB | No | — | |
| `note` | TEXT | Yes | — | |
| `created_at` | TIMESTAMPTZ | Yes | `now()` | |

---

### 10. `meeting_sessions`

Live meeting sessions for classroom video calls.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID PK | No | `gen_random_uuid()` | |
| `code` | VARCHAR | No | UNIQUE | |
| `meeting_url` | TEXT | No | — | |
| `platform` | VARCHAR | No | — | `CHECK ('zoom' or 'google')` |
| `teacher_id` | UUID | No | — | FK → `auth.users(id)` |
| `created_at` | TIMESTAMPTZ | Yes | `now()` | |
| `expires_at` | TIMESTAMPTZ | No | — | |

---

### 11. `achievements`

Student achievement/badge tracking.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID PK | No | `gen_random_uuid()` | |
| `student_id` | UUID | No | — | FK → `profiles(id)` |
| `achievement` | TEXT | No | — | e.g. `novice_chemist`, `lab_regular`, `master_researcher` |
| `unlocked_at` | TIMESTAMPTZ | Yes | `now()` | |

**Unique constraint**: `(student_id, achievement)`

---

## Custom Functions

| Function | Returns | Purpose |
|----------|---------|---------|
| `handle_new_user()` | trigger | Creates profile on signup |
| `auto_confirm_user()` | trigger | Auto-confirms email |
| `handle_sync_membership_teacher()` | trigger | Copies teacher_id to memberships |
| `handle_sync_profile_names()` | trigger | Syncs full_name ↔ display_name |
| `generate_class_code()` | text | Generates unique 6-char class codes |
| `check_is_student(room_id, user_id)` | boolean | RLS helper |
| `check_is_teacher(room_id, user_id)` | boolean | RLS helper |
| `get_auth_role()` | text | Returns current user's role |
| `is_member_of_classroom(c_id, u_id)` | boolean | RLS helper |
| `is_student_of_teacher(s_id, t_id)` | boolean | RLS helper |

## Triggers

| Trigger | Table | Event | Function |
|---------|-------|-------|----------|
| `on_auth_user_created` | `auth.users` | INSERT | `handle_new_user()` |
| `on_auth_user_auto_confirm` | `auth.users` | INSERT | `auto_confirm_user()` |
| `tr_sync_membership_teacher` | `class_memberships` | INSERT | `handle_sync_membership_teacher()` |
| `tr_sync_profile_names` | `profiles` | INSERT, UPDATE | `handle_sync_profile_names()` |

---

## Reaction ID Calculation

The client computes `reaction_id` from four chemical concentrations:

```javascript
reaction_id = (chem_a * 101^3) + (chem_b * 101^2) + (chem_i * 101) + chem_c
```

This produces a unique integer for any combination. The `results` table maps `(reaction_id, regime)` → outcome.

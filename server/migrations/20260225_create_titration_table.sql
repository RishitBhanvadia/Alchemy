-- Migration: Create titration_data table
-- Created at: 2026-02-25

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS titration_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    acid_name TEXT NOT NULL,
    base_name TEXT NOT NULL,
    indicator_name TEXT NOT NULL,
    acid_molarity DECIMAL(4,2),
    base_molarity DECIMAL(4,2),
    ph_curve JSONB NOT NULL, -- Array of {v, ph}
    indicator_colors JSONB NOT NULL, -- Array of {ph_min, ph_max, color}
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO titration_data (acid_name, base_name, indicator_name, acid_molarity, base_molarity, ph_curve, indicator_colors, note)
VALUES 
(
    'HCl', 'NaOH', 'Phenolphthalein', 1.0, 1.0,
    '[{"v": 0, "ph": 1.0}, {"v": 5, "ph": 1.1}, {"v": 8, "ph": 1.3}, {"v": 9, "ph": 1.6}, {"v": 9.5, "ph": 2.0}, {"v": 9.9, "ph": 3.0}, {"v": 10.0, "ph": 7.0}, {"v": 10.1, "ph": 11.0}, {"v": 10.5, "ph": 12.0}, {"v": 11, "ph": 12.4}, {"v": 15, "ph": 13.0}]',
    '[{"ph_min": 0, "ph_max": 8.2, "color": "#3accff"}, {"ph_min": 8.2, "ph_max": 10, "color": "#ffc0cb"}, {"ph_min": 10, "ph_max": 14, "color": "#ff69b4"}]',
    'The solution of HCl is 1 M and NaOH is 1 M.'
),
(
    'H2SO4', 'NaOH', 'Phenolphthalein', 2.0, 1.0,
    '[{"v": 0, "ph": 0.7}, {"v": 5, "ph": 0.9}, {"v": 8, "ph": 1.1}, {"v": 9, "ph": 1.4}, {"v": 9.5, "ph": 1.7}, {"v": 9.9, "ph": 2.5}, {"v": 10.0, "ph": 7.0}, {"v": 10.1, "ph": 11.5}, {"v": 10.5, "ph": 12.3}, {"v": 11, "ph": 12.7}, {"v": 15, "ph": 13.1}]',
    '[{"ph_min": 0, "ph_max": 8.2, "color": "#3accff"}, {"ph_min": 8.2, "ph_max": 10, "color": "#ffc0cb"}, {"ph_min": 10, "ph_max": 14, "color": "#ff69b4"}]',
    'The solution of H2SO4 is 2 M and NaOH is 1 M.'
);

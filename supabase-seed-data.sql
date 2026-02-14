-- Populate Mock Data into Supabase
-- Run this in Supabase SQL Editor after creating the schema

-- Insert Users
-- Note: For real authentication, users should be created via Supabase Auth
-- These are just database records for the demo
INSERT INTO users (id, email, name, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'John Doe', 'normal_user'),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', 'Jane Smith', 'normal_user'),
('550e8400-e29b-41d4-a716-446655440003', 'admin@example.com', 'Admin User', 'super_user')
ON CONFLICT (email) DO NOTHING;

-- Insert Products
INSERT INTO products (id, category, investment_company) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Loan Notes', 'Woodville'),
('650e8400-e29b-41d4-a716-446655440002', 'Loan Notes', 'EIGHT Cloud'),
('650e8400-e29b-41d4-a716-446655440003', 'REIT', 'Assisted Living Project'),
('650e8400-e29b-41d4-a716-446655440004', 'Loan Notes and Profit Share', 'Acorn (St. Lenard''s Quarter)'),
('650e8400-e29b-41d4-a716-446655440005', 'Gold', '3RT'),
('650e8400-e29b-41d4-a716-446655440006', 'Gold', 'Omega Minerals'),
('650e8400-e29b-41d4-a716-446655440007', 'Private Equity', 'Bricksave'),
('650e8400-e29b-41d4-a716-446655440008', 'Private Equity', 'Precomb')
ON CONFLICT DO NOTHING;

-- Insert Investments for User 1 (John Doe)
INSERT INTO investments (
    id, user_id, product_id, amount_invested, currency, usd_equivalent,
    details_of_investment, expected_yield, investment_type, investment_date,
    maturity_date, status, contract_pdf
) VALUES
-- Investment 1
('750e8400-e29b-41d4-a716-446655440001', 
 '550e8400-e29b-41d4-a716-446655440001', 
 '650e8400-e29b-41d4-a716-446655440001',
 40000.00, 'USD', 40000.00,
 'Maturity May 2027 (2 years)',
 '10% per annum / paid quarterly',
 'Lumpsum/Regular', '2025-05-01', '2027-05-01', 'active',
 'https://example.com/contracts/woodville.pdf'),

-- Investment 2
('750e8400-e29b-41d4-a716-446655440002',
 '550e8400-e29b-41d4-a716-446655440001',
 '650e8400-e29b-41d4-a716-446655440002',
 25000.00, 'USD', 25000.00,
 'Maturity Feb 2026 (2 years)',
 'Pays 14% per annum semi annually',
 'Lumpsum', '2024-02-01', '2026-02-01', 'active',
 'https://example.com/contracts/eightcloud.pdf'),

-- Investment 3
('750e8400-e29b-41d4-a716-446655440003',
 '550e8400-e29b-41d4-a716-446655440001',
 '650e8400-e29b-41d4-a716-446655440003',
 25000.00, 'GBP', 33000.00,
 'Invested June 2025',
 'Dividends paid quarterly and exit via IPO/sale by 2028',
 'Buy and Hold', '2025-06-01', NULL, 'active',
 'https://example.com/contracts/assisted-living.pdf'),

-- Investment 4
('750e8400-e29b-41d4-a716-446655440004',
 '550e8400-e29b-41d4-a716-446655440001',
 '650e8400-e29b-41d4-a716-446655440004',
 14000.00, 'GBP', 18760.00,
 'Maturity October 2025 (3 years) - extended to October 2026',
 '17% per annum / paid at maturity',
 'Lumpsum', '2023-10-01', '2026-10-01', 'active',
 'https://example.com/contracts/acorn.pdf'),

-- Investment 5
('750e8400-e29b-41d4-a716-446655440005',
 '550e8400-e29b-41d4-a716-446655440001',
 '650e8400-e29b-41d4-a716-446655440005',
 33000.00, 'USD', 33000.00,
 'Buy-and-Hold to make gains from coin entering centralized platforms and NAV being linked to Canadian gold reserve',
 'Coin value expected to reach USD1.00 by approx. Q4 2025',
 'Buy and Hold', '2024-01-15', NULL, 'active',
 'https://example.com/contracts/3rt.pdf'),

-- Investment 6
('750e8400-e29b-41d4-a716-446655440006',
 '550e8400-e29b-41d4-a716-446655440001',
 '650e8400-e29b-41d4-a716-446655440006',
 27000.00, 'EUR', 30820.00,
 '2 year convertible loan note with bullet payment at 24 months',
 '22% bullet payment at 24 months. Conversion rate at £0.69',
 'Lumpsum', '2024-06-01', '2026-06-01', 'active',
 'https://example.com/contracts/omega.pdf'),

-- Investment 7
('750e8400-e29b-41d4-a716-446655440007',
 '550e8400-e29b-41d4-a716-446655440001',
 '650e8400-e29b-41d4-a716-446655440007',
 27000.00, 'GBP', 36180.00,
 'Buy and hold stake in private company, targeting an exit in 24 months from January 2024',
 'Expected exit value is 2.5 to 3x entry value.',
 'Buy and Hold', '2024-01-01', '2026-01-01', 'active',
 'https://example.com/contracts/bricksave.pdf'),

-- Investment 8
('750e8400-e29b-41d4-a716-446655440008',
 '550e8400-e29b-41d4-a716-446655440001',
 '650e8400-e29b-41d4-a716-446655440008',
 20000.00, 'EUR', 24500.00,
 'Anticipated exit approximately 2028',
 'Expected exit value is 4-5x entry value.',
 'Buy and Hold', '2023-03-01', '2028-03-01', 'active',
 'https://example.com/contracts/precomb.pdf')
ON CONFLICT DO NOTHING;

-- Insert Investments for User 2 (Jane Smith)
INSERT INTO investments (
    id, user_id, product_id, amount_invested, currency, usd_equivalent,
    details_of_investment, expected_yield, investment_type, investment_date,
    maturity_date, status, contract_pdf
) VALUES
-- Investment 9
('750e8400-e29b-41d4-a716-446655440009',
 '550e8400-e29b-41d4-a716-446655440002',
 '650e8400-e29b-41d4-a716-446655440001',
 50000.00, 'USD', 50000.00,
 'Maturity May 2027 (2 years)',
 '10% per annum / paid quarterly',
 'Lumpsum', '2025-05-01', '2027-05-01', 'active',
 'https://example.com/contracts/woodville-2.pdf'),

-- Investment 10
('750e8400-e29b-41d4-a716-446655440010',
 '550e8400-e29b-41d4-a716-446655440002',
 '650e8400-e29b-41d4-a716-446655440003',
 30000.00, 'GBP', 39600.00,
 'Invested June 2025',
 'Dividends paid quarterly and exit via IPO/sale by 2028',
 'Buy and Hold', '2025-06-01', NULL, 'active',
 'https://example.com/contracts/assisted-living-2.pdf')
ON CONFLICT DO NOTHING;

-- Insert Performance Projections
INSERT INTO performance_projections (
    id, investment_id, year, principal_amount, yield_amount, total_value
) VALUES
-- Projections for Investment 1
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 2025, 0, 2000.00, 2000.00),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 2026, 40000.00, 4000.00, 44000.00),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', 2027, 40000.00, 6000.00, 46000.00),

-- Projections for Investment 2
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', 2025, 0, 3500.00, 3500.00),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440002', 2026, 25000.00, 3500.00, 28500.00),

-- Projections for Investment 3
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440003', 2025, 0, 1500.00, 1500.00),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440003', 2026, 33000.00, 0, 33000.00),

-- Projections for Investment 4
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440004', 2025, 0, 0, 0),
('850e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440004', 2026, 18760.00, 7140.00, 25900.00),

-- Projections for Investment 5
('850e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440005', 2025, 33000.00, 0, 33000.00),

-- Projections for Investment 6
('850e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440006', 2026, 30820.00, 6780.00, 37600.00),

-- Projections for Investment 7
('850e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440007', 2026, 36180.00, 0, 36180.00),

-- Projections for Investment 8
('850e8400-e29b-41d4-a716-446655440013', '750e8400-e29b-41d4-a716-446655440008', 2028, 24500.00, 0, 24500.00),

-- Projections for Investment 9
('850e8400-e29b-41d4-a716-446655440014', '750e8400-e29b-41d4-a716-446655440009', 2025, 0, 2500.00, 2500.00),
('850e8400-e29b-41d4-a716-446655440015', '750e8400-e29b-41d4-a716-446655440009', 2026, 50000.00, 5000.00, 55000.00),
('850e8400-e29b-41d4-a716-446655440016', '750e8400-e29b-41d4-a716-446655440009', 2027, 50000.00, 7500.00, 57500.00),

-- Projections for Investment 10
('850e8400-e29b-41d4-a716-446655440017', '750e8400-e29b-41d4-a716-446655440010', 2025, 0, 1800.00, 1800.00),
('850e8400-e29b-41d4-a716-446655440018', '750e8400-e29b-41d4-a716-446655440010', 2026, 39600.00, 0, 39600.00)
ON CONFLICT (investment_id, year) DO NOTHING;

-- Verify the data was inserted
SELECT 'Users inserted:', COUNT(*) FROM users;
SELECT 'Products inserted:', COUNT(*) FROM products;
SELECT 'Investments inserted:', COUNT(*) FROM investments;
SELECT 'Projections inserted:', COUNT(*) FROM performance_projections;
